import React, { useEffect, useState } from 'react';

export default function BalanceUnlockAnimation() {
  const [phase, setPhase] = useState<'burst' | 'message' | 'done'>('burst');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('message'), 800);
    const t2 = setTimeout(() => setPhase('done'), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-8 overflow-hidden">
      {/* Radiant burst rings */}
      {phase === 'burst' && (
        <>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${80 + i * 60}px`,
                height: `${80 + i * 60}px`,
                border: '2px solid rgba(224,64,251,0.6)',
                animation: `balance-ring-burst 0.8s ease-out ${i * 0.12}s forwards`,
                opacity: 0,
              }}
            />
          ))}
          {/* Golden sparkles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`spark-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                background: i % 2 === 0 ? '#e040fb' : '#f5c842',
                animation: `balance-sparkle 0.9s ease-out ${i * 0.06}s forwards`,
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
                opacity: 0,
                boxShadow: i % 2 === 0
                  ? '0 0 8px rgba(224,64,251,0.9)'
                  : '0 0 8px rgba(245,200,66,0.9)',
              }}
            />
          ))}
        </>
      )}

      {/* Rare unlock message */}
      <div
        className="relative z-10 text-center px-6"
        style={{
          opacity: phase === 'burst' ? 0 : 1,
          transform: phase === 'burst' ? 'scale(0.8)' : 'scale(1)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <div
          className="font-rajdhani text-xs tracking-[0.4em] uppercase mb-2"
          style={{ color: 'rgba(224,64,251,0.8)' }}
        >
          ✨ SECRET RARE RESULT ✨
        </div>
        <h2
          className="font-cinzel text-2xl sm:text-3xl font-black mb-2"
          style={{
            background: 'linear-gradient(135deg, #e040fb 0%, #f5c842 40%, #e040fb 70%, #00bfff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% auto',
            animation: 'balance-shimmer-text 3s linear infinite',
            filter: 'drop-shadow(0 0 20px rgba(224,64,251,0.6))',
          }}
        >
          A RARE BALANCE AWAKENS WITHIN YOU…
        </h2>
        <p className="font-rajdhani text-sm text-white/60 tracking-widest">
          Only the rarest souls are chosen by the Balance Clan.
        </p>
      </div>

      <style>{`
        @keyframes balance-ring-burst {
          0%   { transform: scale(0.2); opacity: 0.9; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes balance-sparkle {
          0%   { opacity: 1; transform: rotate(var(--r, 0deg)) translateY(-20px) scale(1); }
          100% { opacity: 0; transform: rotate(var(--r, 0deg)) translateY(-80px) scale(0.3); }
        }
        @keyframes balance-shimmer-text {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
