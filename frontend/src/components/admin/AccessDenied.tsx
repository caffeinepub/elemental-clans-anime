import { ShieldX, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-crimson/10 blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-dark-purple/40 blur-[80px]" />
      </div>

      <div
        className="relative z-10 max-w-md w-full text-center p-10 rounded-sm"
        style={{
          background: 'rgba(7, 7, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(220, 38, 38, 0.25)',
          boxShadow: '0 0 40px rgba(220, 38, 38, 0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.15)',
            }}
          >
            <ShieldX className="w-9 h-9 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-2xl font-bold text-white tracking-widest uppercase mb-3">
          Access Denied
        </h1>

        {/* Decorative line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-500/40" />
        </div>

        {/* Message */}
        <p className="font-rajdhani text-silver/60 text-sm leading-relaxed tracking-wider mb-2">
          Your principal does not have admin privileges.
        </p>
        <p className="font-rajdhani text-silver/40 text-xs leading-relaxed tracking-wider mb-8">
          This area is restricted to authorized administrators only.
        </p>

        {/* Back home button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-rajdhani text-sm font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm"
          style={{
            background: 'rgba(79, 195, 247, 0.08)',
            border: '1px solid rgba(79, 195, 247, 0.25)',
            color: 'rgba(79, 195, 247, 0.8)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(79, 195, 247, 0.15)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(79, 195, 247, 0.5)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(79, 195, 247, 1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(79, 195, 247, 0.08)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(79, 195, 247, 0.25)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(79, 195, 247, 0.8)';
          }}
        >
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    </div>
  );
}
