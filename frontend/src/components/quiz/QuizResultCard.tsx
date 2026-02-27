import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { clanResultData } from '../../data/clanDescriptions';
import type { ClanId } from '../../data/quizQuestions';

interface QuizResultCardProps {
  clanId: ClanId;
  isBalanceUnlock: boolean;
  onRetake: () => void;
}

export default function QuizResultCard({ clanId, isBalanceUnlock, onRetake }: QuizResultCardProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const clan = clanResultData[clanId];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleCopy = async () => {
    const text = `I took the Whispers of the White Moon Clan Quiz!\n\nResult: ${clan.name}\n"${clan.description}"\n\n${clan.tagline}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const isBalance = clanId === 'balance' || isBalanceUnlock;

  return (
    <div
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
        transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        style={{
          background: isBalance
            ? 'linear-gradient(135deg, rgba(224,64,251,0.4), rgba(245,200,66,0.4), rgba(0,191,255,0.4), rgba(255,69,0,0.3))'
            : `rgba(${clan.glowColorRgb}, 0.3)`,
          filter: 'blur(12px)',
          animation: isBalance ? 'balance-card-glow 3s ease-in-out infinite' : 'clan-card-glow 2.5s ease-in-out infinite',
        }}
      />

      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: isBalance
            ? 'linear-gradient(135deg, rgba(20,8,35,0.98) 0%, rgba(15,5,25,0.98) 50%, rgba(20,8,35,0.98) 100%)'
            : `linear-gradient(135deg, rgba(${clan.glowColorRgb},0.08) 0%, rgba(10,10,25,0.98) 50%, rgba(${clan.glowColorRgb},0.05) 100%)`,
          border: isBalance
            ? '1px solid rgba(224,64,251,0.4)'
            : `1px solid rgba(${clan.glowColorRgb}, 0.35)`,
          boxShadow: isBalance
            ? '0 0 40px rgba(224,64,251,0.3), 0 0 80px rgba(245,200,66,0.15), 0 20px 60px rgba(0,0,0,0.7)'
            : `0 0 30px rgba(${clan.glowColorRgb},0.25), 0 20px 60px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Top shimmer bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: isBalance
              ? 'linear-gradient(90deg, transparent, rgba(224,64,251,0.9), rgba(245,200,66,0.9), rgba(0,191,255,0.9), transparent)'
              : `linear-gradient(90deg, transparent, rgba(${clan.glowColorRgb},0.9), transparent)`,
          }}
        />

        {/* Rainbow shimmer overlay for Balance */}
        {isBalance && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(224,64,251,0.04) 0%, rgba(245,200,66,0.04) 33%, rgba(0,191,255,0.04) 66%, rgba(255,69,0,0.04) 100%)',
              animation: 'balance-shimmer-overlay 4s ease-in-out infinite',
            }}
          />
        )}

        <div className="p-8 sm:p-10">
          {/* Rare badge */}
          {isBalance && (
            <div className="flex justify-center mb-4">
              <span
                className="font-rajdhani text-xs tracking-[0.4em] uppercase px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(224,64,251,0.15)',
                  border: '1px solid rgba(224,64,251,0.4)',
                  color: 'rgba(224,64,251,0.9)',
                }}
              >
                ✨ SECRET RARE RESULT
              </span>
            </div>
          )}

          {/* Clan emblem */}
          <div className="flex justify-center mb-6">
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center"
              style={{
                background: isBalance
                  ? 'radial-gradient(circle, rgba(224,64,251,0.2) 0%, rgba(10,5,20,0.9) 70%)'
                  : `radial-gradient(circle, rgba(${clan.glowColorRgb},0.2) 0%, rgba(10,10,25,0.9) 70%)`,
                border: isBalance
                  ? '2px solid rgba(224,64,251,0.5)'
                  : `2px solid rgba(${clan.glowColorRgb},0.5)`,
                boxShadow: isBalance
                  ? '0 0 30px rgba(224,64,251,0.4), 0 0 60px rgba(245,200,66,0.2)'
                  : `0 0 25px rgba(${clan.glowColorRgb},0.4)`,
                animation: isBalance ? 'balance-emblem-pulse 2.5s ease-in-out infinite' : 'clan-emblem-pulse 3s ease-in-out infinite',
              }}
            >
              <img
                src={clan.iconPath}
                alt={`${clan.name} emblem`}
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                style={{
                  filter: isBalance
                    ? 'drop-shadow(0 0 12px rgba(224,64,251,0.7)) drop-shadow(0 0 24px rgba(245,200,66,0.4))'
                    : `drop-shadow(0 0 10px rgba(${clan.glowColorRgb},0.7))`,
                }}
              />
            </div>
          </div>

          {/* "You belong to" message */}
          <div className="text-center mb-2">
            <p
              className="font-rajdhani text-sm tracking-[0.3em] uppercase mb-1"
              style={{ color: isBalance ? 'rgba(224,64,251,0.7)' : `rgba(${clan.glowColorRgb},0.7)` }}
            >
              You belong to the
            </p>
            <h2
              className="font-cinzel text-3xl sm:text-4xl font-black tracking-wider"
              style={
                isBalance
                  ? {
                      background: 'linear-gradient(135deg, #e040fb 0%, #f5c842 40%, #00bfff 70%, #e040fb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      backgroundSize: '200% auto',
                      animation: 'balance-shimmer-text 3s linear infinite',
                      filter: 'drop-shadow(0 0 20px rgba(224,64,251,0.5))',
                    }
                  : {
                      color: clan.glowColor,
                      textShadow: `0 0 20px rgba(${clan.glowColorRgb},0.6), 0 0 40px rgba(${clan.glowColorRgb},0.3)`,
                    }
              }
            >
              {clan.name}
            </h2>
          </div>

          {/* Symbol */}
          <div className="flex justify-center my-4">
            <span
              className="text-4xl"
              style={{
                filter: isBalance
                  ? 'drop-shadow(0 0 12px rgba(224,64,251,0.8))'
                  : `drop-shadow(0 0 10px rgba(${clan.glowColorRgb},0.8))`,
              }}
            >
              {clan.symbol}
            </span>
          </div>

          {/* Tagline */}
          <p
            className="font-rajdhani text-xs tracking-[0.35em] uppercase text-center mb-5"
            style={{ color: isBalance ? 'rgba(224,64,251,0.6)' : `rgba(${clan.glowColorRgb},0.6)` }}
          >
            {clan.tagline}
          </p>

          {/* Divider */}
          <div
            className="h-px w-3/4 mx-auto mb-5"
            style={{
              background: isBalance
                ? 'linear-gradient(90deg, transparent, rgba(224,64,251,0.5), rgba(245,200,66,0.5), transparent)'
                : `linear-gradient(90deg, transparent, rgba(${clan.glowColorRgb},0.5), transparent)`,
            }}
          />

          {/* Personality description */}
          <p
            className="font-rajdhani text-base sm:text-lg text-center leading-relaxed text-white/80 mb-8 max-w-md mx-auto"
          >
            {clan.description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-rajdhani font-semibold text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                background: copied
                  ? 'rgba(76,175,80,0.2)'
                  : isBalance
                  ? 'rgba(224,64,251,0.15)'
                  : `rgba(${clan.glowColorRgb},0.15)`,
                border: copied
                  ? '1px solid rgba(76,175,80,0.5)'
                  : isBalance
                  ? '1px solid rgba(224,64,251,0.4)'
                  : `1px solid rgba(${clan.glowColorRgb},0.4)`,
                color: copied ? '#4caf50' : isBalance ? '#e040fb' : clan.glowColor,
                boxShadow: copied
                  ? '0 0 15px rgba(76,175,80,0.3)'
                  : isBalance
                  ? '0 0 15px rgba(224,64,251,0.2)'
                  : `0 0 15px rgba(${clan.glowColorRgb},0.2)`,
              }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Result'}
            </button>

            <button
              onClick={onRetake}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-rajdhani font-semibold text-sm tracking-widest uppercase transition-all duration-300 text-white/60 hover:text-white/90"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>
        </div>

        {/* Bottom shimmer bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: isBalance
              ? 'linear-gradient(90deg, transparent, rgba(0,191,255,0.9), rgba(245,200,66,0.9), rgba(224,64,251,0.9), transparent)'
              : `linear-gradient(90deg, transparent, rgba(${clan.glowColorRgb},0.9), transparent)`,
          }}
        />
      </div>

      <style>{`
        @keyframes balance-card-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes clan-card-glow {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 0.9; }
        }
        @keyframes balance-emblem-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(224,64,251,0.4), 0 0 60px rgba(245,200,66,0.2); }
          50%       { box-shadow: 0 0 50px rgba(224,64,251,0.7), 0 0 90px rgba(245,200,66,0.4); }
        }
        @keyframes clan-emblem-pulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 1; }
        }
        @keyframes balance-shimmer-overlay {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes balance-shimmer-text {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
