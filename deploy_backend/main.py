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
        "body": f"New booking from {booking_data['name']} ({booking_data['email']})",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "status": "pending"
    }
    await database.notifications.insert_one(notification)

    try:
        import resend
        resend.api_key = os.environ.get("RESEND_API_KEY")
        therapist_name = "Manvi Giri" if booking_data['therapist'] == 'manvi' else "Diksha Mago"
        resend.Emails.send({
            "from": "noreply@emavaran.in",
            "to": ["emavarantherapy@gmail.com"],
            "subject": f"🎉 New Booking - {booking_data['name']}",
        "html": f"""
<h2>New Session Booking!</h2>
<p><b>Name:</b> {booking_data['name']}</p>
<p><b>Email:</b> {booking_data['email']}</p>
<p><b>Phone:</b> {booking_data['phone']}</p>
<p><b>Service:</b> {booking_data.get('service', 'Not specified')}</p>
<p><b>Date:</b> {booking_data['date']}</p>
<p><b>Time:</b> {booking_data['time']}</p>
<p><b>Message:</b> {booking_data.get('message', 'None')}</p>
"""
        })
    except Exception as e:
        print(f"Email error: {e}")

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
@app.get("/api/bookings/available-slots")
async def get_available_slots(date: str):
    database = get_db()
    all_slots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"]
    booked = await database.bookings.find({"date": date, "status": {"$ne": "cancelled"}}, {"time": 1, "_id": 0}).to_list(100)
    booked_times = [b["time"] for b in booked]
    available = [slot for slot in all_slots if slot not in booked_times]
    return {"date": date, "available_slots": available}

@app.post("/api/contact", response_model=ContactResponse)
@app.post("/api/contact", response_model=ContactResponse)
async def submit_contact(contact: ContactRequest):
    database = get_db()
    contact_dict = contact.model_dump()
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await database.contacts.insert_one(contact_dict)
    contact_dict["id"] = str(result.inserted_id)

    try:
        import resend
        resend.api_key = os.environ.get("RESEND_API_KEY")
        resend.Emails.send({
            "from": "noreply@emavaran.in",
            "to": ["emavarantherapy@gmail.com"],
            "subject": f"📩 New Contact Message - {contact_dict['subject']}",
            "html": f"""
<h2>New Contact Form Submission!</h2>
<p><b>Name:</b> {contact_dict['name']}</p>
<p><b>Email:</b> {contact_dict['email']}</p>
<p><b>Phone:</b> {contact_dict.get('phone', 'Not provided')}</p>
<p><b>Subject:</b> {contact_dict['subject']}</p>
<p><b>Message:</b> {contact_dict['message']}</p>
"""
        })
    except Exception as e:
        print(f"Contact email error: {e}")

    return ContactResponse(**contact_dict)
@app.get("/api/blogs", response_model=List[BlogPost])
async def get_blogs():
    return [
        {"id": "1", "title": "How to Manage Anxiety in Daily Life", "excerpt": "Discover practical strategies to navigate anxiety.", "content": "Anxiety can feel overwhelming, but with the right tools, you can manage it.", "author": "Manvi Giri", "image_url": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800", "created_at": "2026-01-05", "read_time": "5 min read"},
        {"id": "2", "title": "The Importance of Mental Health", "excerpt": "Understanding why mental health matters.", "content": "Mental health is just as important as physical health.", "author": "Diksha Mago", "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", "created_at": "2026-01-10", "read_time": "4 min read"},
        {"id": "3", "title": "Building Healthy Relationships", "excerpt": "Learn the foundations of nurturing connections.", "content": "Healthy relationships are built on trust and communication.", "author": "Manvi Giri", "image_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800", "created_at": "2026-01-15", "read_time": "6 min read"}
    ]

@app.get("/api/blogs/{blog_id}", response_model=BlogPost)
async def get_blog(blog_id: str):
    blogs = {
        "1": {"id": "1", "title": "How to Manage Anxiety in Daily Life", "excerpt": "Discover practical strategies.", "content": "Anxiety can feel overwhelming. Understanding triggers, breathing techniques, and mindfulness can help.", "author": "Manvi Giri", "image_url": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800", "created_at": "2026-01-05", "read_time": "5 min read"},
        "2": {"id": "2", "title": "The Importance of Mental Health", "excerpt": "Why mental health matters.", "content": "Mental health is crucial. Break the stigma and practice daily self-care.", "author": "Diksha Mago", "image_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800", "created_at": "2026-01-10", "read_time": "4 min read"},
        "3": {"id": "3", "title": "Building Healthy Relationships", "excerpt": "Nurturing meaningful connections.", "content": "Communication is key. Set boundaries and seek help when needed.", "author": "Manvi Giri", "image_url": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800", "created_at": "2026-01-15", "read_time": "6 min read"}
    }
    if blog_id not in blogs:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blogs[blog_id]

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
