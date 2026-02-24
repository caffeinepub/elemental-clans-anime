export type GalleryCategory = 'Concept Art' | 'Fight Scenes' | 'Character Designs';

export interface GalleryImage {
  id: number;
  category: GalleryCategory;
  src: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    category: 'Character Designs',
    src: '/assets/generated/bestest.dim_900x1200.png',
    alt: 'Character design sheet featuring multiple characters from Whispers Of The White Moon',
  },
];

export const galleryCategories: GalleryCategory[] = [
  'Concept Art',
  'Fight Scenes',
  'Character Designs',
];
