import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Monitor,
  Calendar as CalendarIcon,
  Sparkles,
  Leaf,
  Heart,
  ArrowRight,
  Clock,
  UserCheck,
  Users,
  Award,
  Briefcase,
  MessageCircle,
  Instagram,
  Mail,
} from "lucide-react";
import { Button } from "./ui/Button";

// ---------------------------------------------------------------
// Settings you may want to change
// ---------------------------------------------------------------
// Enrolment link for Expressive Art Therapy. Leave empty to send people to the Contact page.
const ENROL_LINK = "";

// Career Counseling: enrolment goes to WhatsApp (no form or price on the poster).
const CAREER_WHATSAPP = "https://wa.me/917827453162";
const CAREER_INSTAGRAM = "https://www.instagram.com/emavarantherapy";
const CAREER_EMAIL = "mailto:emavarantherapy@gmail.com";

// Poster images live in frontend/public/
const CAREER_POSTERS = [
  "/career-counseling-1.jpg",
  "/career-counseling-2.jpg",
  "/career-counseling-3.jpg",
  "/career-counseling-4.jpg",
];

const DIKSHA_PHOTO =
  "https://i.ibb.co/6Q2cwn6/Chat-GPT-Image-Jun-1-2026-08-29-11-PM.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const CAREER_FACTS = [
  { icon: <Clock className="w-6 h-6" strokeWidth={2} />, bg: "#2d5c54", title: "3 months", text: "of training" },
  { icon: <Monitor className="w-6 h-6" strokeWidth={2} />, bg: "#d97757", title: "100% online", text: "weekend classes" },
  { icon: <Sparkles className="w-6 h-6" strokeWidth={2} />, bg: "#9b7ec5", title: "70% practical", text: "30% theory" },
  { icon: <UserCheck className="w-6 h-6" strokeWidth={2} />, bg: "#4a7c3f", title: "Real-client", text: "exposure" },
  { icon: <Briefcase className="w-6 h-6" strokeWidth={2} />, bg: "#3a7098", title: "Psychometric", text: "assessment training" },
  { icon: <Users className="w-6 h-6" strokeWidth={2} />, bg: "#c47c3a", title: "Limited seats", text: "personalised guidance" },
];

const CAREER_EXPLORE = [
  "Work with one pro bono client through a guided learning experience.",
  "Learn administration, scoring and interpretation of selected tools.",
  "Practical assignments, case studies and session simulations.",
  "Take home a complete career counselling toolkit, including intake forms, documentation templates, career-planning worksheets, and much more.",
  "Receive individual attention and guidance throughout the programme.",
];

