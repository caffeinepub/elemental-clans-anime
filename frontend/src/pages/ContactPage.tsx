import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  MessageCircle,
  Mic2,
  Briefcase,
  Heart,
  Mail,
  Moon,
  Star,
  Send,
  CheckCircle2,
  Sparkles,
  Shield,
  Gift,
  User,
  MessageSquare,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { SiDiscord, SiX, SiInstagram } from 'react-icons/si';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollProgressBar from '../components/ScrollProgressBar';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';
import { useSubmitContactMessage, useSubmitFanMail } from '../hooks/useQueries';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContactSection {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  emailLabel: string;
  email: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  badgeColor: string;
  emoji: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const CONTACT_SECTIONS: ContactSection[] = [
  {
    icon: MessageCircle,
    title: 'General Questions & Support',
    subtitle: "Got a question? We're here to help.",
    description:
      "Reach out for general inquiries about the series, lore questions, episode updates, website issues, or anything else you'd like to know about Whispers Of The White Moon.",
    emailLabel: 'Send a message',
    email: 'support@wotwm.com',
    accentColor: 'oklch(0.65 0.18 220)',
    borderColor: 'rgba(79, 195, 247, 0.4)',
    glowColor: 'rgba(79, 195, 247, 0.18)',
    badgeColor: 'oklch(0.72 0.14 220)',
    emoji: '🌙',
  },
  {
    icon: Mic2,
    title: 'Collaboration & Casting',
    subtitle: 'Lend your voice to the legend.',
    description:
      "Are you a voice actor, animator, composer, or creative professional interested in contributing to the project? We'd love to hear from you. Include your portfolio or demo reel when reaching out.",
    emailLabel: 'Apply now',
    email: 'casting@wotwm.com',
    accentColor: 'oklch(0.7 0.2 40)',
    borderColor: 'rgba(251, 113, 33, 0.45)',
    glowColor: 'rgba(251, 113, 33, 0.18)',
    badgeColor: 'oklch(0.75 0.2 40)',
    emoji: '🔥',
  },
  {
    icon: Briefcase,
    title: 'Business & Partnerships',
    subtitle: "Let's build something legendary together.",
    description:
      'For sponsorship opportunities, brand partnerships, licensing inquiries, press coverage, or any other business-related discussions, please reach out to our team directly.',
    emailLabel: 'Get in touch',
    email: 'business@wotwm.com',
    accentColor: 'oklch(0.82 0.18 80)',
    borderColor: 'rgba(251, 191, 36, 0.45)',
    glowColor: 'rgba(251, 191, 36, 0.18)',
    badgeColor: 'oklch(0.85 0.18 75)',
    emoji: '☀️',
  },
  {
    icon: Heart,
    title: 'Supporter & Donation Questions',
    subtitle: 'Your support keeps the story alive.',
    description:
      "Have questions about donation tiers, supporter rewards, Cash App transactions, or how your contribution is being used? We're grateful for every supporter and happy to assist.",
    emailLabel: 'Contact supporters team',
    email: 'supporters@wotwm.com',
    accentColor: 'oklch(0.65 0.22 15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    glowColor: 'rgba(239, 68, 68, 0.15)',
    badgeColor: 'oklch(0.7 0.22 15)',
    emoji: '❤️',
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const navigate = useNavigate();
  const { setRef, visible } = useStaggeredFadeIn(CONTACT_SECTIONS.length, 120);
  const { ref: heroRef, isVisible: heroVisible } = useScrollFadeIn({ threshold: 0.1 });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #07070f 0%, #0d0d1a 40%, #07070f 100%)' }}
    >
      <ScrollProgressBar />
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Banner ── */}
        <section
          ref={heroRef as React.RefObject<HTMLElement>}
          className="relative overflow-hidden"
        >
          {/* Contact banner image */}
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <img
              src="/assets/generated/contact-banner.dim_1400x400.png"
              alt="Contact the Studio"
              className="w-full h-full object-cover object-center"
            />
            {/* Dark overlay for readability */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(7,7,15,0.3) 0%, rgba(7,7,15,0.65) 60%, rgba(7,7,15,0.95) 100%)',
              }}
            />
            {/* Ambient glow orbs */}
            <div
              className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(79,195,247,0.08) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <div
              className="absolute top-1/3 right-1/4 w-56 h-56 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(180,160,255,0.07) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Hero text overlay */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 transition-all duration-700 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="flex justify-center mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: 'oklch(0.10 0.04 260 / 0.85)',
                    border: '1px solid rgba(79,195,247,0.4)',
                    boxShadow: '0 0 28px rgba(79,195,247,0.25)',
                  }}
                >
                  <Moon className="w-7 h-7" style={{ color: 'oklch(0.78 0.16 220)' }} />
                </div>
              </div>

              <h1
                className="font-cinzel text-3xl md:text-5xl font-bold mb-2 leading-tight tracking-wide text-center"
                style={{
                  color: 'oklch(0.96 0.03 260)',
                  textShadow: '0 0 40px rgba(79,195,247,0.35), 0 2px 8px rgba(0,0,0,0.8)',
                }}
              >
                Contact the Studio
              </h1>

              <p
                className="font-rajdhani text-base md:text-lg font-semibold tracking-wider text-center"
                style={{
                  color: 'oklch(0.78 0.12 60)',
                  textShadow: '0 0 20px rgba(251,191,36,0.3)',
                }}
              >
                Whispers Of The White Moon — Independent Original Anime Project
              </p>
            </div>
          </div>

          {/* Intro paragraph below banner */}
          <div
            className={`relative z-10 max-w-2xl mx-auto text-center px-6 pt-8 pb-12 transition-all duration-700 delay-200 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div
              className="mx-auto mb-6 h-px w-40"
              style={{
                background:
                  'linear-gradient(to right, transparent, oklch(0.75 0.15 60), transparent)',
              }}
            />
            <p
              className="font-rajdhani text-lg md:text-xl leading-relaxed"
              style={{ color: 'oklch(0.72 0.05 260)' }}
            >
              Have a question, a collaboration idea, or feedback for the team? We'd love to hear
              from you. Whether you're a fan, a fellow creator, or a potential partner — every
              message matters to us.{' '}
              <span className="font-semibold" style={{ color: 'oklch(0.82 0.12 60)' }}>
                Reach out and let's connect.
              </span>
            </p>
          </div>
        </section>

        {/* ── Primary Contact Form ── */}
        <PrimaryContactForm />

        {/* ── Contact Information Section ── */}
        <ContactInformationSection />

        {/* ── Contact Sections Grid ── */}
        <section className="px-4 pb-16 max-w-6xl mx-auto">
          <SectionHeading
            icon={<Mail className="w-5 h-5" />}
            title="Reach Our Team"
            subtitle="Choose the right channel for your message"
            glowColor="rgba(79,195,247,0.2)"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-8">
            {CONTACT_SECTIONS.map((section, i) => (
              <ContactCard
                key={section.title}
                section={section}
                index={i}
                setRef={setRef}
                visible={visible}
              />
            ))}
          </div>
        </section>

        {/* ── Supporter Help Section ── */}
        <SupporterHelpSection />

        {/* ── Fan Mail Section ── */}
        <FanMailSection />

        {/* ── Bottom CTA ── */}
        <BottomCTA onNavigateHome={() => navigate({ to: '/' })} />
      </main>

      <Footer />
    </div>
  );
}

// ── Section Heading Helper ────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  subtitle,
  glowColor,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  glowColor: string;
}) {
  return (
    <div className="text-center mb-2">
      <div className="flex justify-center mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: glowColor,
            border: `1px solid ${glowColor.replace('0.2', '0.5')}`,
            boxShadow: `0 0 20px ${glowColor}`,
            color: 'oklch(0.85 0.1 220)',
          }}
        >
          {icon}
        </div>
      </div>
      <h2
        className="font-cinzel text-2xl md:text-3xl font-bold mb-2"
        style={{
          color: 'oklch(0.92 0.04 260)',
          textShadow: `0 0 20px ${glowColor}`,
        }}
      >
        {title}
      </h2>
      <p className="font-rajdhani text-base" style={{ color: 'oklch(0.65 0.05 260)' }}>
        {subtitle}
      </p>
      <div
        className="mx-auto mt-4 h-px w-32"
        style={{
          background: `linear-gradient(to right, transparent, ${glowColor.replace('0.2', '0.6')}, transparent)`,
        }}
      />
    </div>
  );
}

// ── Primary Contact Form ──────────────────────────────────────────────────────

function PrimaryContactForm() {
  const { ref, isVisible } = useScrollFadeIn({ threshold: 0.1 });
  const submitContact = useSubmitContactMessage();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await submitContact.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      // error handled via submitContact.isError
    }
  };

  const inputStyle = {
    background: 'oklch(0.10 0.03 260 / 0.8)',
    border: '1px solid rgba(79,195,247,0.25)',
    color: 'oklch(0.90 0.03 260)',
    borderRadius: '10px',
    padding: '12px 16px',
    width: '100%',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as React.CSSProperties;

  const inputFocusStyle = {
    borderColor: 'rgba(79,195,247,0.6)',
    boxShadow: '0 0 16px rgba(79,195,247,0.18)',
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`px-4 pb-16 max-w-3xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <SectionHeading
        icon={<Send className="w-5 h-5" />}
        title="Send Us a Message"
        subtitle="Questions, collaboration ideas, or feedback — we read everything"
        glowColor="rgba(79,195,247,0.2)"
      />

      <div
        className="mt-8 rounded-2xl overflow-hidden"
        style={{
          background: 'oklch(0.11 0.03 260 / 0.92)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(79,195,247,0.2)',
          boxShadow: '0 0 40px rgba(79,195,247,0.07), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(79,195,247,0.7), rgba(180,160,255,0.5), transparent)',
          }}
        />

        <div className="p-6 md:p-10">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(79,195,247,0.12)',
                  border: '1px solid rgba(79,195,247,0.4)',
                  boxShadow: '0 0 24px rgba(79,195,247,0.2)',
                }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'oklch(0.72 0.14 220)' }} />
              </div>
              <h3
                className="font-cinzel text-xl font-bold"
                style={{ color: 'oklch(0.92 0.04 260)' }}
              >
                Message Sent!
              </h3>
              <p className="font-rajdhani text-base" style={{ color: 'oklch(0.72 0.05 260)' }}>
                Thank you! Your message has been sent. We'll get back to you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-rajdhani text-sm font-semibold mt-2 transition-colors duration-200"
                style={{ color: 'oklch(0.72 0.14 220)' }}
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 260)' }}
                >
                  Name <span style={{ color: 'oklch(0.65 0.18 15)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(79,195,247,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.name && (
                  <p className="font-rajdhani text-xs mt-1 flex items-center gap-1" style={{ color: 'oklch(0.65 0.2 15)' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 260)' }}
                >
                  Email <span style={{ color: 'oklch(0.65 0.18 15)' }}>*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(79,195,247,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.email && (
                  <p className="font-rajdhani text-xs mt-1 flex items-center gap-1" style={{ color: 'oklch(0.65 0.2 15)' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Subject (optional) */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 260)' }}
                >
                  Subject{' '}
                  <span className="normal-case font-normal" style={{ color: 'oklch(0.50 0.05 260)' }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  placeholder="What's this about?"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(79,195,247,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 260)' }}
                >
                  Message <span style={{ color: 'oklch(0.65 0.18 15)' }}>*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Write your message here..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(79,195,247,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.message && (
                  <p className="font-rajdhani text-xs mt-1 flex items-center gap-1" style={{ color: 'oklch(0.65 0.2 15)' }}>
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Error feedback */}
              {submitContact.isError && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.65 0.2 15)' }} />
                  <p className="font-rajdhani text-sm" style={{ color: 'oklch(0.72 0.15 15)' }}>
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitContact.isPending}
                className="w-full flex items-center justify-center gap-2 font-cinzel font-bold text-base py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: submitContact.isPending
                    ? 'rgba(79,195,247,0.15)'
                    : 'linear-gradient(135deg, rgba(79,195,247,0.2) 0%, rgba(120,100,255,0.2) 100%)',
                  border: '1px solid rgba(79,195,247,0.45)',
                  color: 'oklch(0.88 0.12 220)',
                  boxShadow: submitContact.isPending ? 'none' : '0 0 20px rgba(79,195,247,0.15)',
                }}
                onMouseEnter={(e) => {
                  if (!submitContact.isPending) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 30px rgba(79,195,247,0.3)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(79,195,247,0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 0 20px rgba(79,195,247,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(79,195,247,0.45)';
                }}
              >
                {submitContact.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              {/* Response time note */}
              <p
                className="font-rajdhani text-sm text-center leading-relaxed"
                style={{ color: 'oklch(0.52 0.05 260)' }}
              >
                Replies may take 24–72 hours. We read every message and appreciate your patience.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Contact Information Section ───────────────────────────────────────────────

function ContactInformationSection() {
  const { ref, isVisible } = useScrollFadeIn({ threshold: 0.1 });

  const socialLinks = [
    {
      icon: SiX,
      label: 'Twitter / X',
      handle: '@WOTWMofficial',
      href: 'https://x.com/WOTWMofficial',
      color: 'oklch(0.85 0.02 260)',
      glow: 'rgba(200,200,220,0.15)',
      border: 'rgba(200,200,220,0.3)',
    },
    {
      icon: SiDiscord,
      label: 'Discord',
      handle: 'discord.gg/wotwm',
      href: 'https://discord.gg/wotwm',
      color: 'oklch(0.72 0.18 270)',
      glow: 'rgba(88,101,242,0.2)',
      border: 'rgba(88,101,242,0.4)',
    },
    {
      icon: SiInstagram,
      label: 'Instagram',
      handle: '@wotwm.official',
      href: 'https://instagram.com/wotwm.official',
      color: 'oklch(0.72 0.22 15)',
      glow: 'rgba(225,48,108,0.18)',
      border: 'rgba(225,48,108,0.35)',
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`px-4 pb-16 max-w-6xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <SectionHeading
        icon={<Star className="w-5 h-5" />}
        title="Contact Information"
        subtitle="Official channels for the Whispers Of The White Moon creator team"
        glowColor="rgba(251,191,36,0.2)"
      />

      <div
        className="mt-8 rounded-2xl overflow-hidden"
        style={{
          background: 'oklch(0.11 0.03 260 / 0.9)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(251,191,36,0.25)',
          boxShadow: '0 0 40px rgba(251,191,36,0.08), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(251,191,36,0.6), rgba(79,195,247,0.4), transparent)',
          }}
        />

        <div className="p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Creator Info */}
            <div className="space-y-6">
              <div>
                <p
                  className="font-rajdhani text-xs font-semibold tracking-widest uppercase mb-1"
                  style={{ color: 'oklch(0.65 0.12 60)' }}
                >
                  Creator & Director
                </p>
                <h3
                  className="font-cinzel text-xl md:text-2xl font-bold"
                  style={{
                    color: 'oklch(0.92 0.04 260)',
                    textShadow: '0 0 16px rgba(251,191,36,0.2)',
                  }}
                >
                  Whispers Of The White Moon
                </h3>
                <p
                  className="font-rajdhani text-sm mt-1"
                  style={{ color: 'oklch(0.6 0.05 260)' }}
                >
                  Original Anime Project — Independent Studio
                </p>
              </div>

              {/* Email */}
              <div
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{
                  background: 'rgba(79,195,247,0.06)',
                  border: '1px solid rgba(79,195,247,0.2)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(79,195,247,0.12)',
                    border: '1px solid rgba(79,195,247,0.3)',
                  }}
                >
                  <Mail className="w-5 h-5" style={{ color: 'oklch(0.72 0.14 220)' }} />
                </div>
                <div>
                  <p
                    className="font-rajdhani text-xs font-semibold tracking-wider uppercase mb-0.5"
                    style={{ color: 'oklch(0.55 0.05 260)' }}
                  >
                    General Email
                  </p>
                  <a
                    href="mailto:hello@wotwm.com"
                    className="font-rajdhani text-base font-semibold transition-colors duration-200"
                    style={{ color: 'oklch(0.72 0.14 220)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.85 0.18 220)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'oklch(0.72 0.14 220)';
                    }}
                  >
                    hello@wotwm.com
                  </a>
                </div>
              </div>

              {/* Response time note */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.2)',
                }}
              >
                <div className="text-xl select-none mt-0.5">⏳</div>
                <div>
                  <p
                    className="font-cinzel text-sm font-bold mb-1"
                    style={{ color: 'oklch(0.82 0.15 60)' }}
                  >
                    Response Time
                  </p>
                  <p
                    className="font-rajdhani text-sm leading-relaxed"
                    style={{ color: 'oklch(0.72 0.05 260)' }}
                  >
                    Replies may take{' '}
                    <span className="font-bold" style={{ color: 'oklch(0.85 0.18 60)' }}>
                      24–72 hours
                    </span>
                    . We read every message and appreciate your patience.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <p
                className="font-cinzel text-sm font-bold tracking-wider uppercase"
                style={{ color: 'oklch(0.65 0.08 260)' }}
              >
                Follow the Journey
              </p>
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const IconComp = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group"
                      style={{
                        background: social.glow,
                        border: `1px solid ${social.border}`,
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.transform = 'translateX(4px)';
                        el.style.boxShadow = `0 0 20px ${social.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLAnchorElement;
                        el.style.transform = 'translateX(0)';
                        el.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: social.glow,
                          border: `1px solid ${social.border}`,
                        }}
                      >
                        <IconComp className="w-4 h-4" style={{ color: social.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-rajdhani text-xs font-semibold tracking-wider uppercase"
                          style={{ color: 'oklch(0.55 0.05 260)' }}
                        >
                          {social.label}
                        </p>
                        <p
                          className="font-rajdhani text-sm font-semibold truncate"
                          style={{ color: social.color }}
                        >
                          {social.handle}
                        </p>
                      </div>
                      <span
                        className="font-rajdhani text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: 'oklch(0.55 0.05 260)' }}
                      >
                        Visit →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Card ──────────────────────────────────────────────────────────────

function ContactCard({
  section,
  index,
  setRef,
  visible,
}: {
  section: ContactSection;
  index: number;
  setRef: (index: number) => (el: HTMLElement | null) => void;
  visible: boolean[];
}) {
  const IconComp = section.icon;

  return (
    <div
      ref={setRef(index) as React.RefCallback<HTMLDivElement>}
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        opacity: visible[index] ? 1 : 0,
        transform: visible[index] ? 'translateY(0)' : 'translateY(24px)',
        background: 'oklch(0.11 0.03 260 / 0.85)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${section.borderColor}`,
        boxShadow: `0 0 30px ${section.glowColor}, 0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${section.borderColor}, transparent)`,
        }}
      />

      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: section.glowColor,
              border: `1px solid ${section.borderColor}`,
              boxShadow: `0 0 16px ${section.glowColor}`,
            }}
          >
            <IconComp className="w-6 h-6" style={{ color: section.accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg select-none">{section.emoji}</span>
              <h3
                className="font-cinzel text-base md:text-lg font-bold leading-tight"
                style={{ color: 'oklch(0.92 0.04 260)' }}
              >
                {section.title}
              </h3>
            </div>
            <p
              className="font-rajdhani text-sm font-semibold"
              style={{ color: section.badgeColor }}
            >
              {section.subtitle}
            </p>
          </div>
        </div>

        <p
          className="font-rajdhani text-sm leading-relaxed mb-5"
          style={{ color: 'oklch(0.65 0.04 260)' }}
        >
          {section.description}
        </p>

        <a
          href={`mailto:${section.email}`}
          className="inline-flex items-center gap-2 font-rajdhani text-sm font-bold tracking-wider uppercase py-2.5 px-5 rounded-lg transition-all duration-200"
          style={{
            background: section.glowColor,
            border: `1px solid ${section.borderColor}`,
            color: section.accentColor,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.boxShadow = `0 0 20px ${section.glowColor}`;
            el.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.boxShadow = 'none';
            el.style.transform = 'translateY(0)';
          }}
        >
          <Mail className="w-4 h-4" />
          {section.emailLabel}
        </a>
      </div>
    </div>
  );
}

// ── Supporter Help Section ────────────────────────────────────────────────────

function SupporterHelpSection() {
  const { ref, isVisible } = useScrollFadeIn({ threshold: 0.1 });

  const items = [
    {
      icon: User,
      label: 'Username',
      detail: 'Your supporter username or display name',
    },
    {
      icon: Gift,
      label: 'Donation or Supporter Tier',
      detail: 'The tier you donated at (e.g., Moon Tier, Star Tier)',
    },
    {
      icon: MessageSquare,
      label: 'Reward Questions or Requests',
      detail: 'Any specific reward questions, missing perks, or special requests',
    },
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`px-4 pb-16 max-w-4xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="flex-1 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.35))',
          }}
        />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(251,191,36,0.1)',
            border: '1px solid rgba(251,191,36,0.35)',
          }}
        >
          <Shield className="w-4 h-4" style={{ color: 'oklch(0.82 0.18 60)' }} />
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background: 'linear-gradient(to left, transparent, rgba(251,191,36,0.35))',
          }}
        />
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'oklch(0.11 0.04 60 / 0.5)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(251,191,36,0.28)',
          boxShadow: '0 0 40px rgba(251,191,36,0.08), 0 8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(251,191,36,0.7), rgba(251,191,36,0.3), transparent)',
          }}
        />

        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.35)',
                boxShadow: '0 0 16px rgba(251,191,36,0.15)',
              }}
            >
              <Shield className="w-6 h-6" style={{ color: 'oklch(0.82 0.18 60)' }} />
            </div>
            <div>
              <h2
                className="font-cinzel text-xl md:text-2xl font-bold"
                style={{
                  color: 'oklch(0.92 0.04 260)',
                  textShadow: '0 0 20px rgba(251,191,36,0.2)',
                }}
              >
                Supporter Help
              </h2>
              <p
                className="font-rajdhani text-sm font-semibold"
                style={{ color: 'oklch(0.72 0.14 60)' }}
              >
                For donors & tier supporters
              </p>
            </div>
          </div>

          <p
            className="font-rajdhani text-base leading-relaxed mb-8"
            style={{ color: 'oklch(0.70 0.05 260)' }}
          >
            Are you a supporter with questions about your rewards, donation tier, or perks? We're
            here to help! To ensure we can assist you as quickly as possible, please include the
            following information when sending your message:
          </p>

          {/* Items list */}
          <div className="space-y-4">
            {items.map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{
                    background: 'rgba(251,191,36,0.05)',
                    border: '1px solid rgba(251,191,36,0.18)',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(251,191,36,0.1)',
                      border: '1px solid rgba(251,191,36,0.3)',
                    }}
                  >
                    <IconComp className="w-4 h-4" style={{ color: 'oklch(0.82 0.18 60)' }} />
                  </div>
                  <div>
                    <p
                      className="font-cinzel text-sm font-bold mb-0.5"
                      style={{ color: 'oklch(0.88 0.10 60)' }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="font-rajdhani text-sm"
                      style={{ color: 'oklch(0.62 0.05 260)' }}
                    >
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-8 p-4 rounded-xl flex items-start gap-3"
            style={{
              background: 'rgba(251,191,36,0.06)',
              border: '1px solid rgba(251,191,36,0.2)',
            }}
          >
            <span className="text-lg select-none mt-0.5">💛</span>
            <p
              className="font-rajdhani text-sm leading-relaxed"
              style={{ color: 'oklch(0.70 0.05 260)' }}
            >
              Your support means the world to us. Every contribution helps bring{' '}
              <span className="font-semibold" style={{ color: 'oklch(0.82 0.14 60)' }}>
                Whispers Of The White Moon
              </span>{' '}
              to life. Thank you for believing in this project.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Fan Mail Section ──────────────────────────────────────────────────────────

function FanMailSection() {
  const { ref, isVisible } = useScrollFadeIn({ threshold: 0.1 });
  const submitFanMail = useSubmitFanMail();

  const [form, setForm] = useState({ username: '', message: '', emailOrSocial: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.username.trim()) newErrors.username = 'Username or name is required.';
    if (!form.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await submitFanMail.mutateAsync({
        username: form.username.trim(),
        message: form.message.trim(),
        emailOrSocial: form.emailOrSocial.trim() || null,
      });
      setSubmitted(true);
      setForm({ username: '', message: '', emailOrSocial: '' });
    } catch {
      // error handled via submitFanMail.isError
    }
  };

  const inputStyle = {
    background: 'oklch(0.10 0.04 300 / 0.7)',
    border: '1px solid rgba(180,140,255,0.25)',
    color: 'oklch(0.90 0.03 260)',
    borderRadius: '10px',
    padding: '12px 16px',
    width: '100%',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as React.CSSProperties;

  const inputFocusStyle = {
    borderColor: 'rgba(180,140,255,0.6)',
    boxShadow: '0 0 16px rgba(180,140,255,0.18)',
  };

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`px-4 pb-20 max-w-3xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="flex-1 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(180,140,255,0.35))',
          }}
        />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(180,140,255,0.1)',
            border: '1px solid rgba(180,140,255,0.35)',
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: 'oklch(0.78 0.18 290)' }} />
        </div>
        <div
          className="flex-1 h-px"
          style={{
            background: 'linear-gradient(to left, transparent, rgba(180,140,255,0.35))',
          }}
        />
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.11 0.04 290 / 0.85) 0%, oklch(0.12 0.03 260 / 0.85) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(180,140,255,0.28)',
          boxShadow:
            '0 0 50px rgba(180,140,255,0.08), 0 0 20px rgba(79,195,247,0.05), 0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(180,140,255,0.7), rgba(79,195,247,0.4), transparent)',
          }}
        />

        <div className="p-6 md:p-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(180,140,255,0.12)',
                border: '1px solid rgba(180,140,255,0.35)',
                boxShadow: '0 0 16px rgba(180,140,255,0.15)',
              }}
            >
              <Sparkles className="w-6 h-6" style={{ color: 'oklch(0.78 0.18 290)' }} />
            </div>
            <div>
              <h2
                className="font-cinzel text-xl md:text-2xl font-bold"
                style={{
                  color: 'oklch(0.92 0.04 260)',
                  textShadow: '0 0 20px rgba(180,140,255,0.25)',
                }}
              >
                Fan Mail
              </h2>
              <p
                className="font-rajdhani text-sm font-semibold"
                style={{ color: 'oklch(0.72 0.14 290)' }}
              >
                Share your love with the creator team ✨
              </p>
            </div>
          </div>

          {/* Intro */}
          <div
            className="my-6 p-5 rounded-xl"
            style={{
              background:
                'linear-gradient(135deg, rgba(180,140,255,0.07) 0%, rgba(79,195,247,0.05) 100%)',
              border: '1px solid rgba(180,140,255,0.18)',
            }}
          >
            <p
              className="font-rajdhani text-base leading-relaxed"
              style={{ color: 'oklch(0.72 0.05 260)' }}
            >
              🌙 We love hearing from our community! Whether it's a kind word, a piece of fan art
              idea, or a creative thought — your messages inspire us to keep creating.{' '}
              <span className="font-semibold" style={{ color: 'oklch(0.82 0.12 290)' }}>
                Please keep messages positive, respectful, and kind.
              </span>{' '}
              This is a safe and welcoming space for all fans of Whispers Of The White Moon.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(180,140,255,0.12)',
                  border: '1px solid rgba(180,140,255,0.4)',
                  boxShadow: '0 0 24px rgba(180,140,255,0.2)',
                }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: 'oklch(0.78 0.18 290)' }} />
              </div>
              <h3
                className="font-cinzel text-xl font-bold"
                style={{ color: 'oklch(0.92 0.04 260)' }}
              >
                Fan Mail Sent! 🌙
              </h3>
              <p className="font-rajdhani text-base" style={{ color: 'oklch(0.72 0.05 260)' }}>
                Thank you for your message! The team will cherish it.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-rajdhani text-sm font-semibold mt-2 transition-colors duration-200"
                style={{ color: 'oklch(0.78 0.18 290)' }}
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Username */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 290)' }}
                >
                  Username or Name <span style={{ color: 'oklch(0.65 0.18 15)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="Your name or username"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(180,140,255,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.username && (
                  <p
                    className="font-rajdhani text-xs mt-1 flex items-center gap-1"
                    style={{ color: 'oklch(0.65 0.2 15)' }}
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.username}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 290)' }}
                >
                  Your Message <span style={{ color: 'oklch(0.65 0.18 15)' }}>*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Share your appreciation, creative ideas, or a kind message for the team..."
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(180,140,255,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                {errors.message && (
                  <p
                    className="font-rajdhani text-xs mt-1 flex items-center gap-1"
                    style={{ color: 'oklch(0.65 0.2 15)' }}
                  >
                    <AlertCircle className="w-3 h-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Optional Email or Social */}
              <div>
                <label
                  className="block font-rajdhani text-sm font-semibold tracking-wider uppercase mb-2"
                  style={{ color: 'oklch(0.65 0.08 290)' }}
                >
                  Email or Social Media{' '}
                  <span className="normal-case font-normal" style={{ color: 'oklch(0.50 0.05 260)' }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.emailOrSocial}
                  onChange={(e) => setForm((f) => ({ ...f, emailOrSocial: e.target.value }))}
                  placeholder="your@email.com or @yoursocial"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.currentTarget.style, inputFocusStyle)}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(180,140,255,0.25)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Highlight note */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(180,140,255,0.06)',
                  border: '1px solid rgba(180,140,255,0.2)',
                }}
              >
                <span className="text-base select-none mt-0.5">✨</span>
                <p
                  className="font-rajdhani text-sm leading-relaxed"
                  style={{ color: 'oklch(0.65 0.05 260)' }}
                >
                  Respectful and positive messages may be highlighted or shared with the team.
                </p>
              </div>

              {/* Error feedback */}
              {submitFanMail.isError && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color: 'oklch(0.65 0.2 15)' }} />
                  <p className="font-rajdhani text-sm" style={{ color: 'oklch(0.72 0.15 15)' }}>
                    Something went wrong. Please try again.
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitFanMail.isPending}
                className="w-full flex items-center justify-center gap-2 font-cinzel font-bold text-base py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: submitFanMail.isPending
                    ? 'rgba(180,140,255,0.1)'
                    : 'linear-gradient(135deg, rgba(180,140,255,0.18) 0%, rgba(79,195,247,0.12) 100%)',
                  border: '1px solid rgba(180,140,255,0.45)',
                  color: 'oklch(0.82 0.16 290)',
                  boxShadow: submitFanMail.isPending ? 'none' : '0 0 20px rgba(180,140,255,0.12)',
                }}
                onMouseEnter={(e) => {
                  if (!submitFanMail.isPending) {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 0 30px rgba(180,140,255,0.25)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      'rgba(180,140,255,0.7)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    '0 0 20px rgba(180,140,255,0.12)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(180,140,255,0.45)';
                }}
              >
                {submitFanMail.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    Send Fan Mail
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Bottom CTA ────────────────────────────────────────────────────────────────

function BottomCTA({ onNavigateHome }: { onNavigateHome: () => void }) {
  const { ref, isVisible } = useScrollFadeIn({ threshold: 0.1 });

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`px-4 pb-20 max-w-2xl mx-auto text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div
        className="h-px w-full mb-12"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(79,195,247,0.3), rgba(251,191,36,0.3), transparent)',
        }}
      />

      <div className="flex justify-center mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'oklch(0.12 0.04 260 / 0.8)',
            border: '1px solid rgba(79,195,247,0.3)',
            boxShadow: '0 0 24px rgba(79,195,247,0.15)',
          }}
        >
          <Moon className="w-7 h-7" style={{ color: 'oklch(0.72 0.14 220)' }} />
        </div>
      </div>

      <h2
        className="font-cinzel text-2xl md:text-3xl font-bold mb-4"
        style={{
          color: 'oklch(0.92 0.04 260)',
          textShadow: '0 0 20px rgba(79,195,247,0.2)',
        }}
      >
        The Story Continues
      </h2>

      <p
        className="font-rajdhani text-base md:text-lg leading-relaxed mb-8"
        style={{ color: 'oklch(0.65 0.05 260)' }}
      >
        Return to the world of{' '}
        <span className="font-semibold" style={{ color: 'oklch(0.82 0.12 60)' }}>
          Whispers Of The White Moon
        </span>{' '}
        and explore the lore, characters, and episodes.
      </p>

      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 font-cinzel font-bold text-sm py-3 px-8 rounded-xl transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, rgba(79,195,247,0.15) 0%, rgba(251,191,36,0.1) 100%)',
          border: '1px solid rgba(79,195,247,0.35)',
          color: 'oklch(0.82 0.12 220)',
          boxShadow: '0 0 20px rgba(79,195,247,0.1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = '0 0 30px rgba(79,195,247,0.25)';
          el.style.borderColor = 'rgba(79,195,247,0.6)';
          el.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLButtonElement;
          el.style.boxShadow = '0 0 20px rgba(79,195,247,0.1)';
          el.style.borderColor = 'rgba(79,195,247,0.35)';
          el.style.transform = 'translateY(0)';
        }}
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </button>
    </section>
  );
}
