import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, 
  User, Heart, Users, Sparkles, Star, ArrowRight, Calendar as CalendarIcon,
  Facebook, Instagram, Linkedin, Monitor, Palette, GraduationCap,
  Sprout, Leaf, BookOpen, Briefcase, UserCheck
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Textarea } from './components/ui/Textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/Accordion';
import { Calendar } from './components/ui/Calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/Dialog';
import { AuthProvider, AdminLogin, AdminDashboard } from './components/Admin';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Brand Assets
const BRAND_LOGO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/5tpkky0k_WhatsApp%20Image%202026-04-10%20at%204.11.34%20PM.jpeg";
const MANVI_PHOTO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/9ciapjg1_WhatsApp%20Image%202026-04-10%20at%204.06.18%20PM.jpeg";
const DIKSHA_PHOTO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/k1imk6ox_IMG_3581.JPG.jpeg";
const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/0ddf470c-530c-4b73-b546-d7dd762933cd/images/32fd8022c1f4f8be618a1e23248f122972f1cac8fa44eea1a0d649daa9c7bab1.png";
const THERAPY_ROOM = "https://static.prod-images.emergentagent.com/jobs/0ddf470c-530c-4b73-b546-d7dd762933cd/images/85699758cf1d8d5aa539b0539957266055efeaaecf627194a02ca413f763edbc.png";

// New Service Images
const MISSION_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/gv6swmoz_e.jpeg";
const ART_THERAPY_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/eplihg33_art.jpeg";
const INDIVIDUAL_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/2e2sc5qy_indviduals.jpeg";
const STUDENT_IMG = "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/yr2xotzy_WhatsApp%20Image%202026-09-15%20at%206.12.06%20PM.jpeg";
const GROUP_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/3lndq4a7_group.jpeg";
const WORKSHOPS_IMG = "https://customer-assets-agu9un31.emergentagent.net/job_wellness-journey-225/artifacts/b5858bci_WhatsApp%20Image%202026-09-15%20at%206.11.42%20PM.jpeg";
const PSYCHOEDUCATION_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/qsy90nw2_workshops.jpeg";

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