export default function CoursesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section
        className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)" }}
      >
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.p
              variants={fadeInUp}
              className="text-xs uppercase tracking-[0.3em] font-semibold mb-4"
              style={{ color: "#8b7355" }}
            >
              Learn &amp; Grow
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-serif font-light mb-6"
              style={{ color: "#1a3a5c" }}
            >
              Emavaran Courses
            </motion.h1>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <div className="h-px w-16" style={{ background: "#c9a961" }} />
              <Sparkles className="h-5 w-5" style={{ color: "#c9a961" }} />
              <div className="h-px w-16" style={{ background: "#c9a961" }} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-lg leading-relaxed" style={{ color: "#3a5a7c" }}>
              Certificate courses in Expressive Art Therapy and Career Counseling, taught online by
              our co-founders Diksha &amp; Manvi, with hands-on practice and an accredited certification.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Course 1: Expressive Art Therapy */}
      <section
        className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden"
        style={{ background: "#fffbea" }}
        data-testid="featured-course"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(201, 169, 97, 0.2)", color: "#8b7355" }}
            >
              Featured Course · Enrolment Open
            </span>
            <p className="text-base md:text-lg font-serif" style={{ color: "#2d5016" }}>
              Certificate Course in
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-bold mt-1 mb-4 leading-tight"
              style={{ color: "#1a3f2a" }}
            >
              Expressive Art Therapy
            </h2>
            <p className="text-sm md:text-base font-bold tracking-widest uppercase" style={{ color: "#2d5016" }}>
              Learn. Facilitate. Create Meaningful Therapeutic Spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Monitor className="w-6 h-6" strokeWidth={2} />, bg: "#2d5c54", label: "3 month online course" },
              { icon: <CalendarIcon className="w-6 h-6" strokeWidth={2} />, bg: "#d97757", label: "Starts 25 October" },
              {
                icon: <Sparkles className="w-6 h-6" strokeWidth={2} />,
                bg: "#9b7ec5",
                label: "Certification accredited by the International Association of Therapists",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 border-2"
                style={{ borderColor: "rgba(201, 169, 97, 0.2)" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
                <p className="text-sm md:text-base font-semibold leading-snug pt-1" style={{ color: "#1a3f2a" }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            {ENROL_LINK ? (
              <a href={ENROL_LINK} target="_blank" rel="noopener noreferrer">
                <Button
                  className="rounded-full px-10 py-6 text-base"
                  data-testid="eat-enroll"
                  style={{ background: "#2d5016", color: "white" }}
                >
                  Enrol Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            ) : (
              <Link to="/contact">
                <Button
                  className="rounded-full px-10 py-6 text-base"
                  data-testid="eat-enroll"
                  style={{ background: "#2d5016", color: "white" }}
                >
                  Enrol Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Facilitator: Diksha Mago */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ background: "#fef9d7" }} data-testid="meet-facilitator">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl md:text-3xl font-serif mb-2" style={{ color: "#2d5016" }}>
            Meet the Facilitator
          </p>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-4" style={{ color: "#1a3f2a" }}>
            Diksha Mago
          </h2>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-20" style={{ background: "#8b7355" }} />
            <Sparkles className="h-4 w-4" style={{ color: "#8b7355" }} />
            <div className="h-px w-20" style={{ background: "#8b7355" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-10 md:gap-14 items-center">
            <div>
              <p className="font-bold text-lg md:text-xl mb-1" style={{ color: "#2d5016" }}>
                Counseling Psychologist
              </p>
              <p className="font-bold text-lg md:text-xl mb-8" style={{ color: "#2d5016" }}>
                UNESCO-CID Certified Expressive Arts Therapist
              </p>
              <p className="text-base md:text-lg leading-[1.9] font-semibold" style={{ color: "#1a3f2a" }}>
                Diksha Mago brings together psychological insight, neuropsychological understanding, and creative
                expression in her work. She has facilitated multiple sessions and conducted certification courses,
                creating reflective and engaging learning spaces for people exploring expressive arts therapy. As
                co-founder of Emavaran, she contributes to meaningful spaces for psychological wellbeing, learning,
                and creative growth.
              </p>
            </div>
            <div className="relative mx-auto md:mx-0">
              <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={DIKSHA_PHOTO} alt="Diksha Mago" className="w-full h-full object-cover object-[20%]" />
              </div>
              <Leaf
                className="absolute -bottom-6 -right-6 w-28 h-28 opacity-70"
                style={{ color: "#4a7c3f" }}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className="mt-14 max-w-md">
            <div
              className="bg-white/80 rounded-xl p-5 shadow-sm border"
              style={{ borderColor: "rgba(139, 115, 85, 0.2)" }}
            >
              <p
                className="font-serif italic text-base md:text-lg leading-relaxed"
                style={{ color: "#2d5016", fontFamily: "cursive" }}
              >
                "Learn from a facilitator who honours both the person and the process."
              </p>
              <div className="mt-3 flex justify-center">
                <Heart className="h-4 w-4" style={{ color: "#4a7c3f" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Course 2: Career Counseling */}
      <section
        className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden"
        style={{ background: "#eef5f0" }}
        data-testid="career-course"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ background: "rgba(45, 92, 84, 0.15)", color: "#2d5c54" }}
            >
              New Course · Limited Seats
            </span>
            <p className="text-base md:text-lg font-serif" style={{ color: "#2d5c54" }}>
              3-Month Online Certificate Course in
            </p>
            <h2
              className="text-4xl md:text-6xl font-serif font-bold mt-1 mb-4 leading-tight"
              style={{ color: "#124a3f" }}
            >
              Career Counseling
            </h2>
            <p className="text-sm md:text-base font-bold tracking-widest uppercase" style={{ color: "#2d5c54" }}>
              Become a Career Counsellor &amp; Launch Your Practice
            </p>
          </div>

          {/* Poster + key facts */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px),1fr] gap-10 items-start">
            <a
              href={CAREER_POSTERS[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="block mx-auto w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img
                src={CAREER_POSTERS[0]}
                alt="3-month online certificate course in Career Counseling"
                className="w-full h-auto"
                loading="lazy"
              />
            </a>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CAREER_FACTS.map((f) => (
                  <div
                    key={f.title}
                    className="flex items-center gap-4 bg-white/80 rounded-2xl p-4 border-2"
                    style={{ borderColor: "rgba(45, 92, 84, 0.15)" }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: f.bg }}
                    >
                      {f.icon}
                    </div>
                    <p className="leading-snug" style={{ color: "#124a3f" }}>
                      <span className="block font-bold">{f.title}</span>
                      <span className="text-sm">{f.text}</span>
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 flex items-center gap-4 bg-white/80 rounded-2xl p-4 border-2"
                style={{ borderColor: "rgba(45, 92, 84, 0.15)" }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: "#124a3f" }}
                >
                  <Award className="w-6 h-6" strokeWidth={2} />
                </div>
                <p className="font-semibold leading-snug" style={{ color: "#124a3f" }}>
                  IAOTH accredited certification, with the International Association of Therapists
                </p>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif mt-10 mb-5" style={{ color: "#124a3f" }}>
                What you&rsquo;ll explore
              </h3>
              <ol className="space-y-4">
                {CAREER_EXPLORE.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                      style={{ background: "#2d5c54" }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5" style={{ color: "#1f4a40" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

        </div>
      </section>

      {/* Facilitator: Manvi Giri (poster) */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ background: "#fef9d7" }} data-testid="career-facilitator">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-md mx-auto">
            <img
              src={CAREER_POSTERS[2]}
              alt="Meet the facilitator: Manvi Giri, Co-Founder of Emavaran, Certified Career Counsellor and Counselling Psychologist"
              className="w-full h-auto rounded-3xl shadow-2xl border-4 border-white"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Career Counseling: join + brochure */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{ background: "#eef5f0" }}>
        <div className="max-w-6xl mx-auto">
          {/* Join the course */}
          <div className="mt-12 text-center" data-testid="career-join">
            <h3 className="text-3xl md:text-4xl font-serif mb-3" style={{ color: "#124a3f" }}>
              Join the Course
            </h3>
            <p className="max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: "#3a5a7c" }}>
              Interested in the course? Reach out to us via DM on Instagram or WhatsApp for more details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAREER_WHATSAPP} target="_blank" rel="noopener noreferrer">
                <Button
                  className="rounded-full px-8 py-6 text-base w-full sm:w-auto"
                  data-testid="career-enroll"
                  style={{ background: "#2d5c54", color: "white" }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp +91 7827453162
                </Button>
              </a>
              <a href={CAREER_INSTAGRAM} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base border-2 w-full sm:w-auto"
                  style={{ borderColor: "#2d5c54", color: "#2d5c54" }}
                >
                  <Instagram className="mr-2 h-4 w-4" /> @emavarantherapy
                </Button>
              </a>
              <a href={CAREER_EMAIL}>
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base border-2 w-full sm:w-auto"
                  style={{ borderColor: "#2d5c54", color: "#2d5c54" }}
                >
                  <Mail className="mr-2 h-4 w-4" /> Email us
                </Button>
              </a>
            </div>
          </div>

          {/* Brochure */}
          <div className="mt-14">
            <p className="text-center text-xs uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#8b7355" }}>
              Course brochure
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CAREER_POSTERS.map((src, i) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <img
                    src={src}
                    alt={`Career Counseling course brochure, page ${i + 1}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing tagline */}
      <section
        className="py-16 px-6 md:px-12"
        style={{ background: "linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p
            className="text-lg md:text-xl font-serif tracking-wide uppercase"
            style={{ color: "#1a3a5c", letterSpacing: "0.15em" }}
          >
            Let&rsquo;s Heal. Let&rsquo;s Grow. Together.
          </p>
        </div>
      </section>
    </div>
  );
}
