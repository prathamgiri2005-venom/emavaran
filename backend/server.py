from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os
import bcrypt
import jwt
import secrets

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Emavaran API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
JWT_SECRET = os.environ.get("JWT_SECRET")
JWT_ALGORITHM = "HS256"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

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

# Auth dependency
async def get_current_user(request: Request) -> dict:
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
        user = await db.admins.find_one({"_id": ObjectId(payload["sub"])})
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

# Seed admin users on startup
@app.on_event("startup")
async def seed_admins():
    admins = [
        {"email": os.environ.get("ADMIN_EMAIL_1", "manvi@emavaran.com"), "password": os.environ.get("ADMIN_PASSWORD_1", "Manvi@123"), "name": "Manvi Giri", "role": "therapist"},
        {"email": os.environ.get("ADMIN_EMAIL_2", "diksha@emavaran.com"), "password": os.environ.get("ADMIN_PASSWORD_2", "Diksha@123"), "name": "Diksha Mago", "role": "therapist"}
    ]
    
    for admin in admins:
        existing = await db.admins.find_one({"email": admin["email"]})
        if existing is None:
            hashed = hash_password(admin["password"])
            await db.admins.insert_one({
                "email": admin["email"],
                "password_hash": hashed,
                "name": admin["name"],
                "role": admin["role"],
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        elif not verify_password(admin["password"], existing["password_hash"]):
            await db.admins.update_one(
                {"email": admin["email"]},
                {"$set": {"password_hash": hash_password(admin["password"])}}
            )
    
    # Create indexes
    await db.admins.create_index("email", unique=True)
    await db.bookings.create_index("date")
    await db.bookings.create_index("therapist")

# Pydantic Models
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
    message: Optional[str] = ""
    service: Optional[str] = ""

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
    phone: Optional[str] = ""
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

# Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Auth Routes
@app.post("/api/auth/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower()
    user = await db.admins.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=86400, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "token": access_token
    }

@app.post("/api/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# Admin Routes - Bookings Management
@app.get("/api/admin/bookings")
async def get_all_bookings(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = None,
    therapist: Optional[str] = None,
    date: Optional[str] = None
):
    query = {}
    if status:
        query["status"] = status
    if therapist:
        query["therapist"] = therapist
    if date:
        query["date"] = date
    
    bookings = await db.bookings.find(query).sort("created_at", -1).to_list(500)
    
    result = []
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        del booking["_id"]
        result.append(booking)
    
    return result

@app.get("/api/admin/bookings/{booking_id}")
async def get_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    booking = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking["id"] = str(booking["_id"])
    del booking["_id"]
    return booking

@app.patch("/api/admin/bookings/{booking_id}")
async def update_booking(
    booking_id: str,
    update: BookingUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    update_data["updated_by"] = current_user["name"]
    
    result = await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    updated = await db.bookings.find_one({"_id": ObjectId(booking_id)})
    updated["id"] = str(updated["_id"])
    del updated["_id"]
    return updated

@app.delete("/api/admin/bookings/{booking_id}")
async def delete_booking(booking_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.bookings.delete_one({"_id": ObjectId(booking_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"message": "Booking deleted successfully"}

# Admin Stats
@app.get("/api/admin/stats")
async def get_stats(current_user: dict = Depends(get_current_user)):
    total_bookings = await db.bookings.count_documents({})
    pending_bookings = await db.bookings.count_documents({"status": "pending"})
    confirmed_bookings = await db.bookings.count_documents({"status": "confirmed"})
    completed_bookings = await db.bookings.count_documents({"status": "completed"})
    cancelled_bookings = await db.bookings.count_documents({"status": "cancelled"})
    total_contacts = await db.contacts.count_documents({})
    
    # Get today's bookings
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    today_bookings = await db.bookings.count_documents({"date": today})
    
    return {
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "completed_bookings": completed_bookings,
        "cancelled_bookings": cancelled_bookings,
        "today_bookings": today_bookings,
        "total_contacts": total_contacts
    }

# Admin Contact Management
@app.get("/api/admin/contacts")
async def get_all_contacts(current_user: dict = Depends(get_current_user)):
    contacts = await db.contacts.find().sort("created_at", -1).to_list(500)
    result = []
    for contact in contacts:
        contact["id"] = str(contact["_id"])
        del contact["_id"]
        result.append(contact)
    return result

# Booking Routes (Public)
@app.post("/api/bookings", response_model=BookingResponse)
async def create_booking(booking: BookingRequest):
    booking_dict = booking.model_dump()
    booking_dict["status"] = "pending"
    booking_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.bookings.insert_one(booking_dict)
    booking_dict["id"] = str(result.inserted_id)
    if "_id" in booking_dict:
        del booking_dict["_id"]
    
    return BookingResponse(**booking_dict)

@app.get("/api/bookings/available-slots")
async def get_available_slots(date: str, therapist: str):
    all_slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
    
    booked = await db.bookings.find(
        {"date": date, "therapist": therapist, "status": {"$ne": "cancelled"}},
        {"time": 1, "_id": 0}
    ).to_list(100)
    
    booked_times = [b["time"] for b in booked]
    available = [slot for slot in all_slots if slot not in booked_times]
    
    return {"date": date, "therapist": therapist, "available_slots": available}

# Contact Routes
@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact(contact: ContactRequest):
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.contacts.insert_one(contact_dict)
    contact_dict["id"] = str(result.inserted_id)
    
    return ContactResponse(**contact_dict)

# Blog Routes
@app.get("/api/blogs", response_model=List[BlogPost])
async def get_blogs():
    blogs = [
        {
            "id": "1",
            "title": "How to Manage Anxiety in Daily Life",
            "excerpt": "Discover practical strategies to navigate anxiety and find peace in everyday moments.",
            "content": "Anxiety can feel overwhelming, but with the right tools and mindset, you can learn to manage it effectively. Start by identifying your triggers...",
            "author": "Manvi Giri",
            "image_url": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
            "created_at": "2026-01-05",
            "read_time": "5 min read"
        },
        {
            "id": "2",
            "title": "The Importance of Mental Health",
            "excerpt": "Understanding why mental health matters and how to prioritize your emotional well-being.",
            "content": "Mental health is just as important as physical health. Taking care of your mind involves regular self-care practices...",
            "author": "Diksha Mago",
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "created_at": "2026-01-10",
            "read_time": "4 min read"
        },
        {
            "id": "3",
            "title": "Building Healthy Relationships",
            "excerpt": "Learn the foundations of nurturing meaningful connections with those around you.",
            "content": "Healthy relationships are built on trust, communication, and mutual respect. Here are key principles to strengthen your bonds...",
            "author": "Manvi Giri",
            "image_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
            "created_at": "2026-01-15",
            "read_time": "6 min read"
        }
    ]
    return blogs

@app.get("/api/blogs/{blog_id}", response_model=BlogPost)
async def get_blog(blog_id: str):
    blogs = {
        "1": {
            "id": "1",
            "title": "How to Manage Anxiety in Daily Life",
            "excerpt": "Discover practical strategies to navigate anxiety and find peace in everyday moments.",
            "content": """Anxiety can feel overwhelming, but with the right tools and mindset, you can learn to manage it effectively.

**Understanding Your Triggers**
The first step is identifying what triggers your anxiety. Keep a journal to track when anxious feelings arise and what preceded them.

**Breathing Techniques**
Deep breathing activates your parasympathetic nervous system. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8.

**Mindfulness Practice**
Being present helps reduce worry about the future. Start with just 5 minutes of mindful breathing each day.

**Physical Activity**
Exercise releases endorphins and reduces stress hormones. Even a 15-minute walk can make a difference.

**Seek Support**
Remember, you don't have to face anxiety alone. Professional counseling can provide personalized strategies for your journey.""",
            "author": "Manvi Giri",
            "image_url": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
            "created_at": "2026-01-05",
            "read_time": "5 min read"
        },
        "2": {
            "id": "2",
            "title": "The Importance of Mental Health",
            "excerpt": "Understanding why mental health matters and how to prioritize your emotional well-being.",
            "content": """Mental health is just as important as physical health. Taking care of your mind involves regular self-care practices and awareness.

**Breaking the Stigma**
Mental health challenges are common and nothing to be ashamed of. Seeking help is a sign of strength, not weakness.

**Daily Self-Care**
Simple practices like adequate sleep, healthy eating, and taking breaks can significantly impact your mental well-being.

**Connection Matters**
Human connection is vital for mental health. Nurture your relationships and don't hesitate to reach out when you need support.

**Professional Support**
Therapists and counselors are trained to help you navigate life's challenges. Regular check-ins can prevent small issues from becoming bigger ones.

**Your Mental Health Journey**
Remember, mental health is not a destination but a journey. Be patient and compassionate with yourself along the way.""",
            "author": "Diksha Mago",
            "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
            "created_at": "2026-01-10",
            "read_time": "4 min read"
        },
        "3": {
            "id": "3",
            "title": "Building Healthy Relationships",
            "excerpt": "Learn the foundations of nurturing meaningful connections with those around you.",
            "content": """Healthy relationships are built on trust, communication, and mutual respect. Here are key principles to strengthen your bonds.

**Communication is Key**
Express your feelings openly and listen actively. Use "I" statements to share your perspective without blame.

**Setting Boundaries**
Healthy boundaries protect your well-being and the relationship. It's okay to say no and express your needs.

**Quality Time**
In our busy lives, intentional time together matters. Put away distractions and be fully present with loved ones.

**Conflict Resolution**
Disagreements are normal. Focus on understanding each other's perspective rather than winning arguments.

**Growing Together**
Support each other's individual growth while nurturing your connection. The strongest relationships evolve together.

**When to Seek Help**
If relationship challenges feel overwhelming, couples counseling can provide tools for healthier communication and connection.""",
            "author": "Manvi Giri",
            "image_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
            "created_at": "2026-01-15",
            "read_time": "6 min read"
        }
    }
    
    if blog_id not in blogs:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    return blogs[blog_id]

# Therapists data
@app.get("/api/therapists")
async def get_therapists():
    return [
        {
            "id": "manvi",
            "name": "Manvi Giri",
            "title": "Counseling Psychologist | Mental Health Advocate",
            "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/9ciapjg1_WhatsApp%20Image%202026-04-10%20at%204.06.18%20PM.jpeg",
            "experience": "2+ years",
            "specializations": ["Emotional Regulation", "Self-Esteem", "Life Skills Training", "Personal Growth"],
            "bio": "Manvi Giri is a dedicated and empathetic Counseling Psychologist with over two years of experience in supporting the emotional and psychological well-being of individuals. Her therapeutic approach is client-centered and strengths-based, focusing on creating a safe, supportive, and non-judgmental space for individuals to explore their thoughts and emotions.",
            "full_bio": "Manvi Giri is a dedicated and empathetic Counseling Psychologist with over two years of experience in supporting the emotional and psychological well-being of individuals across diverse settings. With a Master's degree in Counseling Psychology and extensive experience in private practices, NGOs, and schools, she works closely with adults and adolescents navigating a range of emotional and developmental challenges.\n\nHer therapeutic approach is client-centered and strengths-based, focusing on creating a safe, supportive, and non-judgmental space for individuals to explore their thoughts and emotions. She integrates practical techniques and evidence-based strategies to foster self-awareness, emotional regulation, and resilience.\n\nHer work includes addressing concerns such as emotional regulation, self-esteem, peer relationships, and stress management. As a Life Skills Trainer, she designs and facilitates engaging sessions that focus on building self-belief, communication skills, problem-solving abilities, and emotional strength.\n\nShe is also experienced in psychoeducation and workshop facilitation, conducting interactive sessions for adults on themes such as self-confidence, emotional well-being, boundaries, and personal growth.\n\nAs the co-founder of Emavaran, Manvi is committed to making mental health support accessible, relatable, and impactful. Her work is guided by empathy, authenticity, and a deep commitment to fostering growth, resilience, and meaningful change."
        },
        {
            "id": "diksha",
            "name": "Diksha Mago",
            "title": "Counseling Psychologist | Expressive Art Therapist | Mental Health Advocate",
            "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/k1imk6ox_IMG_3581.JPG.jpeg",
            "experience": "2+ years",
            "specializations": ["Expressive Art Therapy", "CBT", "Gestalt Therapy", "Emotion-Focused Therapy"],
            "bio": "Diksha Mago is a compassionate Counseling Psychologist with a strong foundation in evidence-based therapeutic practices. Her therapeutic approach is integrative and client-centered, drawing from CBT, Gestalt Therapy, Emotion-Focused Therapy, and Expressive Art Therapy.",
            "full_bio": "Diksha Mago is a compassionate and dedicated Counseling Psychologist with a strong foundation in evidence-based therapeutic practices, around 2 years of experience and a deep commitment to emotional well-being. With a Master's degree in Counselling Psychology and PG Diploma in Psychological Counseling along with extensive experience across clinical, rehabilitation, and community settings, she supports individuals navigating a wide range of emotional and psychological challenges.\n\nHer therapeutic approach is integrative and client-centered, drawing from Cognitive Behavioral Therapy (CBT), Gestalt Therapy, Emotion-Focused Therapy, and Expressive Art Therapy. She creates a safe, non-judgmental space where individuals can explore their thoughts and emotions, build self-awareness, and develop healthier coping mechanisms.\n\nDiksha has worked with diverse populations, including children with special needs, individuals in rehabilitation settings, and adolescents in shelter homes—providing individual, group, workshops and family counseling. She is also experienced in Expressive Art Therapy, using creative techniques like drawing, painting, music, movement, storytelling and reflective exercises to facilitate emotional expression and healing.\n\nAs a workshop facilitator, she conducts interactive and experiential sessions on emotional strength, self-expression, stress management, and mental health awareness.\n\nBeing a co-founder of Emavaran, she contributes to promoting accessible and impactful mental health support. Alongside her clinical practice, Diksha is also an experienced content writer, creating relatable mental health content to spread awareness and reduce stigma.\n\nHer work is rooted in empathy, creativity, and a genuine commitment to helping individuals move toward healing, growth, and self-discovery."
        }
    ]

# Services data
@app.get("/api/services")
async def get_services():
    return [
        {
            "id": "student",
            "title": "Student Therapy",
            "description": "Specially designed for students navigating academic pressure, career confusion, peer relationships, and personal growth. A supportive space to address the unique challenges of student life while building emotional resilience and coping skills.",
            "duration": "50-60 minutes",
            "icon": "graduation",
            "price": 799,
            "price_display": "₹799"
        },
        {
            "id": "individual",
            "title": "Individual Counseling",
            "description": "For when your thoughts feel overwhelming, your emotions feel intense, or you feel disconnected from yourself. A safe, confidential space where you can slow down, process your experiences, and feel truly heard—without judgment.",
            "duration": "50-60 minutes",
            "icon": "user",
            "price": 999,
            "price_display": "₹999"
        },
        {
            "id": "online",
            "title": "Online Counseling",
            "description": "For when you seek emotional support with comfort, privacy, and flexibility. Access therapy from your own safe space, at your own pace. These sessions are designed to help you stay connected to your mental well-being while navigating life's challenges.",
            "duration": "50-60 minutes",
            "icon": "monitor",
            "price": 999,
            "price_display": "₹999"
        },
        {
            "id": "workshops",
            "title": "Workshops",
            "description": "Spaces for self-awareness, emotional growth, and meaningful connection. Designed for adults and young girls, these workshops offer experiential learning around themes like self-worth, emotional regulation, relationships, and boundaries.",
            "duration": "Varies",
            "icon": "users",
            "price": 999,
            "price_display": "₹999"
        },
        {
            "id": "art-therapy",
            "title": "Expressive Art Therapy",
            "description": "For when emotions feel difficult to put into words. Using creative processes like art, movement, and guided expression, this approach helps you explore and process emotions on a deeper level.",
            "duration": "50-60 minutes",
            "icon": "palette",
            "price": 999,
            "price_display": "₹999"
        },
        {
            "id": "group",
            "title": "Group Counseling",
            "description": "For when you feel alone in your experiences. A supportive therapeutic space where individuals come together to share, listen, and connect. Group counseling fosters a sense of belonging and shared healing.",
            "duration": "60-90 minutes",
            "icon": "heart",
            "price": 999,
            "price_display": "₹999"
        },
        {
            "id": "psychoeducation",
            "title": "Psychoeducation Sessions",
            "description": "For when you want to better understand your mental and emotional world. These sessions focus on building awareness around thoughts, emotions, and behavioral patterns with practical insights.",
            "duration": "45-60 minutes",
            "icon": "sparkles",
            "price": 999,
            "price_display": "₹999"
        }
    ]

# FAQs
@app.get("/api/faqs")
async def get_faqs():
    return [
        {
            "question": "What can I expect in my first session?",
            "answer": "Your first session is about getting to know each other. We'll discuss what brings you to therapy, your goals, and how we can best support you. It's a safe space to share at your own pace."
        },
        {
            "question": "How long does each session last?",
            "answer": "Each session typically lasts between 50-60 minutes, giving you ample time to explore your thoughts and feelings."
        },
        {
            "question": "Is everything I share confidential?",
            "answer": "Yes, confidentiality is a cornerstone of our practice. Everything discussed in sessions remains private, with very few legal exceptions that we'll explain clearly."
        },
        {
            "question": "How many sessions will I need?",
            "answer": "The number of sessions varies for each person. Some find relief in a few sessions, while others benefit from longer-term support. We'll work together to determine what's best for you."
        },
        {
            "question": "Can I choose my therapist?",
            "answer": "Absolutely! You can choose to work with either Manvi or Diksha based on their specializations or simply who you feel most comfortable with."
        },
        {
            "question": "Do you offer online sessions?",
            "answer": "Yes, we offer both in-person and online sessions to accommodate your preferences and schedule."
        }
    ]

# Testimonials
@app.get("/api/testimonials")
async def get_testimonials():
    return [
        {
            "id": "1",
            "name": "Anonymous",
            "text": "Finding Emavaran was a turning point in my life. The compassionate approach helped me understand myself better and develop healthier coping mechanisms.",
            "rating": 5
        },
        {
            "id": "2",
            "name": "R.S.",
            "text": "I was hesitant about therapy, but the warm and non-judgmental environment made all the difference. I've learned so much about managing my anxiety.",
            "rating": 5
        },
        {
            "id": "3",
            "name": "Anonymous",
            "text": "The relationship counseling sessions transformed how I communicate with my partner. We're stronger than ever thanks to the guidance we received.",
            "rating": 5
        },
        {
            "id": "4",
            "name": "P.K.",
            "text": "Professional, empathetic, and truly caring. I felt heard and supported throughout my journey. Highly recommend Emavaran to anyone seeking help.",
            "rating": 5
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
