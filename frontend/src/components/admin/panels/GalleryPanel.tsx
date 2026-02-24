import React, { useState, useCallback, useRef } from 'react';
import type { GalleryImage } from '../../../backend';
import { GalleryCategory } from '../../../backend';
import {
  useGetAllGalleryImages,
  useAddGalleryImage,
  useUpdateGalleryImage,
  useDeleteGalleryImage,
  getGalleryImageSrc,
} from '../../../hooks/useQueries';
import { Plus, Pencil, Trash2, Upload, ImageIcon, Loader2, X } from 'lucide-react';

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  [GalleryCategory.ConceptArt]: 'Concept Art',
  [GalleryCategory.FightScenes]: 'Fight Scenes',
  [GalleryCategory.CharacterDesigns]: 'Character Designs',
};

interface GalleryFormData {
  title: string;
  altText: string;
  category: GalleryCategory;
  imagePath: string;
  imagePreview: string | null;
  imageData: Uint8Array | null;
}

const defaultForm: GalleryFormData = {
  title: '',
  altText: '',
  category: GalleryCategory.ConceptArt,
  imagePath: '',
  imagePreview: null,
  imageData: null,
};

function imageToForm(img: GalleryImage): GalleryFormData {
  let preview: string | null = img.path || null;
  if (img.imageData && img.imageData.length > 0) {
    // Copy into a plain ArrayBuffer to satisfy Blob constructor type requirements
    const buffer = img.imageData.buffer.slice(
      img.imageData.byteOffset,
      img.imageData.byteOffset + img.imageData.byteLength
    ) as ArrayBuffer;
    preview = URL.createObjectURL(new Blob([buffer], { type: 'image/jpeg' }));
  }
  return {
    title: img.title,
    altText: img.altText,
    category: img.category,
    imagePath: img.path,
    imagePreview: preview,
    imageData: null,
  };
}

interface GalleryModalProps {
  image: GalleryImage | null;
  onClose: () => void;
}

