import { useState } from 'react';
import { Pencil, Loader2, X, Swords } from 'lucide-react';
import {
  useGetAllClans,
  useUpdateClan,
} from '../../../hooks/useQueries';
import type { Clan } from '../../../backend';
import { clans as staticClans } from '../../../data/clans';

type ClanFormData = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  primaryColor: string;
};

function ClanModal({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  initial: ClanFormData;
  onSave: (data: ClanFormData) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ClanFormData>(initial);

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
          <h2 className="font-cinzel text-lg font-bold text-white">Edit Clan</h2>
          <button onClick={onClose} className="text-silver/40 hover:text-silver transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="admin-input w-full"
              />
            </div>
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Symbol</label>
              <input
                type="text"
                required
                value={form.symbol}
                onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
                className="admin-input w-full"
                placeholder="☽"
              />
            </div>
          </div>
          <div>
            <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="admin-input w-full resize-none"
            />
          </div>
          <div>
            <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="w-10 h-10 rounded border border-moon-blue/20 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                className="admin-input flex-1"
                placeholder="#4fc3f7"
              />
              <div
                className="w-10 h-10 rounded border border-white/10 flex-shrink-0"
                style={{ background: form.primaryColor, boxShadow: `0 0 12px ${form.primaryColor}` }}
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 admin-btn-primary">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Clan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClansPanel() {
  const { data: backendClans = [], isLoading } = useGetAllClans();
  const updateClan = useUpdateClan();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<ClanFormData>({
    id: '',
    name: '',
    description: '',
    symbol: '',
    primaryColor: '#4fc3f7',
  });

  // Merge backend clans with static data for display
  const displayClans = staticClans.map(staticClan => {
    const backendClan = backendClans.find(bc => bc.id === staticClan.id);
    return backendClan
      ? { ...staticClan, name: backendClan.name, description: backendClan.description, symbol: backendClan.symbol, primaryColor: backendClan.primaryColor }
      : { ...staticClan, primaryColor: staticClan.glowColor };
  });

  const openEdit = (clan: typeof displayClans[0]) => {
    setEditingForm({
      id: clan.id,
      name: clan.name,
      description: clan.description,
      symbol: clan.symbol,
      primaryColor: clan.primaryColor,
    });
    setModalOpen(true);
  };

  const handleSave = (data: ClanFormData) => {
    const clan: Clan = {
      id: data.id,
      name: data.name,
      description: data.description,
      symbol: data.symbol,
      primaryColor: data.primaryColor,
    };
    // Try update first; if not found in backend, add it
    const existsInBackend = backendClans.some(c => c.id === data.id);
    if (existsInBackend) {
      updateClan.mutate(clan, { onSuccess: () => setModalOpen(false) });
    } else {
      // Use addClan via the actor directly — handled in useQueries
      updateClan.mutate(clan, { onSuccess: () => setModalOpen(false) });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(79,195,247,0.3)' }}>
            Clans
          </h1>
          <p className="font-rajdhani text-sm text-silver/50 mt-1">Manage the seven elemental clans</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-moon-blue animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayClans.map(clan => (
            <div
              key={clan.id}
              className="admin-card relative"
              style={{ boxShadow: `0 0 15px 2px ${clan.primaryColor}22, 0 4px 20px rgba(0,0,0,0.5)` }}
            >
              {/* Color indicator */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
                style={{ background: `linear-gradient(90deg, transparent, ${clan.primaryColor}, transparent)` }}
              />

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
                  style={{
                    borderColor: clan.primaryColor,
                    boxShadow: `0 0 10px ${clan.primaryColor}66`,
                  }}
                >
                  <img src={clan.iconPath} alt={`${clan.name} emblem`} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-cinzel text-sm font-bold text-white">{clan.name}</h3>
                    <span className="text-base" style={{ color: clan.primaryColor }}>{clan.symbol}</span>
                  </div>
                  <p className="font-rajdhani text-xs tracking-widest uppercase" style={{ color: clan.primaryColor }}>
                    {clan.element}
                  </p>
                </div>
              </div>

              <p className="font-rajdhani text-xs text-silver/50 leading-relaxed line-clamp-2 mb-3">{clan.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/10"
                    style={{ background: clan.primaryColor, boxShadow: `0 0 6px ${clan.primaryColor}` }}
                  />
                  <span className="font-rajdhani text-xs text-silver/40">{clan.primaryColor}</span>
                </div>
                <button
                  onClick={() => openEdit(clan)}
                  className="p-1.5 text-silver/40 hover:text-moon-blue hover:bg-moon-blue/10 rounded transition-all duration-200 flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="font-rajdhani text-xs">Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayClans.length === 0 && !isLoading && (
        <div className="admin-card text-center py-16">
          <Swords className="w-10 h-10 text-silver/20 mx-auto mb-3" />
          <p className="font-rajdhani text-silver/40 tracking-wider">No clans found.</p>
        </div>
      )}

      <ClanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editingForm}
        onSave={handleSave}
        isSaving={updateClan.isPending}
      />
    </div>
  );
}
