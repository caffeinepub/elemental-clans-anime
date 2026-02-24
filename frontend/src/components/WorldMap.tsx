import { useState } from 'react';
import { Map } from 'lucide-react';
import { worldMapLocations, type WorldMapLocation } from '../data/worldMap';
import WorldMapLoreModal from './WorldMapLoreModal';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';

export default function WorldMap() {
  const [selectedLocation, setSelectedLocation] = useState<WorldMapLocation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { ref: sectionRef, isVisible } = useScrollFadeIn();

  const handleMarkerClick = (location: WorldMapLocation) => {
    setSelectedLocation(location);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <section
      id="world-map"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-20 overflow-hidden transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-deep-navy/80 to-void pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(79,195,247,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-moon-blue/60" />
            <Map className="w-5 h-5 text-moon-blue" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-moon-blue/60" />
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ textShadow: '0 0 30px rgba(79,195,247,0.4)' }}>
            World of the Five Realms
          </h2>
          <p className="font-rajdhani text-silver/70 text-lg max-w-xl mx-auto">
            Explore the territories of the elemental clans. Click any marker to uncover the lore of each realm.
          </p>
        </div>

        {/* Map container */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            boxShadow:
              '0 0 60px rgba(79,195,247,0.12), 0 0 120px rgba(79,195,247,0.06), 0 4px 40px rgba(0,0,0,0.6)',
            border: '1px solid rgba(79,195,247,0.2)',
          }}
        >
          {/* Map image */}
          <img
            src="/assets/generated/world-map.dim_1320x880.png"
            alt="World Map of the Five Realms"
            className="w-full h-auto block select-none"
            draggable={false}
          />

          {/* Hotspot markers overlay */}
          <div className="absolute inset-0">
            {worldMapLocations.map(location => (
              <button
                key={location.id}
                onClick={() => handleMarkerClick(location)}
                className="absolute group focus:outline-none"
                style={{
                  left: location.position.x,
                  top: location.position.y,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`View lore for ${location.name}`}
                title={location.name}
              >
                {/* Outer pulse ring */}
                <span
                  className="absolute inset-0 rounded-full animate-map-pulse"
                  style={{
                    background: `${location.glowColor}33`,
                    boxShadow: `0 0 0 0 ${location.glowColor}66`,
                    width: '32px',
                    height: '32px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                {/* Middle glow ring */}
                <span
                  className="absolute rounded-full"
                  style={{
                    width: '20px',
                    height: '20px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: `${location.glowColor}22`,
                    border: `1.5px solid ${location.glowColor}88`,
                    boxShadow: `0 0 10px ${location.glowColor}66`,
                  }}
                />
                {/* Core dot */}
                <span
                  className="relative block rounded-full transition-transform duration-200 group-hover:scale-125"
                  style={{
                    width: '10px',
                    height: '10px',
                    background: location.glowColor,
                    boxShadow: `0 0 8px 3px ${location.glowColor}cc, 0 0 16px 6px ${location.glowColor}55`,
                  }}
                />

                {/* Tooltip label */}
                <span
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded font-cinzel text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                  style={{
                    background: 'rgba(8,12,24,0.92)',
                    border: `1px solid ${location.glowColor}55`,
                    color: location.glowColor,
                    boxShadow: `0 0 12px ${location.glowColor}33`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {location.name}
                </span>
              </button>
            ))}
          </div>

          {/* Vignette overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 60%, rgba(4,8,20,0.35) 100%)',
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {worldMapLocations.map(location => (
            <button
              key={`legend-${location.id}`}
              onClick={() => handleMarkerClick(location)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full font-rajdhani text-xs font-semibold tracking-wide uppercase transition-all duration-200 hover:scale-105"
              style={{
                background: `${location.glowColor}12`,
                border: `1px solid ${location.glowColor}44`,
                color: location.glowColor,
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  background: location.glowColor,
                  boxShadow: `0 0 6px ${location.glowColor}`,
                }}
              />
              {location.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lore modal */}
      <WorldMapLoreModal
        location={selectedLocation}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
