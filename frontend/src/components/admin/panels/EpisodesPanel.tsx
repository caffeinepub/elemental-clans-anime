import React, { useState } from 'react';
import type { Episode } from '../../../backend';
import { EpisodeStatus } from '../../../backend';
import {
  useGetAllEpisodes,
  useAddEpisode,
  useUpdateEpisode,
  useDeleteEpisode,
} from '../../../hooks/useQueries';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

const STATUS_LABELS: Record<EpisodeStatus, string> = {
  [EpisodeStatus.Released]: 'Released',
  [EpisodeStatus.ComingSoon]: 'Coming Soon',
  [EpisodeStatus.InProduction]: 'In Production',
};

const STATUS_COLORS: Record<EpisodeStatus, string> = {
  [EpisodeStatus.Released]: 'text-green-400 border-green-400/40 bg-green-400/10',
  [EpisodeStatus.ComingSoon]: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  [EpisodeStatus.InProduction]: 'text-blue-400 border-blue-400/40 bg-blue-400/10',
};

interface EpisodeFormData {
  title: string;
  summary: string;
  number: string;
  duration: string;
  status: EpisodeStatus;
  thumbnailUrl: string;
  videoLink: string;
}

const defaultForm: EpisodeFormData = {
  title: '',
  summary: '',
  number: '1',
  duration: '24',
  status: EpisodeStatus.InProduction,
  thumbnailUrl: '',
  videoLink: '',
};

function episodeToForm(ep: Episode): EpisodeFormData {
  return {
    title: ep.title,
    summary: ep.summary,
    number: String(ep.number),
    duration: String(ep.duration),
    status: ep.status,
    thumbnailUrl: ep.thumbnailUrl ?? '',
    videoLink: ep.videoLink ?? '',
  };
}

interface EpisodeModalProps {
  episode: Episode | null;
  onClose: () => void;
}

