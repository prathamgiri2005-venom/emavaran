from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from bson import ObjectId
import os
import bcrypt
import jwt

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Configuration
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "emavaran")
JWT_SECRET = os.environ.get("JWT_SECRET", "default-secret-change-in-production")
JWT_ALGORITHM = "HS256"
NOTIFICATION_EMAIL = "emavarantherapy@gmail.com"

# MongoDB client
client: Optional[AsyncIOMotorClient] = None
db = None

def get_db():
    global client, db
    if client is None:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client[DB_NAME]
    return db

# Pydantic Models - Define BEFORE lifespan
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class BookingRequest(BaseModel):
    therapist: str
    date: str
    time: str
    name: str
    email: EmailStr
    phone: str
    message: str = ""
    service: str = ""

class BookingResponse(BaseModel):
    id: str
    therapist: str
    date: str
    time: str
    name: str
    email: str
    phone: str
    message: str
    status: str
    created_at: str

class BookingUpdateRequest(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    payment_status: Optional[str] = None

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    created_at: str

class BlogPost(BaseModel):
    id: str
    title: str
    excerpt: str
    content: str
    author: str
    image_url: str
    created_at: str
    read_time: str

# Password hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Seed admin users
async def seed_admins(database):
    admins = [
        {"email": os.environ.get("ADMIN_EMAIL_1", "manvi@emavaran.com"), "password": os.environ.get("ADMIN_PASSWORD_1", "Manvi@123"), "name": "Manvi Giri", "role": "therapist"},
        {"email": os.environ.get("ADMIN_EMAIL_2", "diksha@emavaran.com"), "password": os.environ.get("ADMIN_PASSWORD_2", "Diksha@123"), "name": "Diksha Mago", "role": "therapist"}
    ]
    
    for admin in admins:
        existing = await database.admins.find_one({"email": admin["email"]})
        if existing is None:
            hashed = hash_password(admin["password"])
            await database.admins.insert_one({
                "email": admin["email"],
                "password_hash": hashed,
                "name": admin["name"],
                "role": admin["role"],
                "created_at": datetime.now(timezone.utc).isoformat()
            })
    
    try:
        await database.admins.create_index("email", unique=True)
        await database.bookings.create_index("date")
        await database.bookings.create_index("therapist")
    except Exception:
        pass

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    database = get_db()
    await seed_admins(database)
    yield
    if client:
        client.close()

app = FastAPI(title="Emavaran API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth dependency
async def get_current_user(request: Request) -> dict:
    database = get_db()
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await database.admins.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        del user["_id"]
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Email notification
async def send_booking_notification(booking_data: dict):
    database = get_db()
    notification = {
        "type": "new_booking",
        "to_email": NOTIFICATION_EMAIL,
        "subject": f"New Booking Request - {booking_data['name']}",
        "body": f"New booking from {booking_data['name']} ({booking_data['email']}) for {booking_data['date']} at {booking_data['time']} with {booking_data['therapist']}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending"
    }
    await database.notifications.insert_one(notification)
    return notification

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.post("/api/auth/login")
async def login(request: LoginRequest, response: Response):
    database = get_db()
    email = request.email.lower()
    user = await database.admins.find_one({"email": email})
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {"id": user_id, "email": user["email"], "name": user["name"], "role": user["role"], "token": access_token}

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/api/admin/bookings")
async def get_all_bookings(current_user: dict = Depends(get_current_user), status: Optional[str] = None, therapist: Optional[str] = None, date: Optional[str] = None):
    database = get_db()
    query = {}
    if status: query["status"] = status
    if therapist: query["therapist"] = therapist
    if date: query["date"] = date
    
    bookings = await database.bookings.find(query).sort("created_at", -1).to_list(500)
    result = []
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        del booking["_id"]
        result.append(booking)
    return result

@app.get("/api/admin/bookings/{booking_id}")
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    database = get_db()
    booking = await database.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking["id"] = str(booking["_id"])
    del booking["_id"]
    return booking

@app.patch("/api/admin/bookings/{booking_id}")
async def update_booking(booking_id: str, update: BookingUpdateRequest, current_user: dict = Depends(get_current_user)):
    database = get_db()
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    update_data["updated_by"] = current_user["name"]
    
    result = await database.bookings.update_one({"_id": ObjectId(booking_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    updated = await database.bookings.find_one({"_id": ObjectId(booking_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    return updated

@app.delete("/api/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    database = get_db()
    result = await database.bookings.delete_one({"_id": ObjectId(booking_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}

@app.get("/api/admin/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    database = get_db()
    total_bookings = await database.bookings.count_documents({})
    pending_bookings = await database.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await database.bookings.count_documents({"status": "confirmed"})
    completed_bookings = await database.bookings.count_documents({"status": "completed"})
    cancelled_bookings = await database.bookings.count_documents({"status": "cancelled"})
    total_contacts = await database.contacts.count_documents({})
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_bookings = await database.bookings.count_documents({"date": today})
    
    return {
        "total_bookings": total_bookings, "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings, "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings, "today_bookings": today_bookings,
        "total_contacts": total_contacts
    }

@app.get("/api/admin/contacts")
async def get_all_contacts(current_user: dict = Depends(get_current_user)):
    database = get_db()
    contacts = await database.contacts.find().sort("created_at", -1).to_list(500)
    result = []
    for contact in contacts:
        contact["id"] = str(contact["_id"])
        del contact["_id"]
        result.append(contact)
    return result

@app.get("/api/admin/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    database = get_db()
    notifications = await database.notifications.find().sort("created_at", -1).to_list(100)
    result = []
    for notif in notifications:
        notif["id"] = str(notif["_id"])
        del notif["_id"]
        result.append(notif)
    return result

@app.post("/api/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingRequest):
    database = get_db()
    booking_dict = booking.model_dump()
    booking_dict["status"] = "pending"
    booking_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await database.bookings.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    if "_id" in booking_dict:
        del booking_dict["_id"]
    
    await send_booking_notification(booking_dict)
    return BookingResponse(**booking_dict)

@app.get("/api/bookings/available-slots")
async def get_available_slots(date: str, therapist: str):
    database = get_db()
    all_slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
    booked = await database.bookings.find({"date": date, "therapist": therapist, "status": {"$ne": "cancelled"}}, {"time": 1, "_id": 0}).to_list(100)
    booked_times = [b["time"] for b in booked]
    available = [slot for slot in all_slots if slot not in booked_times]
    return {"date": date, "therapist": therapist, "available_slots": available}

@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact(contact: ContactRequest):
    database = get_db()
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await database.contacts.insert_one(contact_dict)
    contact_dict["id"] = str(result.inserted_id)
    return ContactResponse(**contact_dict)

# Blog articles (shared between list and detail endpoints)
BLOG_ARTICLES = [
    {
        "id": "1",
        "title": "Different Cultural Expressions of Overwhelming Emotions",
        "excerpt": "Cultural norms shape how we express or repress intense emotions — from Western openness to Eastern restraint — and impact the stigma around mental health.",
        "author": "Emavaran Team",
        "image_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop",
        "created_at": "2026-01-20",
        "read_time": "7 min read",
        "content": (
            "**Introduction: Emotions Are Universal, Expression Is Not**\n\n"
            "People all throughout the world experience the same basic emotions — sadness, anger, fear, joy, and shame — but their expressions can range greatly. The society we are raised in has a significant influence on how we express or repress intense emotions. As per the society we are born and brought up in, the family we grow with, and the cultural activities we experience, we internalise and believe in what is acceptable and normal, and what is not.\n\n"
            "**Cultural Valuations of Restraint and Openness**\n\n"
            "Emotional restraint is valued in some cultures as a show of strength, maturity, or respect, while others promote overt displays of emotion. In many Western communities, such as those in the US or parts of Europe, emotional openness is considered essential and beneficial. As a component of emotional well-being, it is acceptable and even encouraged — which leads to more people opting for therapy for self-development and regulating overwhelming emotions.\n\n"
            "In these communities, emotional expression promotes self-improvement, sincerity, and clarity. However, certain feelings are more acceptable than others. Joy or happiness is praised, but mostly acceptable in moments — not sustained displays.\n\n"
            "**The Eastern Perspective: Harmony Over Expression**\n\n"
            "Harmony is frequently valued more highly than individual expression in many Eastern cultures, including those of Japan, Korea, and India, as these communities are more collectivist in nature. Thus, it is usually discouraged to express strong emotions, particularly those that could upset social balance — such as intense sadness, social anger, or irritation. From an early age, individuals are trained to look out for the group or family. Emotional restraint here is a show of wisdom and concern for others, rather than repression.\n\n"
            "**Ritualized and Public Emotional Expression**\n\n"
            "There are also societies where rituals are deeply ingrained and emotional expression is an essential part of the culture. Public expressions of joy, grief, or rage are not only common but accepted in some countries of Latin America, Africa, and the Middle East. Celebration and mourning are both done as a group — crafting emotional expression as a shared experience and a means of maintaining relationships through life's highs and lows.\n\n"
            "**Stigma Wears Different Faces Everywhere**\n\n"
            "Though emotional expression varies by country, stigma can be found everywhere, in different forms. Vulnerability can be viewed as a sign of weakness in some cultures — someone who doesn't communicate enough may be characterized as cold and aloof in others. These cultural standards often form the foundation of stigma around mental health, particularly emotional suffering.\n\n"
            "Asking for assistance can feel like a personal failure rather than a brave act if a culture teaches people that being strong means being silent. This is especially true for emotions that are messy or overwhelming — severe anxiety, sadness, or trauma-driven feelings — being suppressed behind closed doors, misrepresented as physical ailments, or disregarded until they blow up.\n\n"
            "**Psychological Literacy and Cultural Relativity**\n\n"
            "This is not just a contextual result but also a product of psychological literacy — how much a culture prioritises psychological well-being alongside physical health. Another crucial point: every emotional expression is unique, and neither better nor worse. Every culture creates its own emotional rules based on its history, values, and what has allowed its members to survive.\n\n"
            "**A Global Shift Toward Acceptance**\n\n"
            "As the world grows more interconnected, people are starting to challenge these norms and make room for alternative ways of being. This needs courage, love, support, and much more acceptance."
        )
    },
    {
        "id": "2",
        "title": "Spirituality and Faith in Psychology: Bridging Inner Belief and Mental Well-Being",
        "excerpt": "Modern psychology increasingly recognises spirituality and faith as complementary — not opposing — forces that support meaning, resilience, and emotional healing.",
        "author": "Emavaran Team",
        "image_url": "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop",
        "created_at": "2026-01-25",
        "read_time": "8 min read",
        "content": (
            "**Introduction: A Shift in Perspective**\n\n"
            "Religion, theology, or philosophy have traditionally been seen as the fields that deal with spirituality and faith. On the other hand, modern psychology is beginning to acknowledge that these factors are important for mental health, emotional stability, and personal development — slowly shifting focus back to traditional forms of healing and taking up teachings and practices which aid development. Many mental health professionals now see psychology and spirituality as potentially complementary aspects of the human experience rather than as opposing forces.\n\n"
            "**Defining Spirituality in Psychology**\n\n"
            "According to psychology, spirituality is not always limited to institutional belief systems or religious teaching. Rather, it is regarded as a very personal experience that has to do with feelings of transcendence, connection, meaning, and purpose. It includes our intrapersonal and interpersonal connection, a sense of meaning in life, values that align with us, and beliefs about the inevitable forms of life like suffering, death, and healing.\n\n"
            "**Understanding Faith in a Psychological Context**\n\n"
            "Faith, on the other hand, is defined as the internal confidence or hope that one has in life, in oneself, or in a larger system of meaning — not just a religious belief. As psychologists move towards combining traditional and contemporary forms of healing, faith in a higher power, meaning-making, and emotional regulation through chanting and meditative practices are considered important in times of crisis, grief, or existential reflection.\n\n"
            "**The Psychological Benefits of Spirituality and Faith**\n\n"
            "From a psychological standpoint, these factors support what Viktor Frankl called the \"will to meaning\" — a basic driving force that propels people to discover meaning even in the most trying situations. Frankl's logotherapy emphasises that healing is more than just feeling better; it involves finding a purpose or drive to live even in suffering.\n\n"
            "This aligns with other schools of thought — existential therapy, humanistic psychology, and transpersonal psychology — which examine finding meaning, establishing healthy relationships with self and others, and gaining self-actualisation and transcendence in the therapeutic process.\n\n"
            "Additional evidence for the psychological benefits of spiritual practices has come from positive psychology research. Practices like mindfulness, forgiveness, compassion, and gratitude — many rooted in spiritual or religious traditions — improve emotional well-being, lessen symptoms of anxiety and depression, and promote inner peace. Spiritual communities can also provide ritual, structure, belonging, and social support — all protective factors for mental health.\n\n"
            "**Integrating Spirituality into Therapeutic Practice**\n\n"
            "Integrating spirituality into treatment needs openness and awareness from both client and therapist. With ethical understanding, cultural sensitivity, and curiosity, the therapist must be careful not to push beyond boundaries of the professional relationship or hurt the sentiments of the client in any way.\n\n"
            "This can entail examining the client's beliefs, spiritual challenges, or existential issues and letting them guide the therapeutic process. Therapists must exercise caution when interpreting spiritual experiences through a purely clinical lens — or imposing their own beliefs.\n\n"
            "**Navigating the Nexus of Spirituality and Psychology**\n\n"
            "Distinguishing between spiritual experiences and psychological symptoms is one of the difficulties at this intersection. Some people may view mystical experiences or altered states of consciousness as culturally or spiritually meaningful, but from a clinical standpoint, they may be symptoms of psychosis. Making the correct diagnosis and using the right tools as per the context and medical history of the client is of utmost importance.\n\n"
            "**Conclusion: A Comprehensive Understanding of Well-Being**\n\n"
            "Including spirituality and religion into psychological practice encourages a more comprehensive understanding of human well-being — taking into account not just the cognitive and emotional aspects of life but also its existential, moral, and spiritual dimensions. This is aiding modern psychology and clients in a number of profound ways."
        )
    },
    {
        "id": "3",
        "title": "Effect of Heatwaves on Mental Health: Rising Fears Through Rising Temperatures",
        "excerpt": "Extreme heat doesn't just drain the body — it heightens anxiety, aggression, and cognitive fatigue. A look at heatwaves' overlooked toll on mental wellbeing.",
        "author": "Emavaran Team",
        "image_url": "https://images.unsplash.com/photo-1561484930-998b6a7b22e8?w=1200&auto=format&fit=crop",
        "created_at": "2026-02-01",
        "read_time": "6 min read",
        "content": (
            "**Introduction: The Growing Threat of Heatwaves**\n\n"
            "There has been a concerning rise in heatwaves in India, with record-breaking temperatures becoming common across the country. Extreme heat has been shown to cause physical risks like dehydration, heat stroke, and cardiovascular problems — but its effects on mental health are frequently disregarded. Prolonged exposure to high temperatures is a major public health problem since it can lead to increased anxiety, aggressiveness, and mental fatigue, according to research.\n\n"
            "**The Psychological Toll of Extreme Heat**\n\n"
            "Extreme heat has a substantial psychological toll. With the discomfort of high temperatures comes a surge in electricity demand — more usage of fans and air conditioners creates more pressure and leads to increased power cuts. This causes discomfort, disturbs sleep and appetite, and disrupts day-to-day functioning.\n\n"
            "Researchers state that extreme heat is strongly associated with increased hostility, exacerbating symptoms for people who already suffer from mental health concerns. Higher temperatures have been associated with an increase in domestic disputes and interpersonal violence. Exposure to heat can also affect cognitive function — resulting in memory problems, difficulty making decisions, and decreased focus. These effects have a detrimental impact on academic achievement and work productivity.\n\n"
            "**Impact on Daily Life and Vulnerable Populations**\n\n"
            "Heatwaves make it harder to get comfortable sleep, affecting performance at the workplace and in school — impacting our health physically and psychologically. This increases the likelihood of experiencing depressive symptoms and causes mood swings and exhaustion.\n\n"
            "Certain groups are more vulnerable. Children and the elderly struggle to regulate body temperature and stay hydrated. Extreme temperatures may worsen symptoms of pre-existing mental health disorders. Farmers, construction workers, street vendors, and other outdoor labourers are exposed to high temperatures for extended periods, raising their risk of physical and mental health issues. Low-income populations are especially susceptible — they may not have access to cooling equipment, face longer power cuts, and have fewer resources for comfort.\n\n"
            "**Preventive Measures and Mitigation Strategies**\n\n"
            "Since heatwaves are becoming more frequent and intense due to global warming, preventive steps must be taken to protect mental health:\n\n"
            "• Drink enough water and stay hydrated throughout the day.\n"
            "• Avoid direct sun — or at least cover your head and face with a scarf or hat.\n"
            "• Use cooling techniques like fans and cold showers.\n"
            "• Maintain a regular sleep pattern and create a cool resting environment.\n"
            "• Use stress-reduction strategies — breathing exercises, mindfulness, meditation.\n\n"
            "Governments and organisations should implement heat action plans that guarantee access to cooling shelters, mental health helplines, and public education campaigns to raise awareness of the psychological effects of high heat.\n\n"
            "**Conclusion: A Holistic Approach to Managing Heatwaves**\n\n"
            "Along with taking steps to control climatic conditions and global warming, heatwaves can be managed with a few changes and additions to our lifestyle. To lessen the impacts of excessive heat, it is essential to understand its psychological implications and take preventative action — implementing heat-resilient policies, increasing awareness, and enhancing access to mental health resources."
        )
    }
]

@app.get("/api/blogs", response_model=List[BlogPost])
async def get_blogs():
    return BLOG_ARTICLES

@app.get("/api/blogs/{blog_id}", response_model=BlogPost)
async def get_blog(blog_id: str):
    for blog in BLOG_ARTICLES:
        if blog["id"] == blog_id:
            return blog
    raise HTTPException(status_code=404, detail="Blog not found")

@app.get("/api/therapists")
async def get_therapists():
    return [
        {"id": "manvi", "name": "Manvi Giri", "title": "Counseling Psychologist | Mental Health Advocate", "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/9ciapjg1_WhatsApp%20Image%202026-04-10%20at%204.06.18%20PM.jpeg", "experience": "2+ years", "specializations": ["Emotional Regulation", "Self-Esteem", "Life Skills Training"], "bio": "Manvi is a dedicated Counseling Psychologist with a client-centered approach."},
        {"id": "diksha", "name": "Diksha Mago", "title": "Counseling Psychologist | Expressive Art Therapist", "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/k1imk6ox_IMG_3581.JPG.jpeg", "experience": "2+ years", "specializations": ["Expressive Art Therapy", "CBT", "Gestalt Therapy"], "bio": "Diksha is a compassionate therapist with an integrative approach."}
    ]

@app.get("/api/services")
async def get_services():
    return [
        {"id": "student", "title": "Student Therapy", "description": "Specially designed for students navigating academic pressure and personal growth.", "duration": "50-60 minutes", "icon": "graduation", "price": 799, "price_display": "₹799"},
        {"id": "individual", "title": "Individual Counseling", "description": "A safe, confidential space to process your experiences and build resilience.", "duration": "50-60 minutes", "icon": "user", "price": 999, "price_display": "₹999"},
        {"id": "art-therapy", "title": "Expressive Art Therapy", "description": "Using creative processes to explore and process emotions on a deeper level.", "duration": "50-60 minutes", "icon": "palette", "price": 999, "price_display": "₹999"},
        {"id": "group", "title": "Group Counseling", "description": "A supportive space where individuals come together to share and connect.", "duration": "60-90 minutes", "icon": "heart", "price": 999, "price_display": "₹999"},
        {"id": "workshops", "title": "Workshops", "description": "Spaces for self-awareness, emotional growth, and meaningful connection.", "duration": "Varies", "icon": "users", "price": 999, "price_display": "₹999"},
        {"id": "psychoeducation", "title": "Psychoeducation Sessions", "description": "Building awareness around thoughts, emotions, and behavioral patterns.", "duration": "45-60 minutes", "icon": "sparkles", "price": 999, "price_display": "₹999"}
    ]

@app.get("/api/faqs")
async def get_faqs():
    return [
        {"question": "What can I expect in my first session?", "answer": "Your first session is about getting to know each other and discussing your goals."},
        {"question": "How long does each session last?", "answer": "Each session typically lasts between 50-60 minutes."},
        {"question": "Is everything I share confidential?", "answer": "Yes, confidentiality is a cornerstone of our practice."},
        {"question": "How many sessions will I need?", "answer": "The number varies for each person. We'll work together to determine what's best."},
        {"question": "Can I choose my therapist?", "answer": "Yes! You can choose to work with either Manvi or Diksha."},
        {"question": "Do you offer online sessions?", "answer": "Yes, we offer both in-person and online sessions."}
    ]

@app.get("/api/testimonials")
async def get_testimonials():
    return [
        {"id": "1", "name": "Anonymous", "text": "Finding Emavaran was a turning point in my life.", "rating": 5},
        {"id": "2", "name": "R.S.", "text": "The warm environment made all the difference in managing my anxiety.", "rating": 5},
        {"id": "3", "name": "Anonymous", "text": "The counseling sessions transformed how I communicate.", "rating": 5},
        {"id": "4", "name": "P.K.", "text": "Professional, empathetic, and truly caring. Highly recommend!", "rating": 5}
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