function GalleryModal({ image, onClose }: GalleryModalProps) {
  const [form, setForm] = useState<GalleryFormData>(image ? imageToForm(image) : defaultForm);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addGalleryImage = useAddGalleryImage();
  const updateGalleryImage = useUpdateGalleryImage();

  const isEditing = !!image;
  const isPending = addGalleryImage.isPending || updateGalleryImage.isPending;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        const bytes = new Uint8Array(result);
        const blob = new Blob([result], { type: file.type });
        setForm((prev) => ({
          ...prev,
          imageData: bytes,
          imagePreview: URL.createObjectURL(blob),
          imagePath: '',
        }));
      }
    };
    reader.readAsArrayBuffer(file);
    setForm((prev) => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^.]+$/, ''),
      altText: prev.altText || file.name.replace(/\.[^.]+$/, ''),
    }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.imageData && !form.imagePath.trim()) { setError('Please upload an image or enter an image URL.'); return; }

    const imageRecord: GalleryImage = {
      id: image?.id ?? `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: form.title.trim(),
      altText: form.altText.trim() || form.title.trim(),
      category: form.category,
      path: form.imagePath.trim(),
      thumbnail: form.imagePath.trim(),
      imageData: form.imageData ?? undefined,
    };

    try {
      if (isEditing) {
        await updateGalleryImage.mutateAsync(imageRecord);
      } else {
        await addGalleryImage.mutateAsync(imageRecord);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Operation failed.');
    }
  };

  const inputClass =
    'w-full bg-[oklch(0.08_0.02_260)] border border-[oklch(0.3_0.03_260)] rounded-lg px-3 py-2 text-sm text-[oklch(0.9_0.02_260)] placeholder-[oklch(0.4_0.03_260)] focus:outline-none focus:border-[oklch(0.7_0.18_55/0.6)] transition-colors';
  const labelClass = 'block text-xs font-medium text-[oklch(0.65_0.05_260)] mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-[oklch(0.12_0.02_260)] border border-[oklch(0.7_0.18_55/0.4)] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.7_0.18_55/0.2)] flex-shrink-0">
          <h2 className="font-cinzel text-lg text-[oklch(0.85_0.18_55)] tracking-wider">
            {isEditing ? 'Edit Gallery Image' : 'Add Gallery Image'}
          </h2>
          <button onClick={onClose} className="text-[oklch(0.6_0.05_260)] hover:text-[oklch(0.85_0.18_55)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[oklch(0.7_0.18_55)] bg-[oklch(0.7_0.18_55/0.1)]'
                : 'border-[oklch(0.4_0.05_260)] hover:border-[oklch(0.7_0.18_55/0.6)] hover:bg-[oklch(0.7_0.18_55/0.05)]'
            }`}
          >
            {form.imagePreview ? (
              <div>
                <img src={form.imagePreview} alt="Preview" className="max-h-36 mx-auto rounded-lg object-cover" />
                <p className="mt-2 text-xs text-[oklch(0.6_0.05_260)]">Click to change image</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-2">
                <Upload size={28} className="text-[oklch(0.5_0.05_260)]" />
                <p className="text-sm text-[oklch(0.7_0.05_260)]">
                  <span className="text-[oklch(0.75_0.15_200)]">Drag & drop</span> or click to browse
                </p>
                <p className="text-xs text-[oklch(0.5_0.05_260)]">PNG, JPG, GIF, WebP</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[oklch(0.3_0.03_260)]" />
            <span className="text-xs text-[oklch(0.5_0.05_260)]">OR</span>
            <div className="flex-1 h-px bg-[oklch(0.3_0.03_260)]" />
          </div>

          {/* Image URL */}
          <div>
            <label className={labelClass}>Image URL / Path</label>
            <input
              type="text"
              value={form.imagePath}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                imagePath: e.target.value,
                imagePreview: e.target.value ? e.target.value : prev.imagePreview,
                imageData: e.target.value ? null : prev.imageData,
              }))}
              placeholder="https://... or /assets/..."
              className={inputClass}
            />
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Image title"
              className={inputClass}
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className={labelClass}>Alt Text</label>
            <input
              type="text"
              value={form.altText}
              onChange={(e) => setForm((prev) => ({ ...prev, altText: e.target.value }))}
              placeholder="Descriptive alt text for accessibility"
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as GalleryCategory }))}
              className={inputClass}
            >
              <option value={GalleryCategory.ConceptArt}>Concept Art</option>
              <option value={GalleryCategory.FightScenes}>Fight Scenes</option>
              <option value={GalleryCategory.CharacterDesigns}>Character Designs</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-[oklch(0.3_0.03_260)] text-[oklch(0.65_0.05_260)] hover:border-[oklch(0.5_0.05_260)] transition-colors text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 rounded-lg bg-[oklch(0.7_0.18_55)] text-[oklch(0.1_0.02_260)] font-semibold hover:bg-[oklch(0.75_0.18_55)] disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : isEditing ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  image: GalleryImage;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirm({ image, onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[oklch(0.12_0.02_260)] border border-red-500/40 rounded-xl shadow-2xl p-6">
        <h3 className="font-cinzel text-lg text-red-400 mb-2">Delete Image</h3>
        <p className="text-sm text-[oklch(0.65_0.05_260)] mb-6">
          Are you sure you want to delete <span className="text-[oklch(0.85_0.05_260)] font-medium">"{image.title}"</span>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg border border-[oklch(0.3_0.03_260)] text-[oklch(0.65_0.05_260)] hover:border-[oklch(0.5_0.05_260)] transition-colors text-sm">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500/80 text-white font-semibold hover:bg-red-500 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isPending ? <><Loader2 size={14} className="animate-spin" /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

type FilterCategory = GalleryCategory | 'All';

export default function GalleryPanel() {
  const { data: images, isLoading } = useGetAllGalleryImages();
  const deleteGalleryImage = useDeleteGalleryImage();

  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const filtered = activeFilter === 'All'
    ? (images ?? [])
    : (images ?? []).filter((img) => img.category === activeFilter);

  const handleDelete = async () => {
    if (!deletingImage) return;
    try {
      await deleteGalleryImage.mutateAsync(deletingImage.id);
      setDeletingImage(null);
    } catch {
      // handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl text-[oklch(0.85_0.18_55)] tracking-wider">Gallery</h2>
          <p className="text-sm text-[oklch(0.55_0.05_260)] mt-0.5">Manage gallery images and categories</p>
        </div>
        <button
          onClick={() => { setEditingImage(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.7_0.18_55/0.15)] border border-[oklch(0.7_0.18_55/0.4)] text-[oklch(0.85_0.18_55)] hover:bg-[oklch(0.7_0.18_55/0.25)] transition-all text-sm font-medium"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {(['All', GalleryCategory.ConceptArt, GalleryCategory.FightScenes, GalleryCategory.CharacterDesigns] as FilterCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-rajdhani tracking-wide transition-all border ${
              activeFilter === cat
                ? 'bg-[oklch(0.7_0.18_55/0.2)] border-[oklch(0.7_0.18_55)] text-[oklch(0.85_0.18_55)]'
                : 'border-[oklch(0.3_0.03_260)] text-[oklch(0.55_0.05_260)] hover:border-[oklch(0.5_0.05_260)]'
            }`}
          >
            {cat === 'All' ? 'All' : CATEGORY_LABELS[cat as GalleryCategory]}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-[oklch(0.7_0.18_55)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[oklch(0.5_0.05_260)] font-rajdhani">
          <p className="text-lg">No images yet.</p>
          <p className="text-sm mt-1">Click "Add Image" to upload the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((img) => {
            const src = getGalleryImageSrc(img);
            return (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-[oklch(0.25_0.03_260)] hover:border-[oklch(0.7_0.18_55/0.4)] transition-all bg-[oklch(0.1_0.02_260)]"
              >
                {/* Thumbnail */}
                <div className="aspect-video">
                  {src ? (
                    <img src={src} alt={img.altText} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[oklch(0.35_0.03_260)]">
                      <ImageIcon size={28} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-cinzel text-[oklch(0.8_0.05_260)] truncate">{img.title}</p>
                  <span className="text-xs text-[oklch(0.6_0.18_55)] font-rajdhani">{CATEGORY_LABELS[img.category]}</span>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingImage(img); setShowModal(true); }}
                    className="p-1.5 rounded-lg bg-black/70 text-[oklch(0.75_0.15_200)] hover:bg-black/90 transition-all"
                    title="Edit image"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeletingImage(img)}
                    className="p-1.5 rounded-lg bg-black/70 text-red-400 hover:bg-black/90 transition-all"
                    title="Delete image"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <GalleryModal
          image={editingImage}
          onClose={() => { setShowModal(false); setEditingImage(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deletingImage && (
        <DeleteConfirm
          image={deletingImage}
          onConfirm={handleDelete}
          onCancel={() => setDeletingImage(null)}
          isPending={deleteGalleryImage.isPending}
        />
      )}
    </div>
  );
}
