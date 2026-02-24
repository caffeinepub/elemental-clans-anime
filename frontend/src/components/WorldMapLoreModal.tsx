import { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin, Shield } from 'lucide-react';
import type { WorldMapLocation } from '../data/worldMap';

interface WorldMapLoreModalProps {
  location: WorldMapLocation | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorldMapLoreModal({ location, isOpen, onClose }: WorldMapLoreModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!location) return null;

  const isNeutral = location.clanAffiliation === 'Neutral';

  const modal = (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="lore-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`relative z-10 w-full max-w-lg mx-auto rounded-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        style={{
          background: 'rgba(8, 12, 24, 0.92)',
          border: `1px solid ${location.glowColor}55`,
          boxShadow: `0 0 40px ${location.glowColor}33, 0 0 80px ${location.glowColor}18, inset 0 1px 0 ${location.glowColor}22`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Top accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${location.glowColor}, transparent)`,
          }}
        />

        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2
              id="lore-modal-title"
              className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight"
              style={{ textShadow: `0 0 20px ${location.glowColor}88` }}
            >
              {location.name}
            </h2>
            {/* Clan badge */}
            <div className="mt-2 inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: location.glowColor }} />
              <span
                className="font-rajdhani text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                style={{
                  color: location.glowColor,
                  background: `${location.glowColor}18`,
                  border: `1px solid ${location.glowColor}44`,
                }}
              >
                {location.clanAffiliation}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-silver/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Divider */}
        <div
          className="mx-6 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${location.glowColor}44, transparent)` }}
        />

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Lore description */}
          <p className="font-rajdhani text-base text-silver/85 leading-relaxed">
            {location.loreDescription}
          </p>

          {/* Notable landmark callout */}
          <div
            className="flex items-start gap-3 rounded-xl p-4"
            style={{
              background: `${location.glowColor}0d`,
              border: `1px solid ${location.glowColor}33`,
            }}
          >
            <MapPin
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              style={{ color: location.glowColor }}
            />
            <div>
              <p
                className="font-cinzel text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: `${location.glowColor}cc` }}
              >
                Notable Landmark
              </p>
              <p className="font-rajdhani text-sm font-semibold text-white">
                {location.notableLandmark}
              </p>
            </div>
          </div>

          {/* Neutral territory note */}
          {isNeutral && (
            <p className="font-rajdhani text-xs text-silver/50 italic text-center">
              ✦ This territory belongs to no clan — it is sacred ground for all. ✦
            </p>
          )}
        </div>

        {/* Bottom accent bar */}
        <div
          className="h-px mx-6 mb-5"
          style={{
            background: `linear-gradient(90deg, transparent, ${location.glowColor}33, transparent)`,
          }}
        />
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
}
