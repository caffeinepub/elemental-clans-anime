import React, { useState } from 'react';
import { useScrollFadeIn } from '../hooks/useScrollFadeIn';
import { useStaggeredFadeIn } from '../hooks/useStaggeredFadeIn';
import { galleryImages as staticGalleryImages } from '../data/gallery';
import type { GalleryImage } from '../backend';
import { GalleryCategory } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetAllGalleryImages,
  getGalleryImageSrc,
  useIsCallerAdmin,
} from '../hooks/useQueries';
import { X, Plus, ImageIcon } from 'lucide-react';
import GalleryUploadModal from './GalleryUploadModal';

type FilterCategory = GalleryCategory | 'All';

const CATEGORIES: { label: string; value: FilterCategory }[] = [
  { label: 'All', value: 'All' },
  { label: 'Concept Art', value: GalleryCategory.ConceptArt },
  { label: 'Fight Scenes', value: GalleryCategory.FightScenes },
  { label: 'Character Designs', value: GalleryCategory.CharacterDesigns },
];

function categoryLabel(cat: GalleryCategory): string {
  switch (cat) {
    case GalleryCategory.ConceptArt:
      return 'Concept Art';
    case GalleryCategory.FightScenes:
      return 'Fight Scenes';
    case GalleryCategory.CharacterDesigns:
      return 'Character Designs';
  }
}

// Convert static gallery data to GalleryImage shape for display
function staticToGalleryImage(img: (typeof staticGalleryImages)[0]): GalleryImage {
  const catMap: Record<string, GalleryCategory> = {
    'Concept Art': GalleryCategory.ConceptArt,
    'Fight Scenes': GalleryCategory.FightScenes,
    'Character Designs': GalleryCategory.CharacterDesigns,
  };
  return {
    id: String(img.id),
    title: img.alt,
    altText: img.alt,
    category: catMap[img.category] ?? GalleryCategory.ConceptArt,
    path: img.src,
    thumbnail: img.src,
  };
}

export default function Gallery() {
  const { ref: sectionRef, isVisible } = useScrollFadeIn();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: isAdmin } = useIsCallerAdmin();

  const { data: backendImages } = useGetAllGalleryImages();

  // Merge static + backend images (backend takes precedence by id)
  const staticConverted = staticGalleryImages.map(staticToGalleryImage);
  const backendIds = new Set((backendImages ?? []).map((img) => img.id));
  const mergedImages: GalleryImage[] = [
    ...staticConverted.filter((img) => !backendIds.has(img.id)),
    ...(backendImages ?? []),
  ];

  const filtered =
    activeFilter === 'All'
      ? mergedImages
      : mergedImages.filter((img) => img.category === activeFilter);

  const { setRef, visible } = useStaggeredFadeIn(filtered.length, 80);

  // Only render the button in the DOM for authenticated admins
  const showAdminButton = isAuthenticated && isAdmin === true;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={`gallery-section py-24 px-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[oklch(0.7_0.18_55/0.5)]" />
          <div className="flex items-center gap-3">
            <h2 className="font-cinzel text-3xl md:text-4xl text-[oklch(0.85_0.18_55)] tracking-widest uppercase">
              Gallery
            </h2>
            {showAdminButton && (
              <button
                onClick={() => setShowUploadModal(true)}
                title="Upload new image"
                className="gallery-upload-btn w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '2px solid oklch(0.72 0.18 55)',
                  boxShadow: '0 0 10px oklch(0.72 0.18 55 / 0.4), 0 0 20px oklch(0.72 0.18 55 / 0.15)',
                  background: 'oklch(0.72 0.18 55 / 0.08)',
                }}
              >
                <Plus size={18} className="text-[oklch(0.75_0.15_200)]" />
              </button>
            )}
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[oklch(0.7_0.18_55/0.5)]" />
        </div>

        <p className="text-center text-[oklch(0.65_0.05_260)] font-rajdhani text-lg mb-10 tracking-wide">
          Visual chronicles of the elemental world
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-rajdhani tracking-wide transition-all border ${
                activeFilter === cat.value
                  ? 'bg-[oklch(0.7_0.18_55/0.2)] border-[oklch(0.7_0.18_55)] text-[oklch(0.85_0.18_55)] shadow-[0_0_10px_oklch(0.7_0.18_55/0.3)]'
                  : 'border-[oklch(0.3_0.03_260)] text-[oklch(0.55_0.05_260)] hover:border-[oklch(0.5_0.05_260)] hover:text-[oklch(0.75_0.05_260)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((img, i) => {
            const src = getGalleryImageSrc(img);
            return (
              <div
                key={img.id}
                ref={setRef(i) as (el: HTMLDivElement | null) => void}
                onClick={() => setLightboxImage(img)}
                className={`relative group cursor-pointer rounded-xl overflow-hidden border border-[oklch(0.25_0.03_260)] hover:border-[oklch(0.7_0.18_55/0.5)] transition-all duration-500 ${
                  visible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="aspect-video bg-[oklch(0.1_0.02_260)]">
                  {src ? (
                    <img
                      src={src}
                      alt={img.altText}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[oklch(0.4_0.03_260)]">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-sm font-cinzel text-[oklch(0.9_0.05_260)] truncate">
                    {img.title}
                  </p>
                  <span className="text-xs text-[oklch(0.7_0.18_55)] font-rajdhani">
                    {categoryLabel(img.category)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-[oklch(0.5_0.05_260)] font-rajdhani">
            No images in this category yet.
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-[oklch(0.7_0.05_260)] hover:text-white transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X size={28} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={getGalleryImageSrc(lightboxImage)}
              alt={lightboxImage.altText}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="mt-3 text-center">
              <p className="font-cinzel text-[oklch(0.85_0.18_55)] text-lg">
                {lightboxImage.title}
              </p>
              <p className="text-sm text-[oklch(0.6_0.05_260)] font-rajdhani">
                {categoryLabel(lightboxImage.category)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal — only mounted when open */}
      <GalleryUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </section>
  );
}
