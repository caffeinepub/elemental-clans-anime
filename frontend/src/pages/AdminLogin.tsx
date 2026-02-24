import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Shield, Moon } from 'lucide-react';

export default function AdminLogin() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Login error:', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,13,26,0.9)_0%,rgba(2,2,8,1)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,195,247,0.04)_0%,transparent_60%)]" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-moon-blue/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-lg border border-moon-blue/20 p-8 sm:p-10"
          style={{
            background: 'rgba(13, 13, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(79,195,247,0.1), 0 20px 60px rgba(0,0,0,0.8)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full border-2 border-moon-blue/40 flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'radial-gradient(circle, rgba(79,195,247,0.15) 0%, rgba(0,0,0,0.6) 100%)',
                boxShadow: '0 0 20px rgba(79,195,247,0.3)',
              }}
            >
              <Moon className="w-7 h-7 text-moon-blue" />
            </div>
            <h1 className="font-cinzel text-2xl font-bold text-white mb-1" style={{ textShadow: '0 0 20px rgba(79,195,247,0.4)' }}>
              Admin Portal
            </h1>
            <p className="font-rajdhani text-xs tracking-[0.3em] uppercase text-moon-blue/60">
              Whispers Of The White Moon
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-moon-blue/30 to-transparent mb-8" />

          {/* Description */}
          <div className="flex items-start gap-3 mb-8 p-4 rounded border border-gold/20 bg-gold/5">
            <Shield className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
            <p className="font-rajdhani text-sm text-silver/70 leading-relaxed">
              This area is restricted to authorized administrators only. Authenticate with your Internet Identity to access the content management dashboard.
            </p>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-6 rounded font-cinzel text-sm font-semibold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: isLoggingIn
                ? 'rgba(79,195,247,0.1)'
                : 'linear-gradient(135deg, rgba(79,195,247,0.2) 0%, rgba(79,195,247,0.1) 100%)',
              border: '1px solid rgba(79,195,247,0.4)',
              color: '#4fc3f7',
              boxShadow: isLoggingIn ? 'none' : '0 0 20px rgba(79,195,247,0.2)',
            }}
            onMouseEnter={e => {
              if (!isLoggingIn) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(79,195,247,0.5)';
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(79,195,247,0.3) 0%, rgba(79,195,247,0.15) 100%)';
              }
            }}
            onMouseLeave={e => {
              if (!isLoggingIn) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(79,195,247,0.2)';
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(79,195,247,0.2) 0%, rgba(79,195,247,0.1) 100%)';
              }
            }}
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-moon-blue border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Login with Internet Identity'
            )}
          </button>

          <p className="text-center font-rajdhani text-xs text-silver/30 mt-6">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </div>
    </div>
  );
}
