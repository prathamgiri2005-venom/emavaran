from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
import os
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
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Pydantic Models
class BookingRequest(BaseModel):
    therapist: str
    date: str
    time: str
    name: str
    email: EmailStr
    phone: str
    message: Optional[str] = ""

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

# Booking Routes
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
            "title": "Clinical Psychologist",
            "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/k1imk6ox_IMG_3581.JPG.jpeg",
            "experience": "2+ years",
            "specializations": ["Anxiety & Stress", "Depression", "Personal Growth"],
            "bio": "Manvi brings warmth and understanding to every session. Her client-centered approach helps individuals discover their inner strength and navigate life's challenges with resilience."
        },
        {
            "id": "diksha",
            "name": "Diksha Mago",
            "title": "Counseling Psychologist",
            "image_url": "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/9ciapjg1_WhatsApp%20Image%202026-04-10%20at%204.06.18%20PM.jpeg",
            "experience": "2+ years",
            "specializations": ["Relationship Counseling", "Emotional Wellbeing", "Self-Esteem"],
            "bio": "Diksha creates a safe, non-judgmental space where clients feel heard and valued. She specializes in helping people build meaningful relationships and emotional resilience."
        }
    ]

# Services data
@app.get("/api/services")
async def get_services():
    return [
        {
            "id": "individual",
            "title": "Individual Counseling",
            "description": "One-on-one sessions tailored to your unique needs. Explore personal challenges, develop coping strategies, and work towards your goals in a safe, confidential space.",
            "duration": "50-60 minutes",
            "icon": "user"
        },
        {
            "id": "anxiety",
            "title": "Anxiety & Stress Management",
            "description": "Learn effective techniques to manage anxiety and stress. Our therapists will help you understand triggers, develop relaxation skills, and build resilience.",
            "duration": "50-60 minutes",
            "icon": "heart"
        },
        {
            "id": "relationship",
            "title": "Relationship Counseling",
            "description": "Strengthen your connections with others. Whether it's family, romantic relationships, or friendships, we help you communicate better and resolve conflicts.",
            "duration": "50-60 minutes",
            "icon": "users"
        },
        {
            "id": "emotional",
            "title": "Emotional Wellbeing Support",
            "description": "Focus on overall emotional health and personal growth. Build self-awareness, improve self-esteem, and develop a more positive outlook on life.",
            "duration": "50-60 minutes",
            "icon": "sparkles"
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
