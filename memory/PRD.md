# Emavaran - Mental Wellness Platform

## Project Overview
A modern, professional website for **Emavaran** - a counseling and mental wellness platform founded by Manvi Giri and Diksha Mago.

## Contact Information
- Email: emavarantherapy@gmail.com
- Phone: +91 7827453162

## User Personas
1. **Students** - Academic stress, career confusion, peer relationships (₹799/session)
2. **Adults seeking therapy** - Anxiety, stress, relationship issues (₹999/session)
3. **Young adults** - Emotional support and personal growth
4. **Groups** - Shared healing experience in group sessions

## What's Been Implemented

### April 10, 2026 - Initial Release
- [x] Full website with 7 pages: Home, About, Services, Blog, Contact, Book a Session, Gallery
- [x] Hero section with tagline "Healing begins with understanding"
- [x] Admin dashboard with JWT authentication

### April 23, 2026 - Heavenly Design & Updates
- [x] **Creative Heavenly Design** - Floating animations, soft gradients, glass morphism
- [x] **6 Services** (removed Online Counseling):
  - Student Therapy - ₹799
  - Individual Counseling - ₹999
  - Expressive Art Therapy - ₹999
  - Group Counseling - ₹999
  - Workshops - ₹999
  - Psychoeducation Sessions - ₹999
- [x] **Custom Service Images** from user uploads:
  - Mission image (e.jpeg)
  - Art Therapy image (art.jpeg)
  - Individual Counseling image (indviduals.jpeg)
  - Group Counseling image (group.jpeg)
  - Workshops image (workshops.jpeg)
- [x] **Photo Assignment Corrected:**
  - Manvi Giri (blue outfit) - shown FIRST
  - Diksha Mago (black blazer)
- [x] **Booking Email Notifications** - When someone books, notification is stored for emavarantherapy@gmail.com

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Radix UI
- **Backend**: FastAPI (Python), JWT Auth
- **Database**: MongoDB
- **Fonts**: Cormorant Garamond, Manrope

## Admin Access
- URL: `/admin/login`
- Manvi: manvi@emavaran.com / Manvi@123
- Diksha: diksha@emavaran.com / Diksha@123

## Prioritized Backlog

### P0 (Critical) - Deferred
- [ ] Razorpay payment integration
- [ ] Real email delivery (currently notifications stored in DB)

### P1 (High Priority)
- [ ] Google Calendar integration
- [ ] SMS notifications via Twilio

### P2 (Medium Priority)
- [ ] WhatsApp chat button
- [ ] Client testimonial submission

## API Endpoints

### Public
- `GET /api/services` - 6 services with pricing
- `GET /api/therapists` - Manvi first, Diksha second
- `POST /api/bookings` - Creates booking + notification

### Admin
- `GET /api/admin/notifications` - View booking notifications
- Full booking/contact management
