import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, 
  User, Heart, Users, Sparkles, Star, ArrowRight, Calendar as CalendarIcon,
  Facebook, Instagram, Linkedin, Monitor, Palette, GraduationCap
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
const GROUP_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/3lndq4a7_group.jpeg";
const WORKSHOPS_IMG = "https://customer-assets.emergentagent.com/job_wellness-journey-225/artifacts/qsy90nw2_workshops.jpeg";

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

      {/* Services Highlights - Heavenly Design */}
      <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" data-testid="services-section">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-[#a8edea]/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-br from-[#fed6e3]/20 to-transparent rounded-full blur-2xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-brand-primary/10 to-accent-secondary/20 rounded-full text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary">
                Our Services
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-serif text-text-primary">
              How We Can Help
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.slice(0, 4).map((service, idx) => {
              const serviceImages = {
                'individual': INDIVIDUAL_IMG,
                'student': INDIVIDUAL_IMG,
                'art-therapy': ART_THERAPY_IMG,
                'group': GROUP_IMG,
                'workshops': WORKSHOPS_IMG,
                'online': INDIVIDUAL_IMG,
                'psychoeducation': WORKSHOPS_IMG
              };
              const img = serviceImages[service.id];
              
              return (
                <motion.div
                  key={service.id}
                  variants={fadeInUp}
                  className="heavenly-card rounded-3xl overflow-hidden group"
                  data-testid={`service-card-${service.id}`}
                >
                  {img && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={img} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-brand-primary">
                          {service.price_display}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                      {getServiceIcon(service.icon)}
                    </div>
                    <h3 className="text-xl font-serif text-text-primary mb-3">{service.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">{service.description.substring(0, 100)}...</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-12"
          >
            <Link to="/services">
              <Button variant="outline" className="glass hover:bg-brand-primary hover:text-white" data-testid="view-all-services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
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
                className="w-full h-full object-cover object-[10%] rounded-2xl"
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
              className="relative w-full aspect-[3/4] object-cover object-[20%] rounded-2xl shadow-lg"
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
                'student': INDIVIDUAL_IMG,
                'art-therapy': ART_THERAPY_IMG,
                'group': GROUP_IMG,
                'workshops': WORKSHOPS_IMG,
                'online': INDIVIDUAL_IMG,
                'psychoeducation': WORKSHOPS_IMG
              };
              const img = serviceImages[service.id];
              
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
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={img} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

function BookSessionPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      fetch(`${API_URL}/api/bookings/available-slots?date=${dateStr}`)
        .then(r => r.json())
        .then(data => setAvailableSlots(data.available_slots))
        .catch(console.error);
    }
  }, [selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
   const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService,
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
              Take the first step towards healing. Choose your preferred date and time.
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
        {/* Service Selection */}
<div>
  <label className="block text-sm font-medium text-text-primary mb-3">Select Service</label>
  <Select value={selectedService} onValueChange={setSelectedService}>
    <SelectTrigger data-testid="service-select">
      <SelectValue placeholder="Choose a service" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Individual Counseling">Individual Counseling</SelectItem>
      <SelectItem value="Student Therapy">Student Therapy</SelectItem>
      <SelectItem value="Expressive Art Therapy">Expressive Art Therapy</SelectItem>
      <SelectItem value="Group Counseling">Group Counseling</SelectItem>
      <SelectItem value="Workshops">Workshops</SelectItem>
      <SelectItem value="Psychoeducation Sessions">Psychoeducation Sessions</SelectItem>
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
              {selectedDate && (
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
                disabled={isSubmitting || !selectedDate || !selectedTime}
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
                <p><strong>Date:</strong> {bookingDetails.date}</p>
                <p><strong>Time:</strong> {bookingDetails.time}</p>
              </div>
              <p className="text-sm text-text-secondary">
                We'll send a confirmation email to <strong>{bookingDetails.email}</strong> with all the details.
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
              Our Blog
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Insights & Resources
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              Explore our articles on mental health, well-being, and personal growth. Written by our therapists to support your journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="blog-list">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow"
                data-testid={`blog-card-${blog.id}`}
              >
                <img 
                  src={blog.image_url} 
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                    <span>{blog.created_at}</span>
                    <span>•</span>
                    <span>{blog.read_time}</span>
                  </div>
                  <h3 className="text-xl font-serif text-text-primary mb-3">{blog.title}</h3>
                  <p className="text-text-secondary text-sm mb-4">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brand-primary font-medium">{blog.author}</span>
                    <Link to={`/blog/${blog.id}`}>
                      <Button variant="ghost" size="sm" data-testid={`read-blog-${blog.id}`}>
                        Read More <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
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
    <div className="pt-20">
      <article className="py-16 md:py-24 px-6 md:px-12" data-testid="blog-detail">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center text-brand-primary hover:text-brand-hover mb-8" data-testid="back-to-blog">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Blog
          </Link>

          <img 
            src={blog.image_url} 
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8"
          />

          <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
            <span>{blog.created_at}</span>
            <span>•</span>
            <span>{blog.read_time}</span>
            <span>•</span>
            <span>By {blog.author}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif text-text-primary mb-8">{blog.title}</h1>

          <div className="prose prose-lg max-w-none">
            {blog.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <h2 key={idx} className="text-2xl font-serif text-text-primary mt-8 mb-4">{paragraph.replace(/\*\*/g, '')}</h2>;
              }
              return <p key={idx} className="text-text-secondary leading-relaxed mb-4">{paragraph}</p>;
            })}
          </div>

          <div className="mt-12 p-8 bg-background-secondary rounded-2xl">
            <p className="text-text-primary font-serif text-xl mb-4">Ready to take the next step?</p>
            <p className="text-text-secondary mb-6">If this article resonated with you and you'd like to explore these topics further, we're here to help.</p>
            <Link to="/book">
              <Button data-testid="blog-cta-book">Book a Session</Button>
            </Link>
          </div>
        </div>
      </article>
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