// Verticals data (shared across home preview, services section, and detail pages)
const VERTICALS_DATA = [
  {
    slug: 'nav',
    hindi: 'नव',
    english: 'Rehabilitation',
    tagline: 'Holistic healing for emotional, mental & behavioural well-being',
    description: 'Holistic rehabilitation programs for emotional, mental & behavioural well-being.',
    long: 'नव (New Beginnings) is Emavaran\'s rehabilitation vertical — a safe, structured, and compassionate path for individuals navigating addiction recovery, chronic stress, or behavioural reset. We combine evidence-based therapy with mindfulness, expressive arts, and family support to help clients rebuild their relationship with themselves and the world.',
    offerings: [
      'One-on-one rehabilitation counselling',
      'Behavioural pattern reset programs',
      'Family support & psychoeducation',
      'Mindfulness and body-based practices',
      'Follow-up care & relapse prevention'
    ],
    accent: '#4a7c3f',
    photos: []
  },
  {
    slug: 'sukoon',
    hindi: 'सुकून',
    english: 'Retreats',
    tagline: 'Reconnect, recharge & rediscover inner balance',
    description: 'Restorative retreats to reconnect, recharge & rediscover inner balance in nurturing environments.',
    long: 'सुकून means peace. Our retreats are curated getaways in the lap of nature where you step away from the noise and step into yourself. Sound healing, expressive art, guided reflections, gentle movement, and warm community meals — every element is designed to help you return home softer, lighter, and more grounded.',
    offerings: [
      'Weekend & week-long mountain retreats',
      'Sound healing with singing bowls & chimes',
      'Expressive art & journaling circles',
      'Guided mindful walks in nature',
      'Group bonding & cultural evenings'
    ],
    accent: '#2d6b5c',
    photos: RETREAT_PHOTOS
  },
  {
    slug: 'udaan',
    hindi: 'उड़ान',
    english: 'School Programs',
    tagline: 'Building emotional resilience in young minds',
    description: 'Interactive programs for students, teachers & parents to build emotional resilience & awareness.',
    long: 'उड़ान (Flight) brings mental health literacy into classrooms. We work with schools to run interactive sessions for students, teacher-training workshops, and parent orientation programs — building emotional resilience, empathy, and self-awareness from an early age.',
    offerings: [
      'Student life-skills & emotional resilience workshops',
      'Teacher training in mental health first aid',
      'Parent orientation & communication circles',
      'Peer support & anti-bullying programs',
      'Career counselling for senior classes'
    ],
    accent: '#c47c3a',
    photos: TEACHER_TRAINING_PHOTOS
  },
  {
    slug: 'saath',
    hindi: 'साथ',
    english: 'Corporate Wellness',
    tagline: 'Workplace wellbeing, productivity & harmony',
    description: 'Workplace wellness programs that foster mental well-being, productivity & harmony.',
    long: 'साथ means together. Our corporate wellness programs partner with organisations to create psychologically safer workplaces — through leadership workshops, team wellbeing audits, 1:1 counselling access, and burnout-prevention curricula tailored to your culture and KPIs.',
    offerings: [
      'Employee wellbeing workshops',
      'Leadership emotional-intelligence training',
      '1:1 counselling via Employee Assistance Program',
      'Burnout prevention & stress audits',
      'Team-building retreats & circles'
    ],
    accent: '#3a7098',
    photos: []
  },
  {
    slug: 'saksham',
    hindi: 'सक्षम',
    english: 'Workshops & Sessions for MHPs',
    tagline: 'Specialized growth for mental health professionals',
    description: 'Specialized workshops & professional support for mental health professionals to grow, learn & create lasting impact.',
    long: 'सक्षम (Capable) is our professional development vertical for therapists, counsellors, and allied mental health workers. We offer skill-sharpening workshops, case-consultation groups, peer supervision, and self-care retreats — because the people who hold others deserve to be held too.',
    offerings: [
      'Specialised technique workshops (CBT, Art Therapy, Gestalt)',
      'Peer supervision & case consultation circles',
      'Self-care & vicarious-trauma recovery retreats',
      'Research & publication mentorship',
      'Internships for early-career professionals'
    ],
    accent: '#6b4a98',
    photos: []
  }
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

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Navigation Component
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/blog', label: 'Blog' },
    { path: '/courses', label: 'Courses' },
    { path: '/events', label: 'Events' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FDFBF7]/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3" data-testid="nav-logo">
            <img src={BRAND_LOGO} alt="Emavaran" className="h-12 w-12 object-contain rounded-full" />
            <span className="font-serif text-2xl text-text-primary">Emavaran</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-brand-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/book">
              <Button data-testid="nav-book-session">Book a Session</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white rounded-2xl shadow-lg mb-4 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-2 text-base ${location.pathname === link.path ? 'text-brand-primary font-medium' : 'text-text-secondary'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/book" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4">Book a Session</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-[#2D3748] text-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={BRAND_LOGO} alt="Emavaran" className="h-12 w-12 object-contain rounded-full" />
              <span className="font-serif text-2xl">Emavaran</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Healing begins with understanding. We provide compassionate counseling and mental wellness support to help you navigate life's challenges.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-primary transition-colors" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-primary transition-colors" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-primary transition-colors" data-testid="social-linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>emavarantherapy@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+91 7827453162</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Emavaran. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Home Page
function HomePage() {
  const [services, setServices] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/services`).then(r => r.json()),
      fetch(`${API_URL}/api/therapists`).then(r => r.json()),
      fetch(`${API_URL}/api/testimonials`).then(r => r.json()),
      fetch(`${API_URL}/api/faqs`).then(r => r.json()),
    ]).then(([servicesData, therapistsData, testimonialsData, faqsData]) => {
      setServices(servicesData);
      setTherapists(therapistsData);
      setTestimonials(testimonialsData);
      setFaqs(faqsData);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const getServiceIcon = (icon) => {
    const icons = { user: User, heart: Heart, users: Users, sparkles: Sparkles, monitor: Monitor, palette: Palette, graduation: GraduationCap };
    const Icon = icons[icon] || Heart;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Heavenly */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" data-testid="hero-section">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-[#a8edea]/30 to-[#fed6e3]/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#ffecd2]/40 to-[#fcb69f]/30 rounded-full blur-3xl animate-float-slow animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#9DBAC2]/20 to-[#E5D8CF]/30 rounded-full blur-3xl animate-float animation-delay-700" />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute top-32 right-20 w-4 h-4 bg-brand-primary/40 rounded-full animate-sparkle" />
        <div className="absolute top-48 right-40 w-2 h-2 bg-accent-tertiary/50 rounded-full animate-sparkle animation-delay-300" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-brand-primary/30 rounded-full animate-sparkle animation-delay-500" />
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-[#fed6e3] rounded-full animate-sparkle animation-delay-200" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-block mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-accent-secondary/20 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary border border-brand-primary/20">
                  Counseling & Mental Wellness
                </span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-light tracking-tight text-text-primary mb-6 leading-tight">
                Healing begins with{' '}
                <span className="relative inline-block">
                  understanding
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 2 150 2 298 10" stroke="#9DBAC2" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
                Welcome to Emavaran, a safe space where you can explore your thoughts, feelings, and challenges with compassionate guidance from experienced psychologists.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Link to="/book">
                  <Button size="lg" className="animate-pulse-glow" data-testid="hero-book-session">
                    Book a Session <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="glass" data-testid="hero-contact">
                    Contact Us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-accent-tertiary/20 rounded-[3rem] transform rotate-3 animate-float-slow" />
                <img 
                  src={MISSION_IMG} 
                  alt="Emavaran Mission" 
                  className="relative rounded-[2.5rem] shadow-2xl w-full max-w-lg mx-auto image-shine"
                />
                {/* Floating badge */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 glass p-4 rounded-2xl shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-hover rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-serif text-text-primary">2+</p>
                      <p className="text-xs text-text-secondary">Years Experience</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our 5 Verticals - Home Preview */}
      <section className="py-20 md:py-28 px-6 md:px-12 relative overflow-hidden" data-testid="verticals-preview-section" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="absolute top-10 left-0 w-32 h-32 opacity-20">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 right-0 w-32 h-32 opacity-20 rotate-180">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{color: '#8b7355'}}>
              Our Signature Programs
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif mb-3" style={{color: '#1a3a5c'}}>
              Our 5 Verticals
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 my-5">
              <div className="h-px w-12" style={{background: '#c9a961'}} />
              <Sparkles className="h-4 w-4" style={{color: '#c9a961'}} />
              <div className="h-px w-12" style={{background: '#c9a961'}} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed" style={{color: '#3a5a7c'}}>
              Five focused verticals. Five unique spaces.<br />
              One holistic approach to healing &amp; growth.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6"
          >
            {[
              { slug: 'nav', hindi: 'नव', english: 'Rehabilitation', icon: <Sprout className="w-8 h-8" strokeWidth={1.5} /> },
              { slug: 'sukoon', hindi: 'सुकून', english: 'Retreats', icon: <Leaf className="w-8 h-8" strokeWidth={1.5} /> },
              { slug: 'udaan', hindi: 'उड़ान', english: 'School Programs', icon: <BookOpen className="w-8 h-8" strokeWidth={1.5} /> },
              { slug: 'saath', hindi: 'साथ', english: 'Corporate Wellness', icon: <Briefcase className="w-8 h-8" strokeWidth={1.5} /> },
              { slug: 'saksham', hindi: 'सक्षम', english: 'For MHPs', icon: <UserCheck className="w-8 h-8" strokeWidth={1.5} /> }
            ].map((vertical, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 md:p-6 text-center border-2 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
                style={{borderColor: 'rgba(201, 169, 97, 0.3)'}}
                data-testid={`vertical-preview-${idx}`}
              >
                <Link to={`/verticals/${vertical.slug}`} className="block">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{background: 'rgba(253, 246, 227, 0.9)', color: '#2d5016'}}>
                  {vertical.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{color: '#1a3a5c', fontFamily: 'serif'}}>
                  {vertical.hindi}
                </h3>
                <div className="w-8 h-px mx-auto my-2" style={{background: '#c9a961'}} />
                <p className="text-xs md:text-sm font-medium" style={{color: '#4a7c3f'}}>
                  {vertical.english}
                </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" className="border-2 hover:text-white transition-all" style={{borderColor: '#c9a961', color: '#1a3a5c'}} data-testid="explore-verticals-btn">
                Explore All Verticals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-8 text-lg md:text-xl font-serif tracking-wide uppercase" style={{color: '#1a3a5c', letterSpacing: '0.15em'}}>
              Let's Heal. Let's Grow. Together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Therapists Preview */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="therapists-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Meet Our Therapists
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              Compassionate Professionals
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {[
              { name: 'Manvi Giri', title: 'Counseling Psychologist | Mental Health Advocate', photo: MANVI_PHOTO, specializations: ['Emotional Regulation', 'Self-Esteem', 'Life Skills Training', 'Personal Growth'], bio: 'Manvi is a dedicated Counseling Psychologist with a client-centered approach, focusing on creating a safe space for individuals to explore their thoughts and build resilience.' },
              { name: 'Diksha Mago', title: 'Counseling Psychologist | Expressive Art Therapist', photo: DIKSHA_PHOTO, specializations: ['Expressive Art Therapy', 'CBT', 'Gestalt Therapy', 'Emotion-Focused Therapy'], bio: 'Diksha is a compassionate therapist with an integrative approach, using creative techniques to facilitate emotional expression and healing.' }
            ].map((therapist, idx) => (
              <motion.div
                key={therapist.name}
                variants={fadeInUp}
                className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F3F0E9]"
                data-testid={`therapist-card-${idx}`}
              >
                <div className="w-full md:w-48 h-64 md:h-auto flex-shrink-0">
                  <img 
                    src={therapist.photo} 
                    alt={therapist.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-serif text-text-primary mb-1">{therapist.name}</h3>
                  <p className="text-brand-primary font-medium mb-4">{therapist.title}</p>
                  <p className="text-text-secondary mb-6">{therapist.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specializations.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-background-secondary rounded-full text-xs text-text-secondary">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link to="/about">
              <Button variant="outline" data-testid="learn-more-therapists">
                Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-accent-secondary/30" data-testid="testimonials-section">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Testimonials
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              What Our Clients Say
            </motion.h2>
          </motion.div>

          {testimonials.length > 0 && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-lg text-center"
            >
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-xl md:text-2xl font-serif text-text-primary mb-6 italic"
                >
                  "{testimonials[currentTestimonial]?.text}"
                </motion.p>
              </AnimatePresence>
              <p className="text-brand-primary font-medium">— {testimonials[currentTestimonial]?.name}</p>

              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentTestimonial ? 'bg-brand-primary' : 'bg-gray-300'}`}
                    data-testid={`testimonial-dot-${idx}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              FAQ
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              Common Questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="bg-white rounded-xl px-6 border-0 shadow-sm" data-testid={`faq-item-${idx}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-brand-primary" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-white mb-6">
              Take the First Step Today
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Your well-being matters. Begin your journey towards healing and self-discovery with a caring professional by your side.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/book">
                <Button size="lg" className="bg-white text-brand-primary hover:bg-gray-100" data-testid="cta-book-session">
                  Book Your Session <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// About Page
function AboutPage() {
  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero - Heavenly */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a8edea]/20 via-transparent to-[#fed6e3]/20" />
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-[#ffecd2]/40 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-gradient-to-br from-[#a8edea]/30 to-transparent rounded-full blur-3xl animate-float-slow animation-delay-500" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-white/80 backdrop-blur rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary border border-brand-primary/20">
                About Us
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Our Story
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              Emavaran was founded with a simple belief: everyone deserves access to compassionate, professional mental health support. Our name reflects our mission—to help you uncover your emotions and heal from within.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission - with new image */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-primary/20 to-accent-tertiary/20 rounded-[3rem] transform -rotate-3 animate-float-slow" />
              <img 
                src={MISSION_IMG} 
                alt="Emavaran Mission" 
                className="relative w-full rounded-[2.5rem] shadow-2xl image-shine"
                data-testid="about-mission-image"
              />
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 glass p-4 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-tertiary to-brand-primary rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-serif text-text-primary">Heal Within</p>
                    <p className="text-xs text-text-secondary">Uncover Emotions</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-accent-secondary/20 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-6 mt-4">
                Creating Safe Spaces for Healing
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                We believe that mental wellness is a journey, not a destination. At Emavaran, we create a warm, non-judgmental environment where you can explore your thoughts and feelings freely.
              </p>
              <p className="text-text-secondary leading-relaxed">
                Our approach is client-centered and tailored to your unique needs. Whether you're dealing with anxiety, navigating relationships, or seeking personal growth, we're here to walk alongside you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-secondary" data-testid="founders-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-accent-secondary/20 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary">
                Our Founders
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              Meet Manvi & Diksha
            </motion.h2>
          </motion.div>

          {/* Manvi */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-16"
          >
            <div className="heavenly-card rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start" data-testid="founder-manvi">
              <div className="md:col-span-1 relative flex justify-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <div className="absolute -inset-2 bg-gradient-to-br from-brand-primary/20 to-accent-tertiary/20 rounded-3xl transform rotate-2" />
                  <img 
                    src={MANVI_PHOTO} 
                    alt="Manvi Giri"
                    className="relative w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-3xl font-serif text-text-primary mb-2">Manvi Giri</h3>
                <p className="text-brand-primary font-medium mb-6">Counseling Psychologist | Mental Health Advocate | Co-Founder</p>
                
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Manvi Giri is a dedicated and empathetic Counseling Psychologist with over two years of experience in supporting the emotional and psychological well-being of individuals across diverse settings. With a Master's degree in Counseling Psychology and extensive experience in private practices, NGOs, and schools, she works closely with adults and adolescents navigating a range of emotional and developmental challenges.
                  </p>
                  <p>
                    Her therapeutic approach is client-centered and strengths-based, focusing on creating a safe, supportive, and non-judgmental space for individuals to explore their thoughts and emotions. She integrates practical techniques and evidence-based strategies to foster self-awareness, emotional regulation, and resilience.
                  </p>
                  <p>
                    Her work includes addressing concerns such as emotional regulation, self-esteem, peer relationships, and stress management. As a Life Skills Trainer, she designs and facilitates engaging sessions that focus on building self-belief, communication skills, problem-solving abilities, and emotional strength.
                  </p>
                  <p>
                    She is also experienced in psychoeducation and workshop facilitation, conducting interactive sessions for adults on themes such as self-confidence, emotional well-being, boundaries, and personal growth. Her approach emphasizes creating a safe and empowering space where individuals can express themselves freely.
                  </p>
                  <p className="italic text-text-primary">
                    "As the co-founder of Emavaran, Manvi is committed to making mental health support accessible, relatable, and impactful. Her work is guided by empathy, authenticity, and a deep commitment to fostering growth, resilience, and meaningful change."
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {['Emotional Regulation', 'Self-Esteem', 'Life Skills Training', 'Personal Growth', 'Stress Management'].map(spec => (
                    <span key={spec} className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-accent-secondary/10 rounded-full text-sm text-text-secondary border border-brand-primary/10">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diksha */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="heavenly-card rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start" data-testid="founder-diksha">
              <div className="md:col-span-1 md:order-2 relative flex justify-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <div className="absolute -inset-2 bg-gradient-to-br from-accent-tertiary/20 to-brand-primary/20 rounded-3xl transform -rotate-2" />
                  <img 
                    src={DIKSHA_PHOTO} 
                    alt="Diksha Mago"
                    className="relative w-full aspect-[3/4] object-cover object-top rounded-2xl shadow-lg"
                  />
                </div>
              </div>
              <div className="md:col-span-2 md:order-1">
                <h3 className="text-3xl font-serif text-text-primary mb-2">Diksha Mago</h3>
                <p className="text-brand-primary font-medium mb-6">Counseling Psychologist | Expressive Art Therapist | Mental Health Advocate | Co-Founder</p>
                
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Diksha Mago is a compassionate and dedicated Counseling Psychologist with a strong foundation in evidence-based therapeutic practices, around 2 years of experience and a deep commitment to emotional well-being. With a Master's degree in Counselling Psychology and PG Diploma in Psychological Counseling along with extensive experience across clinical, rehabilitation, and community settings, she supports individuals navigating a wide range of emotional and psychological challenges.
                  </p>
                  <p>
                    Her therapeutic approach is integrative and client-centered, drawing from Cognitive Behavioral Therapy (CBT), Gestalt Therapy, Emotion-Focused Therapy, and Expressive Art Therapy. She creates a safe, non-judgmental space where individuals can explore their thoughts and emotions, build self-awareness, and develop healthier coping mechanisms.
                  </p>
                  <p>
                    Diksha has worked with diverse populations, including children with special needs, individuals in rehabilitation settings, and adolescents in shelter homes—providing individual, group, workshops and family counseling. She is also experienced in Expressive Art Therapy, using creative techniques like drawing, painting, music, movement, storytelling and reflective exercises to facilitate emotional expression and healing.
                  </p>
                  <p>
                    As a workshop facilitator, she conducts interactive and experiential sessions on emotional strength, self-expression, stress management, and mental health awareness, helping participants engage with their inner experiences in meaningful and practical ways.
                  </p>
                  <p className="italic text-text-primary">
                    "Being a co-founder of Emavaran, she contributes to promoting accessible and impactful mental health support. Her work is rooted in empathy, creativity, and a genuine commitment to helping individuals move toward healing, growth, and self-discovery."
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {['Expressive Art Therapy', 'CBT', 'Gestalt Therapy', 'Emotion-Focused Therapy', 'Workshop Facilitation'].map(spec => (
                    <span key={spec} className="px-4 py-2 bg-gradient-to-r from-accent-tertiary/10 to-brand-primary/10 rounded-full text-sm text-text-secondary border border-accent-tertiary/10">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Our Values
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              What We Stand For
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Compassion', description: 'We approach every client with genuine care and understanding, creating a space free from judgment.' },
              { title: 'Confidentiality', description: 'Your privacy is sacred to us. Everything shared in our sessions remains strictly confidential.' },
              { title: 'Empowerment', description: 'We believe in your ability to heal and grow. Our role is to guide you in discovering your own strength.' }
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-sm border border-border text-center"
                data-testid={`value-card-${idx}`}
              >
                <h3 className="text-xl font-serif text-text-primary mb-4">{value.title}</h3>
                <p className="text-text-secondary">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Services Page
function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/services`)
      .then(r => r.json())
      .then(setServices)
      .catch(console.error);
  }, []);

  const getServiceIcon = (icon) => {
    const icons = { user: User, heart: Heart, users: Users, sparkles: Sparkles, monitor: Monitor, palette: Palette, graduation: GraduationCap };
    const Icon = icons[icon] || Heart;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <div className="pt-20 overflow-hidden">
      {/* Hero - Heavenly */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ffecd2]/30 via-[#fcb69f]/10 to-[#a8edea]/20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#fed6e3]/40 to-transparent rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-[#a8edea]/30 to-transparent rounded-full blur-3xl animate-float animation-delay-500" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-white/80 backdrop-blur rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary border border-brand-primary/20">
                Our Services
              </span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              How We Can Help You
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              We offer a range of counseling services tailored to your unique needs. Each session is designed to provide you with the support and tools you need for your mental wellness journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid - Heavenly Cards */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative" data-testid="services-list">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, idx) => {
              const serviceImages = {
                'individual': INDIVIDUAL_IMG,
                'student': STUDENT_IMG,
                'art-therapy': ART_THERAPY_IMG,
                'group': GROUP_IMG,
                'workshops': WORKSHOPS_IMG,
                'online': INDIVIDUAL_IMG,
                'psychoeducation': PSYCHOEDUCATION_IMG
              };
              const img = serviceImages[service.id];
              // Portrait-style illustrations need object-top to preserve faces
              const needsTopCrop = ['student', 'workshops'].includes(service.id);
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="heavenly-card rounded-3xl overflow-hidden group"
                  data-testid={`service-detail-${service.id}`}
                >
                  {/* Service Image */}
                  {img && (
                    <div className="relative h-56 overflow-hidden bg-[#fdf6e3]">
                      <img 
                        src={img} 
                        alt={service.title}
                        className={`w-full h-full transition-transform duration-700 group-hover:scale-110 ${needsTopCrop ? 'object-contain object-center' : 'object-cover'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="glass px-4 py-2 rounded-full">
                          <span className="text-white font-semibold">{service.price_display || '₹999'}</span>
                        </div>
                        <div className="glass px-3 py-1 rounded-full flex items-center">
                          <Clock className="h-3 w-3 text-white mr-1" />
                          <span className="text-white text-xs">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-brand-primary/20 to-accent-secondary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-2xl font-serif text-text-primary mb-4">{service.title}</h3>
                    <p className="text-text-secondary leading-relaxed mb-6 line-clamp-4">{service.description}</p>
                    
                    <Link to="/book" className="block">
                      <Button className="w-full group/btn" data-testid={`book-${service.id}`}>
                        Book This Service 
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Our 5 Verticals - Emavaran Signature Programs */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" data-testid="verticals-section" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        {/* Decorative leaves background */}
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{color: '#8b7355'}}>
              Our Signature Programs
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif mb-3" style={{color: '#1a3a5c'}}>
              Our <span style={{color: '#1a3a5c'}}>5 Verticals</span>
            </motion.h2>
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 my-6">
              <div className="h-px w-16" style={{background: '#c9a961'}} />
              <Sparkles className="h-5 w-5" style={{color: '#c9a961'}} />
              <div className="h-px w-16" style={{background: '#c9a961'}} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed" style={{color: '#3a5a7c'}}>
              Five focused verticals. Five unique spaces.<br />
              One holistic approach to healing &amp; growth.
            </motion.p>
          </motion.div>

          {/* Top row - 3 cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8"
          >
            {[
              {
                slug: 'nav',
                hindi: 'नव',
                english: 'Rehabilitation',
                description: 'Holistic rehabilitation programs for emotional, mental & behavioral well-being.',
                icon: <Sprout className="w-12 h-12" strokeWidth={1.5} />
              },
              {
                slug: 'sukoon',
                hindi: 'सुकून',
                english: 'Retreats',
                description: 'Restorative retreats to reconnect, recharge & rediscover inner balance in nurturing environments.',
                icon: <Leaf className="w-12 h-12" strokeWidth={1.5} />
              },
              {
                slug: 'udaan',
                hindi: 'उड़ान',
                english: 'School Programs',
                description: 'Interactive programs for students, teachers & parents to build emotional resilience & awareness.',
                icon: <BookOpen className="w-12 h-12" strokeWidth={1.5} />
              }
            ].map((vertical, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center border-2 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{borderColor: 'rgba(201, 169, 97, 0.3)'}}
                data-testid={`vertical-card-${idx}`}
              >
                <Link to={`/verticals/${vertical.slug}`} className="block">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'rgba(253, 246, 227, 0.9)', color: '#2d5016'}}>
                  {vertical.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{color: '#1a3a5c', fontFamily: 'serif'}}>
                  {vertical.hindi}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-lg font-medium" style={{color: '#4a7c3f'}}>— {vertical.english}</span>
                </div>
                <div className="w-12 h-px mx-auto mb-4" style={{background: '#c9a961'}} />
                <p className="text-sm md:text-base leading-relaxed" style={{color: '#3a5a7c'}}>
                  {vertical.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1" style={{color: '#c9a961'}}>Explore <ArrowRight className="h-3 w-3" /></p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom row - 2 cards centered */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                slug: 'saath',
                hindi: 'साथ',
                english: 'Corporate Wellness',
                description: 'Workplace wellness programs that foster mental well-being, productivity & harmony.',
                icon: <Briefcase className="w-12 h-12" strokeWidth={1.5} />
              },
              {
                slug: 'saksham',
                hindi: 'सक्षम',
                english: 'Workshops & Sessions for MHPs',
                description: 'Specialized workshops & professional support for mental health professionals to grow, learn & create lasting impact.',
                icon: <UserCheck className="w-12 h-12" strokeWidth={1.5} />
              }
            ].map((vertical, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center border-2 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{borderColor: 'rgba(201, 169, 97, 0.3)'}}
                data-testid={`vertical-card-${idx + 3}`}
              >
                <Link to={`/verticals/${vertical.slug}`} className="block">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{background: 'rgba(253, 246, 227, 0.9)', color: '#2d5016'}}>
                  {vertical.icon}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold mb-2" style={{color: '#1a3a5c', fontFamily: 'serif'}}>
                  {vertical.hindi}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-lg font-medium" style={{color: '#4a7c3f'}}>— {vertical.english}</span>
                </div>
                <div className="w-12 h-px mx-auto mb-4" style={{background: '#c9a961'}} />
                <p className="text-sm md:text-base leading-relaxed" style={{color: '#3a5a7c'}}>
                  {vertical.description}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1" style={{color: '#c9a961'}}>Explore <ArrowRight className="h-3 w-3" /></p>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <div className="inline-block px-8 py-4 rounded-full" style={{background: 'linear-gradient(90deg, transparent, rgba(201, 169, 97, 0.2), transparent)'}}>
              <p className="text-lg md:text-2xl font-serif tracking-wide uppercase" style={{color: '#1a3a5c', letterSpacing: '0.15em'}}>
                Let's Heal. Let's Grow. Together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Our Process
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              What to Expect
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { step: '01', title: 'Book', description: 'Choose your therapist and schedule a convenient time.' },
              { step: '02', title: 'Connect', description: 'Meet your therapist in a safe, confidential setting.' },
              { step: '03', title: 'Explore', description: 'Work through your challenges with professional guidance.' },
              { step: '04', title: 'Grow', description: 'Develop tools and insights for lasting well-being.' }
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="text-center"
                data-testid={`process-step-${idx}`}
              >
                <span className="text-5xl font-serif text-brand-primary/30">{item.step}</span>
                <h3 className="text-xl font-serif text-text-primary mt-4 mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Book Session Page
function BookSessionPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (selectedDate && selectedTherapist) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      fetch(`${API_URL}/api/bookings/available-slots?date=${dateStr}&therapist=${selectedTherapist}`)
        .then(r => r.json())
        .then(data => setAvailableSlots(data.available_slots))
        .catch(console.error);
    }
  }, [selectedDate, selectedTherapist]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTherapist || !selectedTime) {
      alert('Please select a date, therapist, and time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          therapist: selectedTherapist,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          ...formData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBookingDetails(data);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = { before: new Date() };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Book a Session
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Start Your Journey
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              Take the first step towards healing. Choose your preferred therapist, date, and time.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-24 px-6 md:px-12" data-testid="booking-section">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Calendar & Time */}
            <div className="space-y-8">
              {/* Therapist Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Select Therapist</label>
                <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                  <SelectTrigger data-testid="therapist-select">
                    <SelectValue placeholder="Choose a therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manvi" data-testid="select-manvi">Manvi Giri</SelectItem>
                    <SelectItem value="diksha" data-testid="select-diksha">Diksha Mago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Select Date</label>
                <div className="bg-white p-4 rounded-2xl border border-border">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    data-testid="booking-calendar"
                  />
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && selectedTherapist && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">Select Time</label>
                  <div className="grid grid-cols-4 gap-3">
                    {availableSlots.length > 0 ? (
                      availableSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            selectedTime === slot
                              ? 'bg-brand-primary text-white'
                              : 'bg-background-secondary text-text-primary hover:bg-brand-primary/20'
                          }`}
                          data-testid={`time-slot-${slot}`}
                        >
                          {slot}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-4 text-text-secondary text-sm">No available slots for this date.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact Info */}
            <div className="bg-white p-8 rounded-3xl border border-border h-fit">
              <h3 className="text-2xl font-serif text-text-primary mb-6">Your Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    data-testid="booking-name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    data-testid="booking-email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXXXXXXX"
                    data-testid="booking-phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Message (Optional)</label>
                  <Textarea
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Anything you'd like us to know before your session..."
                    data-testid="booking-message"
                  />
                </div>
              </div>

              {/* Pricing Note */}
              <div className="mt-6 p-4 bg-background-secondary rounded-xl">
                <p className="text-sm text-text-secondary">
                  <strong>Session Duration:</strong> 50-60 minutes<br />
                  <strong>Pricing:</strong> Contact for pricing details
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting || !selectedDate || !selectedTherapist || !selectedTime}
                data-testid="submit-booking"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent data-testid="booking-confirmation">
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your session has been scheduled successfully.
            </DialogDescription>
          </DialogHeader>
          {bookingDetails && (
            <div className="space-y-4 py-4">
              <div className="bg-background-secondary p-4 rounded-xl space-y-2">
                <p><strong>Therapist:</strong> {bookingDetails.therapist === 'manvi' ? 'Manvi Giri' : 'Diksha Mago'}</p>
                <p><strong>Date:</strong> {bookingDetails.date}</p>
                <p><strong>Time:</strong> {bookingDetails.time}</p>
              </div>
              <p className="text-sm text-text-secondary">
                We'll send a confirmation email to <strong>{bookingDetails.email}</strong> with all the details. If you have any questions, please contact us.
              </p>
            </div>
          )}
          <Button onClick={() => setShowConfirmation(false)} className="w-full" data-testid="close-confirmation">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Blog Page
function BlogPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/blogs`)
      .then(r => r.json())
      .then(setBlogs)
      .catch(console.error);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero — Heavenly */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{color: '#8b7355'}}>
              Insights &amp; Reflections
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light mb-6" style={{color: '#1a3a5c'}}>
              The Emavaran Journal
            </motion.h1>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <div className="h-px w-16" style={{background: '#c9a961'}} />
              <Sparkles className="h-5 w-5" style={{color: '#c9a961'}} />
              <div className="h-px w-16" style={{background: '#c9a961'}} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-lg leading-relaxed" style={{color: '#3a5a7c'}}>
              Thoughtful writings on mental health, cultural understanding, spirituality &amp; the climate of our minds — crafted by the Emavaran team to walk with you on your journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12" data-testid="blog-list">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2"
                style={{borderColor: 'rgba(201, 169, 97, 0.2)'}}
                data-testid={`blog-card-${blog.id}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={blog.image_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md" style={{background: 'rgba(253, 246, 227, 0.9)', color: '#1a3a5c'}}>
                      {blog.read_time}
                    </span>
                  </div>
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-2 text-xs mb-4" style={{color: '#8b7355'}}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    <span>{blog.created_at}</span>
                    <span>•</span>
                    <span className="font-medium">{blog.author}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif leading-snug mb-4 line-clamp-2 group-hover:text-brand-primary transition-colors" style={{color: '#1a3a5c'}}>
                    {blog.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6 line-clamp-3" style={{color: '#3a5a7c'}}>
                    {blog.excerpt}
                  </p>
                  <Link to={`/blog/${blog.id}`} className="inline-flex items-center gap-2 font-semibold text-sm group/link" style={{color: '#c9a961'}} data-testid={`read-blog-${blog.id}`}>
                    Read Article
                    <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Blog Detail Page
function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/blogs/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Blog not found');
        return r.json();
      })
      .then(setBlog)
      .catch(() => navigate('/blog'));
  }, [id, navigate]);

  if (!blog) return <div className="pt-20 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="pt-20" style={{background: 'linear-gradient(180deg, #fefdf8 0%, #ffffff 100%)'}}>
      {/* Hero image */}
      <div className="relative w-full h-[45vh] md:h-[60vh] overflow-hidden">
        <img 
          src={blog.image_url} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, rgba(26,58,92,0.2) 0%, rgba(26,58,92,0.75) 100%)'}} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12 md:pb-16 w-full">
            <Link to="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6 text-sm" data-testid="back-to-blog">
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Journal
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-white/90 text-xs md:text-sm mb-4">
              <span className="px-3 py-1 rounded-full backdrop-blur-md" style={{background: 'rgba(253, 246, 227, 0.25)'}}>
                {blog.read_time}
              </span>
              <span>•</span>
              <span>{blog.created_at}</span>
              <span>•</span>
              <span>By {blog.author}</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Article body */}
      <article className="py-16 md:py-24 px-6 md:px-12 relative" data-testid="blog-detail">
        {/* Decorative leaves */}
        <div className="absolute top-20 left-0 w-32 h-32 opacity-10 pointer-events-none">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 right-0 w-32 h-32 opacity-10 rotate-180 pointer-events-none">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Excerpt / lede */}
          <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-12 pb-8 border-b" style={{color: '#3a5a7c', borderColor: 'rgba(201, 169, 97, 0.3)'}}>
            {blog.excerpt}
          </p>

          <div className="space-y-5">
            {blog.content.split('\n\n').map((paragraph, idx) => {
              // Headings
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <div key={idx} className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="h-4 w-4 flex-shrink-0" style={{color: '#c9a961'}} />
                      <div className="h-px flex-1" style={{background: 'linear-gradient(90deg, #c9a961 0%, transparent 100%)'}} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif mb-2" style={{color: '#1a3a5c'}}>
                      {paragraph.replace(/\*\*/g, '')}
                    </h2>
                  </div>
                );
              }
              // Bullet list block
              if (paragraph.trim().startsWith('•')) {
                const items = paragraph.split('\n').filter(l => l.trim().startsWith('•'));
                return (
                  <ul key={idx} className="space-y-3 pl-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed" style={{color: '#3a5a7c'}}>
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{background: '#c9a961'}} />
                        <span className="text-base md:text-lg">{item.replace(/^•\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              // Regular paragraph
              return (
                <p key={idx} className="text-base md:text-lg leading-[1.9]" style={{color: '#3a5a7c'}}>
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-10 rounded-3xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 100%)', border: '2px solid rgba(201, 169, 97, 0.3)'}}>
            <div className="absolute top-4 right-4 opacity-20">
              <Heart className="h-16 w-16" style={{color: '#c9a961'}} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-3" style={{color: '#8b7355'}}>
              Take the Next Step
            </p>
            <p className="text-2xl md:text-3xl font-serif mb-3" style={{color: '#1a3a5c'}}>
              Ready to begin your healing journey?
            </p>
            <p className="mb-6 text-base leading-relaxed max-w-xl" style={{color: '#3a5a7c'}}>
              If this article resonated with you and you'd like to explore these topics further with a compassionate professional, we're here to walk beside you.
            </p>
            <Link to="/book">
              <Button className="rounded-full px-8" data-testid="blog-cta-book">
                Book a Session <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Author signature */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-12" style={{background: '#c9a961'}} />
              <p className="text-sm italic" style={{color: '#8b7355'}}>
                Written with care by {blog.author}
              </p>
              <div className="h-px w-12" style={{background: '#c9a961'}} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// Courses Page
function CoursesPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const courses = [
    {
      title: 'Understanding Your Emotions',
      subtitle: 'A beginner-friendly journey into emotional awareness',
      duration: '4 weeks',
      level: 'Beginner',
      icon: <Heart className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Naming emotions', 'Body-feeling awareness', 'Simple regulation tools'],
    },
    {
      title: 'Mindfulness for Everyday Life',
      subtitle: 'Practical mindfulness without the jargon',
      duration: '6 weeks',
      level: 'All levels',
      icon: <Sparkles className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Daily grounding practices', 'Breath & body scans', 'Mindful conversations'],
    },
    {
      title: 'Healing Through Art',
      subtitle: 'Expressive art therapy exercises you can do at home',
      duration: '5 weeks',
      level: 'All levels',
      icon: <Palette className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Guided art prompts', 'Processing with colour', 'Journaling with sketches'],
    },
    {
      title: 'Building Emotional Resilience',
      subtitle: 'Tools to bounce back and grow through setbacks',
      duration: '8 weeks',
      level: 'Intermediate',
      icon: <Sprout className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Reframing hard moments', 'Boundary setting', 'Growth mindset habits'],
    },
    {
      title: 'Parenting with Awareness',
      subtitle: 'Conscious parenting for connected, calmer families',
      duration: '6 weeks',
      level: 'Parents',
      icon: <Users className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Child-centred listening', 'Managing meltdowns', 'Co-regulation skills'],
    },
    {
      title: 'Self-Discovery Workshop',
      subtitle: 'A gentle inward journey to meet your true self',
      duration: '4 weeks',
      level: 'All levels',
      icon: <UserCheck className="w-7 h-7" strokeWidth={1.5} />,
      topics: ['Values clarification', 'Shadow work basics', 'Living with intention'],
    },
  ];

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180">
          <Leaf className="w-full h-full text-green-700" strokeWidth={1} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{color: '#8b7355'}}>
              Learn &amp; Grow
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light mb-6" style={{color: '#1a3a5c'}}>
              Emavaran Courses
            </motion.h1>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <div className="h-px w-16" style={{background: '#c9a961'}} />
              <Sparkles className="h-5 w-5" style={{color: '#c9a961'}} />
              <div className="h-px w-16" style={{background: '#c9a961'}} />
            </motion.div>
            <motion.p variants={fadeInUp} className="text-lg leading-relaxed mb-6" style={{color: '#3a5a7c'}}>
              Thoughtfully designed self-paced courses to walk you deeper into emotional wellness, mindfulness, and self-discovery — crafted by Manvi &amp; Diksha. New cohorts launching soon.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider" style={{background: 'rgba(201, 169, 97, 0.15)', color: '#8b7355'}}>
                <Sparkles className="h-3.5 w-3.5" /> Coming Soon
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Course — Expressive Art Therapy Certificate */}
      <section className="py-16 md:py-24 px-6 md:px-12 relative overflow-hidden" style={{background: '#fffbea'}} data-testid="featured-course">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4" style={{background: 'rgba(201, 169, 97, 0.2)', color: '#8b7355'}}>
              Featured Course · Enrolment Open
            </span>
            <p className="text-base md:text-lg font-serif" style={{color: '#2d5016'}}>Certificate Course in</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mt-1 mb-4 leading-tight" style={{color: '#1a3f2a'}}>
              Expressive Art Therapy
            </h2>
            <p className="text-sm md:text-base font-bold tracking-widest uppercase" style={{color: '#2d5016'}}>
              Learn. Facilitate. Create Meaningful Therapeutic Spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-3xl mx-auto">
            {[
              { icon: <Monitor className="w-6 h-6" strokeWidth={2} />, bg: '#2d5c54', label: '3 month online course' },
              { icon: <CalendarIcon className="w-6 h-6" strokeWidth={2} />, bg: '#d97757', label: 'Starts 25 October' },
              { icon: <Sparkles className="w-6 h-6" strokeWidth={2} />, bg: '#9b7ec5', label: 'Certification accredited by the International Association of Therapists' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/70 rounded-2xl p-5 border-2" style={{borderColor: 'rgba(201, 169, 97, 0.2)'}}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{background: item.bg}}>
                  {item.icon}
                </div>
                <p className="text-sm md:text-base font-semibold leading-snug pt-1" style={{color: '#1a3f2a'}}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/contact">
              <Button className="rounded-full px-10 py-6 text-base" data-testid="eat-enroll" style={{background: '#2d5016', color: 'white'}}>
                Enrol Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet the Facilitator — Diksha Mago */}
      <section className="py-16 md:py-24 px-6 md:px-12" style={{background: '#fef9d7'}} data-testid="meet-facilitator">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl md:text-3xl font-serif mb-2" style={{color: '#2d5016'}}>
            Meet the Facilitator
          </p>
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-4" style={{color: '#1a3f2a'}}>
            Diksha Mago
          </h2>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-20" style={{background: '#8b7355'}} />
            <Sparkles className="h-4 w-4" style={{color: '#8b7355'}} />
            <div className="h-px w-20" style={{background: '#8b7355'}} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-10 md:gap-14 items-center">
            <div>
              <p className="font-bold text-lg md:text-xl mb-1" style={{color: '#2d5016'}}>Counseling Psychologist</p>
              <p className="font-bold text-lg md:text-xl mb-8" style={{color: '#2d5016'}}>UNESCO-CID Certified Expressive Arts Therapist</p>
              <p className="text-base md:text-lg leading-[1.9] font-semibold" style={{color: '#1a3f2a'}}>
                Diksha Mago brings together psychological insight, neuropsychological understanding, and creative expression in her work. She has facilitated multiple sessions and conducted certification courses, creating reflective and engaging learning spaces for people exploring expressive arts therapy. As co-founder of Emavaran, she contributes to meaningful spaces for psychological wellbeing, learning, and creative growth.
              </p>
            </div>
            <div className="relative mx-auto md:mx-0">
              <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={DIKSHA_PHOTO} alt="Diksha Mago" className="w-full h-full object-cover" />
              </div>
              <Leaf className="absolute -bottom-6 -right-6 w-28 h-28 opacity-70" style={{color: '#4a7c3f'}} strokeWidth={1} />
            </div>
          </div>

          <div className="mt-14 max-w-md">
            <div className="bg-white/80 rounded-xl p-5 shadow-sm border" style={{borderColor: 'rgba(139, 115, 85, 0.2)'}}>
              <p className="font-serif italic text-base md:text-lg leading-relaxed" style={{color: '#2d5016', fontFamily: 'cursive'}}>
                "Learn from a facilitator who honours both the person and the process."
              </p>
              <div className="mt-3 flex justify-center">
                <Heart className="h-4 w-4" style={{color: '#4a7c3f'}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 md:py-28 px-6 md:px-12" data-testid="courses-list">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {courses.map((course, idx) => (
              <motion.article
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2 relative"
                style={{borderColor: 'rgba(201, 169, 97, 0.25)'}}
                data-testid={`course-card-${idx}`}
              >
                {/* Course cover with icon */}
                <div className="relative h-40 flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 100%)'}}>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md" style={{background: 'rgba(201, 169, 97, 0.2)', color: '#8b7355'}}>
                      Coming Soon
                    </span>
                  </div>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500" style={{background: 'white', color: '#2d5016'}}>
                    {course.icon}
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-center gap-3 text-xs mb-3" style={{color: '#8b7355'}}>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>
                  <h3 className="text-xl font-serif mb-2 leading-snug" style={{color: '#1a3a5c'}}>
                    {course.title}
                  </h3>
                  <p className="text-sm italic mb-5" style={{color: '#4a7c3f'}}>
                    {course.subtitle}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {course.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{color: '#3a5a7c'}}>
                        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full" style={{background: '#c9a961'}} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    disabled
                    variant="outline"
                    className="w-full rounded-full border-2 opacity-70 cursor-not-allowed"
                    style={{borderColor: 'rgba(201, 169, 97, 0.4)', color: '#8b7355'}}
                    data-testid={`course-notify-${idx}`}
                  >
                    Notify Me When Launched
                  </Button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notify CTA Band */}
      <section className="py-20 md:py-24 px-6 md:px-12" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="h-10 w-10 mx-auto mb-4" style={{color: '#c9a961'}} />
          <h2 className="text-3xl md:text-5xl font-serif mb-4" style={{color: '#1a3a5c'}}>
            Be the first to know
          </h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{color: '#3a5a7c'}}>
            Join our mailing list and get early access when our first cohort opens — plus a free introductory guide to emotional wellness.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{background: 'rgba(74, 124, 63, 0.15)', color: '#2d5016'}}>
              <Sparkles className="h-5 w-5" />
              <span className="font-semibold">Thank you! We'll be in touch soon.</span>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" data-testid="course-notify-form">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-full border-2 bg-white"
                style={{borderColor: 'rgba(201, 169, 97, 0.4)'}}
                data-testid="course-notify-email"
              />
              <Button type="submit" className="rounded-full px-8" data-testid="course-notify-submit">
                Notify Me <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
          <p className="mt-10 text-lg md:text-xl font-serif tracking-wide uppercase" style={{color: '#1a3a5c', letterSpacing: '0.15em'}}>
            Let's Heal. Let's Grow. Together.
          </p>
        </div>
      </section>
    </div>
  );
}

// Vertical Detail Page
function VerticalDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vertical = VERTICALS_DATA.find(v => v.slug === slug);

  useEffect(() => {
    if (!vertical) navigate('/services');
    window.scrollTo(0, 0);
  }, [vertical, navigate]);

  if (!vertical) return null;
  const heroImage = vertical.photos[0]?.src;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20"><Leaf className="w-full h-full text-green-700" strokeWidth={1} /></div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180"><Leaf className="w-full h-full text-green-700" strokeWidth={1} /></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <Link to="/services" className="inline-flex items-center text-sm mb-8 hover:opacity-70 transition" style={{color: '#8b7355'}}>
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to all Verticals
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 md:gap-12 items-center">
            <motion.div initial={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:0.5}} className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center p-8 shadow-lg" style={{background: 'white', color: vertical.accent}}>
              {getVerticalIcon(vertical.slug)}
            </motion.div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-3" style={{color: '#8b7355'}}>Our Signature Program</p>
              <h1 className="text-5xl md:text-7xl font-bold font-serif mb-2" style={{color: '#1a3a5c'}}>{vertical.hindi}</h1>
              <h2 className="text-2xl md:text-3xl font-serif mb-4" style={{color: vertical.accent}}>— {vertical.english}</h2>
              <div className="flex items-center gap-3 mb-4"><div className="h-px w-16" style={{background:'#c9a961'}} /><Sparkles className="h-4 w-4" style={{color:'#c9a961'}} /><div className="h-px w-16" style={{background:'#c9a961'}} /></div>
              <p className="text-lg italic" style={{color: '#3a5a7c'}}>{vertical.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About + offerings */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-serif mb-6" style={{color: '#1a3a5c'}}>About this vertical</h3>
            <p className="text-base md:text-lg leading-[1.9]" style={{color: '#3a5a7c'}}>{vertical.long}</p>
          </div>
          <div>
            <h3 className="text-3xl font-serif mb-6" style={{color: '#1a3a5c'}}>What we offer</h3>
            <ul className="space-y-4">
              {vertical.offerings.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-base md:text-lg" style={{color: '#3a5a7c'}}>
                  <span className="mt-2 flex-shrink-0 w-2 h-2 rounded-full" style={{background: vertical.accent}} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Photos */}
      {vertical.photos.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12" style={{background: 'linear-gradient(180deg, #fefdf8 0%, #fdf6e3 100%)'}} data-testid={`vertical-photos-${vertical.slug}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-3" style={{color: '#8b7355'}}>Moments</p>
              <h3 className="text-3xl md:text-5xl font-serif" style={{color: '#1a3a5c'}}>Glimpses from {vertical.english}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {vertical.photos.map((p, i) => (
                <motion.div key={i} initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.4, delay: i * 0.05}} className="group relative overflow-hidden rounded-2xl aspect-square shadow-md hover:shadow-xl transition-all" data-testid={`photo-${vertical.slug}-${i}`}>
                  <img src={p.src} alt={p.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-xs md:text-sm leading-snug">{p.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-24 px-6 md:px-12" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 100%)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="h-10 w-10 mx-auto mb-4" style={{color: vertical.accent}} />
          <h2 className="text-3xl md:text-5xl font-serif mb-4" style={{color: '#1a3a5c'}}>Ready to be part of {vertical.hindi}?</h2>
          <p className="text-base md:text-lg mb-8 leading-relaxed" style={{color: '#3a5a7c'}}>Reach out to Manvi or Diksha and we'll help you take the next step with warmth and care.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book"><Button className="rounded-full px-8" data-testid={`vertical-cta-book-${vertical.slug}`}>Book a Session <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/contact"><Button variant="outline" className="rounded-full px-8 border-2" style={{borderColor: vertical.accent, color: vertical.accent}}>Get in Touch</Button></Link>
          </div>
          <p className="mt-10 text-lg md:text-xl font-serif tracking-wide uppercase" style={{color: '#1a3a5c', letterSpacing: '0.15em'}}>Let's Heal. Let's Grow. Together.</p>
        </div>
      </section>
    </div>
  );
}

// Events Page
function EventsPage() {
  const events = [
    { title: 'Sukoon Mountain Retreat', date: 'March 15–17, 2026', location: 'Shoghi, Himachal Pradesh', type: 'Retreat', spots: '12 seats', icon: <Leaf className="w-7 h-7" strokeWidth={1.5}/>, desc: 'Three days of sound healing, expressive art, mindful walks & community meals.' },
    { title: 'Between Bells & Breaks', date: 'April 8, 2026', location: 'Delhi NCR schools', type: 'Teacher Training', spots: 'By invitation', icon: <BookOpen className="w-7 h-7" strokeWidth={1.5}/>, desc: 'Emotional reset workshop for educators returning after summer break.' },
    { title: 'Expressive Art Therapy Circle', date: 'February 22, 2026', location: 'Online (Zoom)', type: 'Workshop', spots: '20 seats', icon: <Palette className="w-7 h-7" strokeWidth={1.5}/>, desc: 'A gentle 2-hour group session using art to process overwhelming feelings.' },
    { title: 'Saksham Peer Supervision', date: 'Last Sunday every month', location: 'Online (Zoom)', type: 'For MHPs', spots: '15 seats', icon: <UserCheck className="w-7 h-7" strokeWidth={1.5}/>, desc: 'Case consultation & peer support circle for mental health professionals.' },
    { title: 'Corporate Wellness Day', date: 'On request', location: 'At your workplace', type: 'Corporate', spots: 'Custom', icon: <Briefcase className="w-7 h-7" strokeWidth={1.5}/>, desc: 'A full day of workshops, 1:1 check-ins and leadership sessions for teams.' },
    { title: 'Parenting with Awareness', date: 'May 11, 2026', location: 'Delhi NCR', type: 'Workshop', spots: '25 seats', icon: <Users className="w-7 h-7" strokeWidth={1.5}/>, desc: 'A conscious-parenting workshop for connected, calmer families.' }
  ];
  return (
    <div className="pt-20">
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 50%, #fdf2d0 100%)'}}>
        <div className="absolute top-10 left-0 w-40 h-40 opacity-20"><Leaf className="w-full h-full text-green-700" strokeWidth={1} /></div>
        <div className="absolute bottom-10 right-0 w-40 h-40 opacity-20 rotate-180"><Leaf className="w-full h-full text-green-700" strokeWidth={1} /></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{color: '#8b7355'}}>Join us</motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light mb-6" style={{color: '#1a3a5c'}}>Upcoming Events</motion.h1>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6"><div className="h-px w-16" style={{background:'#c9a961'}} /><Sparkles className="h-5 w-5" style={{color:'#c9a961'}} /><div className="h-px w-16" style={{background:'#c9a961'}} /></motion.div>
            <motion.p variants={fadeInUp} className="text-lg leading-relaxed" style={{color: '#3a5a7c'}}>Retreats, workshops, and professional circles curated by Manvi &amp; Diksha. Save a seat, bring a friend, or hold space for yourself — we'd love to have you.</motion.p>
          </motion.div>
        </div>
      </section>
      <section className="py-20 md:py-28 px-6 md:px-12" data-testid="events-list">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev, idx) => (
              <motion.article key={idx} variants={fadeInUp} whileHover={{y:-8, transition:{duration:0.3}}} className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border-2" style={{borderColor:'rgba(201, 169, 97, 0.25)'}} data-testid={`event-card-${idx}`}>
                <div className="relative h-32 flex items-center justify-center overflow-hidden" style={{background:'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 100%)'}}>
                  <div className="absolute top-4 left-4"><span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md" style={{background:'rgba(201, 169, 97, 0.2)', color:'#8b7355'}}>{ev.type}</span></div>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500" style={{background:'white', color:'#2d5016'}}>{ev.icon}</div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-serif mb-3 leading-snug" style={{color:'#1a3a5c'}}>{ev.title}</h3>
                  <div className="space-y-2 mb-4 text-sm" style={{color:'#3a5a7c'}}>
                    <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 flex-shrink-0" style={{color:'#c9a961'}} /><span>{ev.date}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0" style={{color:'#c9a961'}} /><span>{ev.location}</span></div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 flex-shrink-0" style={{color:'#c9a961'}} /><span>{ev.spots}</span></div>
                  </div>
                  <p className="text-sm leading-relaxed mb-5" style={{color:'#3a5a7c'}}>{ev.desc}</p>
                  <Link to="/contact"><Button variant="outline" className="w-full rounded-full border-2" style={{borderColor:'rgba(201, 169, 97, 0.4)', color:'#1a3a5c'}} data-testid={`event-register-${idx}`}>Register Interest <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="py-16 px-6 md:px-12" style={{background: 'linear-gradient(135deg, #fdf6e3 0%, #fef9e7 100%)'}}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl font-serif tracking-wide uppercase" style={{color: '#1a3a5c', letterSpacing: '0.15em'}}>Let's Heal. Let's Grow. Together.</p>
        </div>
      </section>
    </div>
  );
}

// Contact Page
function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Contact Us
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Get in Touch
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              Have questions or want to learn more about our services? We'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="contact-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-serif text-text-primary mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Email</h3>
                    <a href="mailto:emavarantherapy@gmail.com" className="text-text-secondary hover:text-brand-primary transition-colors" data-testid="contact-email">
                      emavarantherapy@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Phone</h3>
                    <a href="tel:+917827453162" className="text-text-secondary hover:text-brand-primary transition-colors" data-testid="contact-phone">
                      +91 7827453162
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Hours</h3>
                    <p className="text-text-secondary">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-12">
                <div className="w-full h-64 bg-background-secondary rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-brand-primary mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">Online sessions available</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {submitted ? (
                <div className="bg-white p-8 rounded-3xl border border-border text-center" data-testid="contact-success">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-text-primary mb-4">Message Sent!</h3>
                  <p className="text-text-secondary mb-6">Thank you for reaching out. We'll get back to you within 24-48 hours.</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" data-testid="send-another">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-border" data-testid="contact-form">
                  <h2 className="text-2xl font-serif text-text-primary mb-6">Send Us a Message</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        data-testid="contact-name-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        data-testid="contact-email-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Phone (Optional)</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 XXXXXXXXXX"
                        data-testid="contact-phone-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Subject *</label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What is this about?"
                        data-testid="contact-subject-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Message *</label>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Your message..."
                        data-testid="contact-message-input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-6"
                    disabled={isSubmitting}
                    data-testid="submit-contact"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Gallery Page
function GalleryPage() {
  const images = [
    { src: BRAND_LOGO, alt: 'Emavaran Logo', caption: 'Our Brand' },
    { src: MANVI_PHOTO, alt: 'Manvi Giri', caption: 'Manvi Giri - Clinical Psychologist' },
    { src: DIKSHA_PHOTO, alt: 'Diksha Mago', caption: 'Diksha Mago - Counseling Psychologist' },
    { src: THERAPY_ROOM, alt: 'Therapy Room', caption: 'Safe & Comfortable Space' },
    { src: HERO_BG, alt: 'Abstract Background', caption: 'Healing & Wellness' },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Gallery
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Our Space & Team
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              A glimpse into the calming environment and dedicated team at Emavaran.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="gallery-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl"
                data-testid={`gallery-image-${idx}`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D3748]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium">{image.caption}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Main App
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Public Routes - With Navbar/Footer */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background-primary">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book" element={<BookSessionPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/verticals/:slug" element={<VerticalDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
