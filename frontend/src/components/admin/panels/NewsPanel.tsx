import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Newspaper, Calendar } from 'lucide-react';
import {
  useGetAllNewsEntries,
  useAddNewsEntry,
  useUpdateNewsEntry,
  useDeleteNewsEntry,
} from '../../../hooks/useQueries';
import type { NewsEntry, NewsCategory } from '../../../backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const CATEGORY_OPTIONS: { value: NewsCategory; label: string }[] = [
  { value: 'DevLog' as unknown as NewsCategory, label: 'Dev Log' },
  { value: 'EpisodeAnnouncement' as unknown as NewsCategory, label: 'Episode Announcement' },
  { value: 'SeasonUpdate' as unknown as NewsCategory, label: 'Season Update' },
];

function categoryLabel(cat: NewsCategory): string {
  const c = cat as unknown as string;
  if (c === 'DevLog') return 'Dev Log';
  if (c === 'EpisodeAnnouncement') return 'Episode Announcement';
  if (c === 'SeasonUpdate') return 'Season Update';
  return String(c);
}

function categoryBadgeClass(cat: NewsCategory): string {
  const c = cat as unknown as string;
  if (c === 'DevLog') return 'border-moon-blue/40 bg-moon-blue/10 text-moon-blue';
  if (c === 'EpisodeAnnouncement') return 'border-gold/40 bg-gold/10 text-gold';
  return 'border-mystic/40 bg-mystic/10 text-mystic';
}

type NewsFormData = {
  id: string;
  title: string;
  date: string;
  category: string;
  body: string;
};

const emptyForm: NewsFormData = {
  id: '',
  title: '',
  date: new Date().toISOString().split('T')[0],
  category: 'DevLog',
  body: '',
};

function NewsModal({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  initial: NewsFormData;
  onSave: (data: NewsFormData) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<NewsFormData>(initial);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-lg border border-moon-blue/20 p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: 'rgba(13,13,26,0.97)', boxShadow: '0 0 40px rgba(79,195,247,0.1), 0 20px 60px rgba(0,0,0,0.8)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cinzel text-lg font-bold text-white">
            {initial.id ? 'Edit Entry' : 'Add Entry'}
          </h2>
          <button onClick={onClose} className="text-silver/40 hover:text-silver transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="admin-input w-full"
              placeholder="News entry title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="admin-input w-full"
              />
            </div>
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="admin-input w-full"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.value as unknown as string} value={opt.value as unknown as string}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Body</label>
            <textarea
              required
              rows={5}
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              className="admin-input w-full resize-none"
              placeholder="News entry body text..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 admin-btn-primary">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewsPanel() {
  const { data: entries = [], isLoading } = useGetAllNewsEntries();
  const addEntry = useAddNewsEntry();
  const updateEntry = useUpdateNewsEntry();
  const deleteEntry = useDeleteNewsEntry();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<NewsFormData>(emptyForm);

  const openAdd = () => {
    setEditingForm({ ...emptyForm, id: `news-${Date.now()}` });
    setModalOpen(true);
  };

  const openEdit = (entry: NewsEntry) => {
    const dateMs = Number(entry.date) / 1_000_000;
    const dateStr = new Date(dateMs).toISOString().split('T')[0];
    setEditingForm({
      id: entry.id,
      title: entry.title,
      date: dateStr,
      category: entry.category as unknown as string,
      body: entry.body,
    });
    setModalOpen(true);
  };

  const handleSave = (data: NewsFormData) => {
    const dateMs = new Date(data.date).getTime();
    const dateNs = BigInt(dateMs) * BigInt(1_000_000);
    const entry: NewsEntry = {
      id: data.id,
      title: data.title,
      date: dateNs,
      category: data.category as unknown as NewsCategory,
      body: data.body,
    };
    const isEdit = entries.some(e => e.id === data.id);
    const mutation = isEdit ? updateEntry : addEntry;
    mutation.mutate(entry, { onSuccess: () => setModalOpen(false) });
  };

  const handleDelete = (id: string) => {
    deleteEntry.mutate(id);
  };

  const isSaving = addEntry.isPending || updateEntry.isPending;

  const sorted = [...entries].sort((a, b) => Number(b.date) - Number(a.date));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(79,195,247,0.3)' }}>
            News & Dev Log
          </h1>
          <p className="font-rajdhani text-sm text-silver/50 mt-1">Manage news entries and dev logs</p>
        </div>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Entry</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-moon-blue animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="admin-card text-center py-16">
          <Newspaper className="w-10 h-10 text-silver/20 mx-auto mb-3" />
          <p className="font-rajdhani text-silver/40 tracking-wider">No news entries yet. Add your first entry.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(entry => {
            const dateMs = Number(entry.date) / 1_000_000;
            const dateStr = new Date(dateMs).toISOString().split('T')[0];
            return (
              <div key={entry.id} className="admin-card flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-rajdhani font-semibold tracking-widest uppercase border ${categoryBadgeClass(entry.category)}`}>
                      {categoryLabel(entry.category)}
                    </span>
                    <div className="flex items-center gap-1 text-silver/30">
                      <Calendar className="w-3 h-3" />
                      <span className="font-rajdhani text-xs">{dateStr}</span>
                    </div>
                  </div>
                  <h3 className="font-cinzel text-sm font-bold text-white mb-1">{entry.title}</h3>
                  <p className="font-rajdhani text-xs text-silver/50 leading-relaxed line-clamp-2">{entry.body}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    className="p-2 text-silver/40 hover:text-moon-blue hover:bg-moon-blue/10 rounded transition-all duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-silver/40 hover:text-crimson hover:bg-crimson/10 rounded transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="admin-dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-cinzel text-white">Delete Entry?</AlertDialogTitle>
                        <AlertDialogDescription className="font-rajdhani text-silver/60">
                          This will permanently delete "{entry.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="admin-btn-secondary">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(entry.id)}
                          className="admin-btn-danger"
                          disabled={deleteEntry.isPending}
                        >
                          {deleteEntry.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editingForm}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
}
