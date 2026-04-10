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
4. **Couples** - Relationship counseling

## What's Been Implemented

### April 10, 2026 - Initial Release
- [x] Full website with 7 pages: Home, About, Services, Blog, Contact, Book a Session, Gallery
- [x] Hero section with tagline "Healing begins with understanding"
- [x] **7 Services** with pricing:
  - Student Therapy - ₹799
  - Individual Counseling - ₹999
  - Online Counseling - ₹999
  - Workshops - ₹999
  - Expressive Art Therapy - ₹999
  - Group Counseling - ₹999
  - Psychoeducation Sessions - ₹999
- [x] Detailed founder profiles with full bios
- [x] **Photo Assignment:**
  - Manvi Giri (blue outfit) - shown FIRST (priority)
  - Diksha Mago (black blazer)
- [x] Calendar-based booking system with therapist selection
- [x] Contact form with email/phone display
- [x] Blog with mental health articles
- [x] FAQ, Testimonials, Gallery sections

### April 10, 2026 - Admin Dashboard
- [x] Admin authentication (JWT-based)
- [x] Admin login page at `/admin/login`
- [x] Dashboard with booking stats
- [x] Booking management (confirm/cancel/complete)
- [x] Contact messages viewer
- [x] Two admin accounts:
  - manvi@emavaran.com / Manvi@123
  - diksha@emavaran.com / Diksha@123

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Radix UI
- **Backend**: FastAPI (Python), JWT Auth
- **Database**: MongoDB
- **Fonts**: Cormorant Garamond, Manrope

## Prioritized Backlog

### P0 (Critical) - Deferred
- [ ] Razorpay payment integration (ready when you have API keys)
- [ ] Email notifications for bookings

### P1 (High Priority)
- [ ] Google Calendar integration for therapists
- [ ] SMS notifications via Twilio

### P2 (Medium Priority)
- [ ] Newsletter subscription
- [ ] Client testimonial submission form
- [ ] WhatsApp chat integration

### P3 (Low Priority)
- [ ] Multi-language support (Hindi)
- [ ] Video call integration
- [ ] Mobile app

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/services` - List services with pricing
- `GET /api/therapists` - List therapists
- `GET /api/blogs` - List blogs
- `GET /api/blogs/:id` - Blog detail
- `GET /api/faqs` - FAQs
- `GET /api/testimonials` - Testimonials
- `POST /api/bookings` - Create booking
- `GET /api/bookings/available-slots` - Check availability
- `POST /api/contact` - Submit contact form

### Admin (Protected)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Current user
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/bookings` - All bookings
- `PATCH /api/admin/bookings/:id` - Update booking
- `DELETE /api/admin/bookings/:id` - Delete booking
- `GET /api/admin/contacts` - All contact messages
