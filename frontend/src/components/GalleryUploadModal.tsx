import React, { useState, useCallback, useRef } from 'react';
import type { GalleryImage } from '../backend';
import { GalleryCategory } from '../backend';
import { useAddGalleryImage } from '../hooks/useQueries';
import { X, Upload, ImageIcon, Loader2 } from 'lucide-react';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const inputClass =
  'w-full bg-[oklch(0.08_0.02_260)] border border-[oklch(0.3_0.03_260)] rounded-lg px-3 py-2 text-sm text-[oklch(0.9_0.02_260)] placeholder-[oklch(0.4_0.03_260)] focus:outline-none focus:border-[oklch(0.7_0.18_55/0.6)] transition-colors';

export default function GalleryUploadModal({ isOpen, onClose, onSuccess }: GalleryUploadModalProps) {
  const [title, setTitle] = useState('');
  const [altText, setAltText] = useState('');
  const [category, setCategory] = useState<GalleryCategory>(GalleryCategory.ConceptArt);
  const [imagePath, setImagePath] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<Uint8Array | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addGalleryImage = useAddGalleryImage();

  const resetForm = useCallback(() => {
    setTitle('');
    setAltText('');
    setCategory(GalleryCategory.ConceptArt);
    setImagePath('');
    setImagePreview(null);
    setImageData(null);
    setIsDragging(false);
    setError('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        setImageData(new Uint8Array(result));
        const blob = new Blob([result], { type: file.type });
        setImagePreview(URL.createObjectURL(blob));
        setImagePath('');
      }
    };
    reader.readAsArrayBuffer(file);
    setTitle((prev) => prev || file.name.replace(/\.[^.]+$/, ''));
    setAltText((prev) => prev || file.name.replace(/\.[^.]+$/, ''));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!imageData && !imagePath.trim()) {
      setError('Please upload an image or enter an image URL.');
      return;
    }

    const id = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const image: GalleryImage = {
      id,
      title: title.trim(),
      altText: altText.trim() || title.trim(),
      category,
      path: imagePath.trim(),
      thumbnail: imagePath.trim(),
      imageData: imageData ?? undefined,
    };

    try {
      await addGalleryImage.mutateAsync(image);
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload image.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          background: 'oklch(0.11 0.025 260)',
          border: '1px solid oklch(0.7 0.18 55 / 0.45)',
          boxShadow:
            '0 0 40px oklch(0.7 0.18 55 / 0.15), 0 0 80px oklch(0.7 0.18 55 / 0.08), inset 0 1px 0 oklch(0.7 0.18 55 / 0.1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid oklch(0.7 0.18 55 / 0.2)' }}
        >
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-[oklch(0.75_0.15_200)]" />
            <h2 className="font-cinzel text-lg text-[oklch(0.85_0.18_55)] tracking-wider">
              Upload Gallery Image
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-[oklch(0.5_0.05_260)] hover:text-[oklch(0.85_0.18_55)] transition-colors p-1 rounded-lg hover:bg-[oklch(0.7_0.18_55/0.1)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? 'border-[oklch(0.75_0.15_200)] bg-[oklch(0.75_0.15_200/0.08)]'
                : 'border-[oklch(0.35_0.05_260)] hover:border-[oklch(0.7_0.18_55/0.6)] hover:bg-[oklch(0.7_0.18_55/0.04)]'
            }`}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-44 mx-auto rounded-lg object-cover shadow-lg"
                />
                <p className="mt-2 text-xs text-[oklch(0.55_0.05_260)]">
                  Click to change image
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.75 0.15 200 / 0.1)', border: '1px solid oklch(0.75 0.15 200 / 0.3)' }}
                >
                  <Upload size={24} className="text-[oklch(0.75_0.15_200)]" />
                </div>
                <div>
                  <p className="text-sm text-[oklch(0.75_0.05_260)]">
                    <span className="text-[oklch(0.75_0.15_200)] font-semibold">
                      Drag &amp; drop
                    </span>{' '}
                    or{' '}
                    <span className="text-[oklch(0.85_0.18_55)] font-semibold">
                      click to browse
                    </span>
                  </p>
                  <p className="text-xs text-[oklch(0.45_0.05_260)] mt-1">
                    PNG, JPG, GIF, WebP supported
                  </p>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[oklch(0.25_0.03_260)]" />
            <span className="text-xs text-[oklch(0.45_0.05_260)] font-rajdhani tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-[oklch(0.25_0.03_260)]" />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.6_0.05_260)] mb-1 font-rajdhani tracking-wide uppercase">
              Image URL / Path
            </label>
            <input
              type="text"
              value={imagePath}
              onChange={(e) => {
                setImagePath(e.target.value);
                if (e.target.value) {
                  setImagePreview(null);
                  setImageData(null);
                }
              }}
              placeholder="https://... or /assets/..."
              className={inputClass}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.6_0.05_260)] mb-1 font-rajdhani tracking-wide uppercase">
              Title <span className="text-[oklch(0.7_0.18_55)]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Image title"
              className={inputClass}
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.6_0.05_260)] mb-1 font-rajdhani tracking-wide uppercase">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive alt text for accessibility"
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[oklch(0.6_0.05_260)] mb-1 font-rajdhani tracking-wide uppercase">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GalleryCategory)}
              className={inputClass}
            >
              <option value={GalleryCategory.ConceptArt}>Concept Art</option>
              <option value={GalleryCategory.FightScenes}>Fight Scenes</option>
              <option value={GalleryCategory.CharacterDesigns}>Character Designs</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-[oklch(0.3_0.03_260)] text-[oklch(0.6_0.05_260)] hover:border-[oklch(0.5_0.05_260)] hover:text-[oklch(0.8_0.05_260)] transition-all text-sm font-rajdhani tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addGalleryImage.isPending}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm font-rajdhani tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: addGalleryImage.isPending
                  ? 'oklch(0.65 0.18 55)'
                  : 'oklch(0.72 0.18 55)',
                color: 'oklch(0.1 0.02 260)',
                boxShadow: addGalleryImage.isPending
                  ? 'none'
                  : '0 0 16px oklch(0.7 0.18 55 / 0.4)',
              }}
            >
              {addGalleryImage.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Upload Image
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
