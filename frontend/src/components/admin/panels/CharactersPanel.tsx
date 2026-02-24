import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Users } from 'lucide-react';
import {
  useGetAllCharacters,
  useAddCharacter,
  useUpdateCharacter,
  useDeleteCharacter,
  useGetAllClans,
} from '../../../hooks/useQueries';
import type { Character } from '../../../backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { clans as staticClans } from '../../../data/clans';

type CharacterFormData = {
  id: string;
  name: string;
  clan: string;
  role: string;
  bio: string;
  initials: string;
};

const emptyForm: CharacterFormData = {
  id: '',
  name: '',
  clan: 'moon',
  role: '',
  bio: '',
  initials: '',
};

function CharacterModal({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
  clanOptions,
}: {
  open: boolean;
  onClose: () => void;
  initial: CharacterFormData;
  onSave: (data: CharacterFormData) => void;
  isSaving: boolean;
  clanOptions: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<CharacterFormData>(initial);

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
            {initial.id ? 'Edit Character' : 'Add Character'}
          </h2>
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
                placeholder="Character name"
              />
            </div>
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Initials</label>
              <input
                type="text"
                required
                maxLength={2}
                value={form.initials}
                onChange={e => setForm(f => ({ ...f, initials: e.target.value.toUpperCase().slice(0, 2) }))}
                className="admin-input w-full"
                placeholder="KD"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Clan</label>
              <select
                value={form.clan}
                onChange={e => setForm(f => ({ ...f, clan: e.target.value }))}
                className="admin-input w-full"
              >
                {clanOptions.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Role</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="admin-input w-full"
                placeholder="Protagonist"
              />
            </div>
          </div>
          <div>
            <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Bio</label>
            <textarea
              required
              rows={4}
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="admin-input w-full resize-none"
              placeholder="Character biography..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 admin-btn-secondary">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 admin-btn-primary">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CharactersPanel() {
  const { data: characters = [], isLoading } = useGetAllCharacters();
  const { data: backendClans = [] } = useGetAllClans();
  const addCharacter = useAddCharacter();
  const updateCharacter = useUpdateCharacter();
  const deleteCharacter = useDeleteCharacter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<CharacterFormData>(emptyForm);

  // Use backend clans if available, otherwise fall back to static
  const clanOptions = backendClans.length > 0
    ? backendClans.map(c => ({ id: c.id, name: c.name }))
    : staticClans.map(c => ({ id: c.id, name: c.name }));

  const getClanColor = (clanId: string): string => {
    const staticClan = staticClans.find(c => c.id === clanId);
    return staticClan?.glowColor ?? '#4fc3f7';
  };

  const getClanRgb = (clanId: string): string => {
    const staticClan = staticClans.find(c => c.id === clanId);
    return staticClan?.glowColorRgb ?? '79, 195, 247';
  };

  const openAdd = () => {
    setEditingForm({ ...emptyForm, id: `char-${Date.now()}` });
    setModalOpen(true);
  };

  const openEdit = (char: Character) => {
    setEditingForm({
      id: char.id,
      name: char.name,
      clan: char.clan,
      role: char.role,
      bio: char.bio,
      initials: char.initials,
    });
    setModalOpen(true);
  };

  const handleSave = (data: CharacterFormData) => {
    const character: Character = {
      id: data.id,
      name: data.name,
      clan: data.clan,
      role: data.role,
      bio: data.bio,
      initials: data.initials,
    };
    const isEdit = characters.some(c => c.id === data.id);
    const mutation = isEdit ? updateCharacter : addCharacter;
    mutation.mutate(character, { onSuccess: () => setModalOpen(false) });
  };

  const handleDelete = (id: string) => {
    deleteCharacter.mutate(id);
  };

  const isSaving = addCharacter.isPending || updateCharacter.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(79,195,247,0.3)' }}>
            Characters
          </h1>
          <p className="font-rajdhani text-sm text-silver/50 mt-1">Manage the cast of characters</p>
        </div>
        <button onClick={openAdd} className="admin-btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Character</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-moon-blue animate-spin" />
        </div>
      ) : characters.length === 0 ? (
        <div className="admin-card text-center py-16">
          <Users className="w-10 h-10 text-silver/20 mx-auto mb-3" />
          <p className="font-rajdhani text-silver/40 tracking-wider">No characters yet. Add your first character.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {characters.map(char => {
            const glowColor = getClanColor(char.clan);
            const glowRgb = getClanRgb(char.clan);
            return (
              <div
                key={char.id}
                className="admin-card relative"
                style={{ boxShadow: `0 0 15px 2px rgba(${glowRgb},0.1), 0 4px 20px rgba(0,0,0,0.5)` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-cinzel font-bold border flex-shrink-0"
                    style={{
                      borderColor: glowColor,
                      background: `radial-gradient(circle, rgba(${glowRgb},0.2) 0%, rgba(0,0,0,0.6) 100%)`,
                      color: glowColor,
                    }}
                  >
                    {char.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-cinzel text-sm font-bold text-white truncate">{char.name}</h3>
                    <p className="font-rajdhani text-xs tracking-widest uppercase truncate" style={{ color: glowColor }}>
                      {char.role}
                    </p>
                  </div>
                </div>
                <p className="font-rajdhani text-xs text-silver/50 leading-relaxed line-clamp-2 mb-3">{char.bio}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-rajdhani font-semibold tracking-widest uppercase border"
                    style={{
                      borderColor: `rgba(${glowRgb},0.4)`,
                      background: `rgba(${glowRgb},0.08)`,
                      color: glowColor,
                    }}
                  >
                    {clanOptions.find(c => c.id === char.clan)?.name ?? char.clan}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(char)}
                      className="p-1.5 text-silver/40 hover:text-moon-blue hover:bg-moon-blue/10 rounded transition-all duration-200"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 text-silver/40 hover:text-crimson hover:bg-crimson/10 rounded transition-all duration-200">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="admin-dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-cinzel text-white">Delete Character?</AlertDialogTitle>
                          <AlertDialogDescription className="font-rajdhani text-silver/60">
                            This will permanently delete "{char.name}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="admin-btn-secondary">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(char.id)}
                            className="admin-btn-danger"
                            disabled={deleteCharacter.isPending}
                          >
                            {deleteCharacter.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CharacterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editingForm}
        onSave={handleSave}
        isSaving={isSaving}
        clanOptions={clanOptions}
      />
    </div>
  );
}
