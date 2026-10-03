# Emavaran — Today's Changes (Add to your main repo manually)

> **IMPORTANT:** Your main repo already has code I should NOT touch (Photos page, Brand Launch, backend etc.). This file lists ONLY what we added today so you can paste each piece into your main repo without losing anything.

All changes are in **ONE file**: `frontend/src/App.js`
No backend changes required. No .env changes. No new npm packages.

---

## STEP 1 — Save today's work to a NEW GitHub branch (safe)

1. In the Emergent chat input bar at the bottom, click **"Save to GitHub"**.
2. Choose your Emavaran repo.
3. **IMPORTANT:** Create a **NEW branch** called `emergent-today-additions` (do NOT push to `main`).
4. Confirm.
5. Go to GitHub → open the new branch → compare with `main` to see the diff.
6. **Do NOT merge the whole PR.** Instead, use GitHub's web editor OR local git to cherry-pick ONLY the blocks listed below from `frontend/src/App.js` into your main branch.

---

## STEP 2 — The 7 blocks to copy into your `frontend/src/App.js`

### Block 1 — Add icons to the lucide-react import (top of file)

Find your existing lucide-react import at the top. Add these icons at the end of the list:

```js
Sprout, Leaf, BookOpen, Briefcase, UserCheck
```

So it looks like:
```js
import {
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight,
  User, Heart, Users, Sparkles, Star, ArrowRight, Calendar as CalendarIcon,
  Facebook, Instagram, Linkedin, Monitor, Palette, GraduationCap,
  Sprout, Leaf, BookOpen, Briefcase, UserCheck
} from 'lucide-react';
```

---

### Block 2 — Add image constants + VERTICALS_DATA (right after your other image constants near top of file)

```js
// Retreat (Sukoon) Photos
const RETREAT_PHOTOS = [
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/f838ozew_HT_00044.webp", caption: "Mountain retreat — group gathering amidst pine forests" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/tid6miki_HT_00010.webp", caption: "Hands-on creativity sessions in nature" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/x7yw72nz_HT_00190.webp", caption: "Sound healing circle with singing bowls & chimes" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/8bq4tasw_HT_00204.webp", caption: "Group bonding during experiential activities" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/8k6r0egd_IMG_8041.webp", caption: "Manvi & Diksha at the Emavaran retreat venue" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/v1xev1rl_HT_04731.webp", caption: "The Emavaran tote — a keepsake of the journey" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/gs99dgfn_HT_04725.webp", caption: "Learning science & joy together — rocket activity" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/2mxxx9tz_HT_00235.webp", caption: "A participant with her Emavaran gift bag" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/ukbhntta_HT_00213.webp", caption: "Our mountain retreat campsite in misty mornings" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/fc7gf2px_HT_00151.webp", caption: "Celebrations & cultural moments at the retreat" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/4sqwchlk_HT_04863.webp", caption: "Group energy exercise — moving together, healing together" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/mwbxm1zs_HT_04860.webp", caption: "Guided expressive art session led by our therapist" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/e3dovp1p_HT_04859%20copy.webp", caption: "Manvi & Diksha hosting the retreat" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/8noh2mkc_HT_04845.webp", caption: "A warm smile at the art table" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/ok3axqtp_HT_04831.webp", caption: "The Emavaran banner — our 5 Verticals of healing" }
];

// Teacher Training (Udaan - School Programs) Photos
const TEACHER_TRAINING_PHOTOS = [
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/v08bfirw_IMG_8041.webp", caption: "Teacher training at The Mother's International School, New Delhi" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/skjj7bi6_IMG_8047.webp", caption: "Between Bells & Breaks — emotional reset workshop for educators" },
  { src: "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/79qi4sae_IMG_8020.webp", caption: "Back-to-school art therapy session for teachers" }
];

// Verticals data
const VERTICALS_DATA = [
  { slug:'nav', hindi:'नव', english:'Rehabilitation', tagline:'Holistic healing for emotional, mental & behavioural well-being', description:'Holistic rehabilitation programs for emotional, mental & behavioural well-being.', long:'नव (New Beginnings) is Emavaran\'s rehabilitation vertical — a safe, structured, and compassionate path for individuals navigating addiction recovery, chronic stress, or behavioural reset. We combine evidence-based therapy with mindfulness, expressive arts, and family support to help clients rebuild their relationship with themselves and the world.', offerings:['One-on-one rehabilitation counselling','Behavioural pattern reset programs','Family support & psychoeducation','Mindfulness and body-based practices','Follow-up care & relapse prevention'], accent:'#4a7c3f', photos:[] },
  { slug:'sukoon', hindi:'सुकून', english:'Retreats', tagline:'Reconnect, recharge & rediscover inner balance', description:'Restorative retreats to reconnect, recharge & rediscover inner balance in nurturing environments.', long:'सुकून means peace. Our retreats are curated getaways in the lap of nature where you step away from the noise and step into yourself. Sound healing, expressive art, guided reflections, gentle movement, and warm community meals — every element is designed to help you return home softer, lighter, and more grounded.', offerings:['Weekend & week-long mountain retreats','Sound healing with singing bowls & chimes','Expressive art & journaling circles','Guided mindful walks in nature','Group bonding & cultural evenings'], accent:'#2d6b5c', photos: RETREAT_PHOTOS },
  { slug:'udaan', hindi:'उड़ान', english:'School Programs', tagline:'Building emotional resilience in young minds', description:'Interactive programs for students, teachers & parents to build emotional resilience & awareness.', long:'उड़ान (Flight) brings mental health literacy into classrooms. We work with schools to run interactive sessions for students, teacher-training workshops, and parent orientation programs — building emotional resilience, empathy, and self-awareness from an early age.', offerings:['Student life-skills & emotional resilience workshops','Teacher training in mental health first aid','Parent orientation & communication circles','Peer support & anti-bullying programs','Career counselling for senior classes'], accent:'#c47c3a', photos: TEACHER_TRAINING_PHOTOS },
  { slug:'saath', hindi:'साथ', english:'Corporate Wellness', tagline:'Workplace wellbeing, productivity & harmony', description:'Workplace wellness programs that foster mental well-being, productivity & harmony.', long:'साथ means together. Our corporate wellness programs partner with organisations to create psychologically safer workplaces — through leadership workshops, team wellbeing audits, 1:1 counselling access, and burnout-prevention curricula tailored to your culture and KPIs.', offerings:['Employee wellbeing workshops','Leadership emotional-intelligence training','1:1 counselling via Employee Assistance Program','Burnout prevention & stress audits','Team-building retreats & circles'], accent:'#3a7098', photos:[] },
  { slug:'saksham', hindi:'सक्षम', english:'Workshops & Sessions for MHPs', tagline:'Specialized growth for mental health professionals', description:'Specialized workshops & professional support for mental health professionals to grow, learn & create lasting impact.', long:'सक्षम (Capable) is our professional development vertical for therapists, counsellors, and allied mental health workers. We offer skill-sharpening workshops, case-consultation groups, peer supervision, and self-care retreats — because the people who hold others deserve to be held too.', offerings:['Specialised technique workshops (CBT, Art Therapy, Gestalt)','Peer supervision & case consultation circles','Self-care & vicarious-trauma recovery retreats','Research & publication mentorship','Internships for early-career professionals'], accent:'#6b4a98', photos:[] }
];

const getVerticalIcon = (slug) => {
  const map = {
    nav: <Sprout className="w-full h-full" strokeWidth={1.5} />,
    sukoon: <Leaf className="w-full h-full" strokeWidth={1.5} />,
    udaan: <BookOpen className="w-full h-full" strokeWidth={1.5} />,
    saath: <Briefcase className="w-full h-full" strokeWidth={1.5} />,
    saksham: <UserCheck className="w-full h-full" strokeWidth={1.5} />
  };
  return map[slug] || <Heart className="w-full h-full" strokeWidth={1.5} />;
};
```

