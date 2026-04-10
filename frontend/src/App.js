import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Phone, Mail, MapPin, Clock, ChevronRight, 
  User, Heart, Users, Sparkles, Star, ArrowRight, Calendar as CalendarIcon,
  Facebook, Instagram, Linkedin
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Textarea } from './components/ui/Textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/Accordion';
import { Calendar } from './components/ui/Calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/Dialog';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Brand Assets
const BRAND_LOGO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/5tpkky0k_WhatsApp%20Image%202026-04-10%20at%204.11.34%20PM.jpeg";
const MANVI_PHOTO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/k1imk6ox_IMG_3581.JPG.jpeg";
const DIKSHA_PHOTO = "https://customer-assets.emergentagent.com/job_0ddf470c-530c-4b73-b546-d7dd762933cd/artifacts/9ciapjg1_WhatsApp%20Image%202026-04-10%20at%204.06.18%20PM.jpeg";
const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/0ddf470c-530c-4b73-b546-d7dd762933cd/images/32fd8022c1f4f8be618a1e23248f122972f1cac8fa44eea1a0d649daa9c7bab1.png";
const THERAPY_ROOM = "https://static.prod-images.emergentagent.com/jobs/0ddf470c-530c-4b73-b546-d7dd762933cd/images/85699758cf1d8d5aa539b0539957266055efeaaecf627194a02ca413f763edbc.png";

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
    const icons = { user: User, heart: Heart, users: Users, sparkles: Sparkles };
    const Icon = icons[icon] || Heart;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20" data-testid="hero-section">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.4
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-6">
              Counseling & Mental Wellness
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-light tracking-tight text-text-primary mb-6">
              Healing begins with understanding.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-2xl">
              Welcome to Emavaran, a safe space where you can explore your thoughts, feelings, and challenges with compassionate guidance from experienced psychologists.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/book">
                <Button size="lg" data-testid="hero-book-session">
                  Book a Session <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" data-testid="hero-contact">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Highlights */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-background-secondary" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Our Services
            </motion.p>
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
            {services.slice(0, 4).map((service, idx) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F3F0E9] transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
                data-testid={`service-card-${service.id}`}
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-xl font-serif text-text-primary mb-3">{service.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{service.description.substring(0, 100)}...</p>
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
            <Link to="/services">
              <Button variant="outline" data-testid="view-all-services">
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
              { name: 'Manvi Giri', title: 'Clinical Psychologist', photo: MANVI_PHOTO, specializations: ['Anxiety & Stress', 'Depression', 'Personal Growth'], bio: 'Manvi brings warmth and understanding to every session. Her client-centered approach helps individuals discover their inner strength.' },
              { name: 'Diksha Mago', title: 'Counseling Psychologist', photo: DIKSHA_PHOTO, specializations: ['Relationship Counseling', 'Emotional Wellbeing', 'Self-Esteem'], bio: 'Diksha creates a safe, non-judgmental space where clients feel heard and valued. She specializes in helping people build meaningful relationships.' }
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
              About Us
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              Our Story
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              Emavaran was founded with a simple belief: everyone deserves access to compassionate, professional mental health support. Our name reflects our mission—to help you uncover your emotions and heal from within.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img 
                src={THERAPY_ROOM} 
                alt="Therapy Room" 
                className="w-full rounded-3xl shadow-lg"
                data-testid="about-therapy-room-image"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
                Our Mission
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-6">
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
            <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary mb-4">
              Our Founders
            </motion.p>
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
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-center" data-testid="founder-manvi">
              <div className="md:col-span-1">
                <img 
                  src={MANVI_PHOTO} 
                  alt="Manvi Giri"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="text-3xl font-serif text-text-primary mb-2">Manvi Giri</h3>
                <p className="text-brand-primary font-medium mb-4">Clinical Psychologist | Co-Founder</p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Manvi is a dedicated clinical psychologist with over 2 years of experience helping individuals navigate anxiety, depression, and personal growth challenges. Her warm, empathetic approach creates a safe space where clients feel truly heard and understood.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  She believes in the power of self-discovery and works collaboratively with clients to uncover their inner strength. Manvi's therapeutic style is integrative, drawing from various evidence-based approaches tailored to each individual's needs.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Anxiety & Stress', 'Depression', 'Personal Growth', 'Self-Discovery'].map(spec => (
                    <span key={spec} className="px-4 py-2 bg-background-secondary rounded-full text-sm text-text-secondary">
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
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8 items-center" data-testid="founder-diksha">
              <div className="md:col-span-1 md:order-2">
                <img 
                  src={DIKSHA_PHOTO} 
                  alt="Diksha Mago"
                  className="w-full aspect-[3/4] object-cover rounded-2xl"
                />
              </div>
              <div className="md:col-span-2 md:order-1">
                <h3 className="text-3xl font-serif text-text-primary mb-2">Diksha Mago</h3>
                <p className="text-brand-primary font-medium mb-4">Counseling Psychologist | Co-Founder</p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Diksha is a compassionate counseling psychologist specializing in relationships, emotional wellbeing, and self-esteem. With over 2 years of experience, she helps clients build healthier connections with themselves and others.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Her non-judgmental approach allows clients to explore their feelings openly. Diksha believes that understanding our emotions is the first step toward healing, and she gently guides clients through this process of self-discovery.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Relationship Counseling', 'Emotional Wellbeing', 'Self-Esteem', 'Communication'].map(spec => (
                    <span key={spec} className="px-4 py-2 bg-background-secondary rounded-full text-sm text-text-secondary">
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
    const icons = { user: User, heart: Heart, users: Users, sparkles: Sparkles };
    const Icon = icons[icon] || Heart;
    return <Icon className="h-8 w-8" />;
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
              Our Services
            </motion.p>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-light text-text-primary mb-6">
              How We Can Help You
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-text-secondary leading-relaxed">
              We offer a range of counseling services tailored to your unique needs. Each session is designed to provide you with the support and tools you need for your mental wellness journey.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32 px-6 md:px-12" data-testid="services-list">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-border hover:shadow-xl transition-shadow"
                data-testid={`service-detail-${service.id}`}
              >
                <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-2xl font-serif text-text-primary mb-4">{service.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-6">{service.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center text-text-secondary">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                  <span className="text-brand-primary font-medium">Contact for pricing</span>
                </div>
                <Link to="/book" className="block mt-6">
                  <Button className="w-full" data-testid={`book-${service.id}`}>
                    Book This Service
                  </Button>
                </Link>
              </motion.div>
            ))}
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
    </Router>
  );
}

export default App;
