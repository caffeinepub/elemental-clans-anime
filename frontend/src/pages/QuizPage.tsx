import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft, Moon } from 'lucide-react';
import ClanPersonalityQuiz from '../components/quiz/ClanPersonalityQuiz';
import ScrollProgressBar from '../components/ScrollProgressBar';

export default function QuizPage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: 'linear-gradient(180deg, rgba(7,7,15,1) 0%, rgba(10,10,22,1) 50%, rgba(7,7,15,1) 100%)',
      }}
    >
      <ScrollProgressBar />

      {/* Ambient background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,200,240,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,200,66,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          background: 'rgba(7,7,15,0.85)',
          borderColor: 'rgba(168,200,240,0.1)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group transition-colors duration-300"
            style={{ color: 'rgba(168,200,240,0.6)' }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:text-white transition-colors" />
            <span className="font-rajdhani text-xs tracking-widest uppercase group-hover:text-white transition-colors">
              Back to Home
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-moon-blue" />
            <span className="font-cinzel text-xs font-bold tracking-widest text-white/70">
              WHISPERS OF THE WHITE MOON
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        <ClanPersonalityQuiz />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t mt-16 py-8 text-center"
        style={{ borderColor: 'rgba(168,200,240,0.08)' }}
      >
        <p className="font-rajdhani text-xs text-white/25 tracking-widest">
          © {new Date().getFullYear()} Whispers of the White Moon · Built with{' '}
          <span style={{ color: 'rgba(224,64,251,0.6)' }}>♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/50 transition-colors"
            style={{ color: 'rgba(168,200,240,0.4)' }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