function EpisodeModal({ episode, onClose }: EpisodeModalProps) {
  const [form, setForm] = useState<EpisodeFormData>(
    episode ? episodeToForm(episode) : defaultForm
  );
  const [error, setError] = useState('');
  const addEpisode = useAddEpisode();
  const updateEpisode = useUpdateEpisode();

  const isEditing = !!episode;
  const isPending = addEpisode.isPending || updateEpisode.isPending;

  const handleChange = (field: keyof EpisodeFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.summary.trim()) { setError('Summary is required.'); return; }

    const episodeData: Episode = {
      id: episode?.id ?? `ep-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: form.title.trim(),
      summary: form.summary.trim(),
      number: BigInt(parseInt(form.number) || 1),
      duration: BigInt(parseInt(form.duration) || 24),
      status: form.status,
      thumbnailUrl: form.thumbnailUrl.trim() || undefined,
      videoLink: form.videoLink.trim() || undefined,
    };

    try {
      if (isEditing) {
        await updateEpisode.mutateAsync(episodeData);
      } else {
        await addEpisode.mutateAsync(episodeData);
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
      <div className="relative z-10 w-full max-w-2xl bg-[oklch(0.12_0.02_260)] border border-[oklch(0.7_0.18_55/0.4)] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[oklch(0.7_0.18_55/0.2)] flex-shrink-0">
          <h2 className="font-cinzel text-lg text-[oklch(0.85_0.18_55)] tracking-wider">
            {isEditing ? 'Edit Episode' : 'Add New Episode'}
          </h2>
          <button onClick={onClose} className="text-[oklch(0.6_0.05_260)] hover:text-[oklch(0.85_0.18_55)] transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Row: Number + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Episode Number</label>
              <input type="number" min="1" value={form.number} onChange={(e) => handleChange('number', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <input type="number" min="1" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Episode Title *</label>
            <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="Enter episode title" className={inputClass} />
          </div>

          {/* Summary */}
          <div>
            <label className={labelClass}>Summary *</label>
            <textarea
              value={form.summary}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="Episode summary..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Release Status</label>
            <select value={form.status} onChange={(e) => handleChange('status', e.target.value as EpisodeStatus)} className={inputClass}>
              <option value={EpisodeStatus.Released}>Released</option>
              <option value={EpisodeStatus.ComingSoon}>Coming Soon</option>
              <option value={EpisodeStatus.InProduction}>In Production</option>
            </select>
          </div>

          {/* Thumbnail URL */}
          <div>
            <label className={labelClass}>Thumbnail Image URL</label>
            <input
              type="text"
              value={form.thumbnailUrl}
              onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
              placeholder="https://... or /assets/..."
              className={inputClass}
            />
            {form.thumbnailUrl && (
              <div className="mt-2 rounded-lg overflow-hidden border border-[oklch(0.3_0.03_260)] w-32 h-20">
                <img src={form.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
          </div>

          {/* Video Link */}
          <div>
            <label className={labelClass}>Video Link (external URL)</label>
            <input
              type="text"
              value={form.videoLink}
              onChange={(e) => handleChange('videoLink', e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={inputClass}
            />
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
              {isPending ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : isEditing ? 'Update Episode' : 'Add Episode'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DeleteConfirmProps {
  episode: Episode;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function DeleteConfirm({ episode, onConfirm, onCancel, isPending }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[oklch(0.12_0.02_260)] border border-red-500/40 rounded-xl shadow-2xl p-6">
        <h3 className="font-cinzel text-lg text-red-400 mb-2">Delete Episode</h3>
        <p className="text-sm text-[oklch(0.65_0.05_260)] mb-6">
          Are you sure you want to delete <span className="text-[oklch(0.85_0.05_260)] font-medium">"{episode.title}"</span>? This cannot be undone.
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

export default function EpisodesPanel() {
  const { data: episodes, isLoading } = useGetAllEpisodes();
  const deleteEpisode = useDeleteEpisode();

  const [showModal, setShowModal] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [deletingEpisode, setDeletingEpisode] = useState<Episode | null>(null);

  const sortedEpisodes = [...(episodes ?? [])].sort((a, b) => Number(a.number) - Number(b.number));

  const handleDelete = async () => {
    if (!deletingEpisode) return;
    try {
      await deleteEpisode.mutateAsync(deletingEpisode.id);
      setDeletingEpisode(null);
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-cinzel text-xl text-[oklch(0.85_0.18_55)] tracking-wider">Episodes</h2>
          <p className="text-sm text-[oklch(0.55_0.05_260)] mt-0.5">Manage season episodes and their details</p>
        </div>
        <button
          onClick={() => { setEditingEpisode(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[oklch(0.7_0.18_55/0.15)] border border-[oklch(0.7_0.18_55/0.4)] text-[oklch(0.85_0.18_55)] hover:bg-[oklch(0.7_0.18_55/0.25)] transition-all text-sm font-medium"
        >
          <Plus size={16} />
          Add Episode
        </button>
      </div>

      {/* Episodes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-[oklch(0.7_0.18_55)]" />
        </div>
      ) : sortedEpisodes.length === 0 ? (
        <div className="text-center py-16 text-[oklch(0.5_0.05_260)] font-rajdhani">
          <p className="text-lg">No episodes yet.</p>
          <p className="text-sm mt-1">Click "Add Episode" to create the first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-[oklch(0.1_0.02_260)] border border-[oklch(0.25_0.03_260)] hover:border-[oklch(0.7_0.18_55/0.3)] transition-all group"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden bg-[oklch(0.08_0.02_260)] border border-[oklch(0.2_0.02_260)]">
                {ep.thumbnailUrl ? (
                  <img src={ep.thumbnailUrl} alt={ep.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[oklch(0.35_0.03_260)]">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[oklch(0.55_0.05_260)] font-rajdhani">EP {String(ep.number).padStart(2, '0')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-rajdhani ${STATUS_COLORS[ep.status]}`}>
                    {STATUS_LABELS[ep.status]}
                  </span>
                  <span className="text-xs text-[oklch(0.45_0.03_260)]">{String(ep.duration)} min</span>
                </div>
                <h3 className="font-cinzel text-sm text-[oklch(0.85_0.05_260)] mt-1 truncate">{ep.title}</h3>
                <p className="text-xs text-[oklch(0.55_0.05_260)] mt-0.5 line-clamp-2 font-rajdhani">{ep.summary}</p>
                {ep.videoLink && (
                  <a
                    href={ep.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 mt-1 text-xs text-[oklch(0.75_0.15_200)] hover:text-[oklch(0.85_0.15_200)] transition-colors"
                  >
                    <ExternalLink size={11} />
                    Watch Video
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditingEpisode(ep); setShowModal(true); }}
                  className="p-1.5 rounded-lg text-[oklch(0.6_0.05_260)] hover:text-[oklch(0.75_0.15_200)] hover:bg-[oklch(0.75_0.15_200/0.1)] transition-all"
                  title="Edit episode"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeletingEpisode(ep)}
                  className="p-1.5 rounded-lg text-[oklch(0.6_0.05_260)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Delete episode"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <EpisodeModal
          episode={editingEpisode}
          onClose={() => { setShowModal(false); setEditingEpisode(null); }}
        />
      )}

      {/* Delete Confirm */}
      {deletingEpisode && (
        <DeleteConfirm
          episode={deletingEpisode}
          onConfirm={handleDelete}
          onCancel={() => setDeletingEpisode(null)}
          isPending={deleteEpisode.isPending}
        />
      )}
    </div>
  );
}