---

### Block 3 — Add 3 new page components anywhere BEFORE the `App()` function

**Copy these from the current working project at `/app/frontend/src/App.js`:**
- `CoursesPage` function (includes the Featured "Certificate Course in Expressive Art Therapy" + Meet the Facilitator — Diksha Mago sections)
- `EventsPage` function
- `VerticalDetailPage` function

You can open `/app/frontend/src/App.js` in Emergent, search for `function CoursesPage()`, `function EventsPage()`, `function VerticalDetailPage()` and copy each function block (around 100–200 lines each) into your main repo file.

---

### Block 4 — Add 3 routes inside `<Routes>` in your main repo

```jsx
<Route path="/courses" element={<CoursesPage />} />
<Route path="/events" element={<EventsPage />} />
<Route path="/verticals/:slug" element={<VerticalDetailPage />} />
```

---

### Block 5 — Add 2 nav links in your `Navbar` navLinks array

```js
{ path: '/courses', label: 'Courses' },
{ path: '/events', label: 'Events' },
```

---

### Block 6 — Add 2 footer links in your Footer "Quick Links"

```jsx
<li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
<li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
```

---

### Block 7 — Make your existing "Our 5 Verticals" cards clickable

In your `HomePage` (and/or `ServicesPage`) wherever you render the 5 vertical cards, wrap the inner content with `<Link to={`/verticals/${vertical.slug}`}>...</Link>`.
Make sure each vertical object has a `slug` property: `nav`, `sukoon`, `udaan`, `saath`, `saksham`.

Example:
```jsx
<Link to={`/verticals/${vertical.slug}`} className="block">
  {/* existing icon, hindi, english, description markup */}
</Link>
```

---

## STEP 3 — Test locally

```bash
cd frontend
yarn start
```

Visit:
- http://localhost:3000/courses → Expressive Art Therapy + Diksha Mago section
- http://localhost:3000/events → 6 upcoming events
- http://localhost:3000/verticals/sukoon → Sukoon + 15 retreat photos
- http://localhost:3000/verticals/udaan → Udaan + 3 teacher training photos

---

## STEP 4 — Push to GitHub (your main repo)

Once everything works locally:

```bash
git checkout -b add-courses-events-verticals
git add frontend/src/App.js
git commit -m "feat: add Courses, Events, Vertical detail pages, retreat + teacher-training photos"
git push origin add-courses-events-verticals
```

Then open a Pull Request on GitHub and merge to `main`.

---

## Summary of what you're adding

| Feature | Where it lives |
|---|---|
| Courses page with Featured "Expressive Art Therapy" + Meet Diksha facilitator | `/courses` route |
| Events page with 6 upcoming events | `/events` route |
| 5 Vertical detail pages (नव, सुकून, उड़ान, साथ, सक्षम) | `/verticals/:slug` |
| 15 Retreat photos | inside Sukoon vertical page |
| 3 Teacher Training photos | inside Udaan vertical page |
| Clickable vertical cards | Home + Services pages |

**NOT touched:** your Photos page, Brand Launch gallery, Blog, Services grid, Book a Session, Contact, backend, MongoDB, .env, Razorpay — all stay exactly as they are in your main repo.
