import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Users, PlusCircle, MinusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  useGetAllCharacters,
  useAddCharacters,
  useUpdateCharacter,
  useDeleteCharacter,
  useGetAllClans,
} from '../../../hooks/useQueries';
import type { Character } from '../../../backend';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { clans as staticClans } from '../../../data/clans';

type CharacterFormData = {
  _key: string; // internal key for list management
  id: string;
  name: string;
  clan: string;
  role: string;
  bio: string;
  initials: string;
};

function makeEmptyEntry(): CharacterFormData {
  return {
    _key: `entry-${Date.now()}-${Math.random()}`,
    id: `char-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name: '',
    clan: 'moon',
    role: '',
    bio: '',
    initials: '',
  };
}

// ── Single character entry form ───────────────────────────────────────────────

function CharacterEntryForm({
  entry,
  index,
  total,
  clanOptions,
  onChange,
  onRemove,
}: {
  entry: CharacterFormData;
  index: number;
  total: number;
  clanOptions: { id: string; name: string }[];
  onChange: (key: string, field: keyof CharacterFormData, value: string) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div
      className="rounded-md border border-moon-blue/15 p-4 space-y-3"
      style={{ background: 'rgba(79,195,247,0.03)' }}
    >
      {/* Entry header */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-cinzel text-xs font-bold text-moon-blue/70 tracking-widest uppercase">
          Character {index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(entry._key)}
          disabled={total === 1}
          title={total === 1 ? 'At least one character is required' : 'Remove this character'}
          className="flex items-center gap-1 text-xs font-rajdhani text-silver/40 hover:text-crimson disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
        >
          <MinusCircle className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>

      {/* Name + Initials */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Name</label>
          <input
            type="text"
            required
            value={entry.name}
            onChange={e => onChange(entry._key, 'name', e.target.value)}
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
            value={entry.initials}
            onChange={e => onChange(entry._key, 'initials', e.target.value.toUpperCase().slice(0, 2))}
            className="admin-input w-full"
            placeholder="KD"
          />
        </div>
      </div>

      {/* Clan + Role */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Clan</label>
          <select
            value={entry.clan}
            onChange={e => onChange(entry._key, 'clan', e.target.value)}
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
            value={entry.role}
            onChange={e => onChange(entry._key, 'role', e.target.value)}
            className="admin-input w-full"
            placeholder="Protagonist"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block font-rajdhani text-xs tracking-widest uppercase text-silver/60 mb-1.5">Bio</label>
        <textarea
          required
          rows={3}
          value={entry.bio}
          onChange={e => onChange(entry._key, 'bio', e.target.value)}
          className="admin-input w-full resize-none"
          placeholder="Character biography..."
        />
      </div>
    </div>
  );
}

// ── Bulk Add Modal ────────────────────────────────────────────────────────────

function BulkAddModal({
  open,
  onClose,
  onSave,
  isSaving,
  saveError,
  clanOptions,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (entries: CharacterFormData[]) => void;
  isSaving: boolean;
  saveError: string | null;
  clanOptions: { id: string; name: string }[];
}) {
  const [entries, setEntries] = useState<CharacterFormData[]>([makeEmptyEntry()]);

  if (!open) return null;

  const handleChange = (key: string, field: keyof CharacterFormData, value: string) => {
    setEntries(prev =>
      prev.map(e => (e._key === key ? { ...e, [field]: value } : e))
    );
  };

  const handleAddAnother = () => {
    setEntries(prev => [...prev, makeEmptyEntry()]);
  };

  const handleRemove = (key: string) => {
    setEntries(prev => prev.filter(e => e._key !== key));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entries);
  };

  const handleClose = () => {
    setEntries([makeEmptyEntry()]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-xl rounded-lg border border-moon-blue/20 flex flex-col max-h-[92vh]"
        style={{ background: 'rgba(13,13,26,0.97)', boxShadow: '0 0 40px rgba(79,195,247,0.1), 0 20px 60px rgba(0,0,0,0.8)' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-moon-blue/10 flex-shrink-0">
          <div>
            <h2 className="font-cinzel text-lg font-bold text-white">Add Characters</h2>
            <p className="font-rajdhani text-xs text-silver/40 mt-0.5 tracking-wide">
              {entries.length === 1 ? '1 character' : `${entries.length} characters`} to be added
            </p>
          </div>
          <button onClick={handleClose} className="text-silver/40 hover:text-silver transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
            {entries.map((entry, index) => (
              <CharacterEntryForm
                key={entry._key}
                entry={entry}
                index={index}
                total={entries.length}
                clanOptions={clanOptions}
                onChange={handleChange}
                onRemove={handleRemove}
              />
            ))}

            {/* Add another button */}
            <button
              type="button"
              onClick={handleAddAnother}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-dashed border-moon-blue/30 text-moon-blue/60 hover:text-moon-blue hover:border-moon-blue/60 hover:bg-moon-blue/5 font-rajdhani text-sm tracking-wider transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4" />
              Add Another Character
            </button>
          </div>

          {/* Error message */}
          {saveError && (
            <div className="mx-6 mb-2 flex items-start gap-2 rounded-md border border-crimson/30 bg-crimson/10 px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-crimson flex-shrink-0 mt-0.5" />
              <p className="font-rajdhani text-xs text-crimson leading-relaxed">{saveError}</p>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex gap-3 px-6 py-4 border-t border-moon-blue/10 flex-shrink-0">
            <button type="button" onClick={handleClose} className="flex-1 admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 admin-btn-primary flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save {entries.length > 1 ? `${entries.length} Characters` : 'Character'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Modal (single character) ────────────────────────────────────────────

type SingleCharacterFormData = Omit<CharacterFormData, '_key'>;

function EditModal({
  open,
  onClose,
  initial,
  onSave,
  isSaving,
  clanOptions,
}: {
  open: boolean;
  onClose: () => void;
  initial: SingleCharacterFormData;
  onSave: (data: SingleCharacterFormData) => void;
  isSaving: boolean;
  clanOptions: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<SingleCharacterFormData>(initial);

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
          <h2 className="font-cinzel text-lg font-bold text-white">Edit Character</h2>
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

// ── Main Panel ────────────────────────────────────────────────────────────────

export default function CharactersPanel() {
  const { data: characters = [], isLoading } = useGetAllCharacters();
  const { data: backendClans = [] } = useGetAllClans();
  const addCharacters = useAddCharacters();
  const updateCharacter = useUpdateCharacter();
  const deleteCharacter = useDeleteCharacter();

  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<SingleCharacterFormData>({
    id: '', name: '', clan: 'moon', role: '', bio: '', initials: '',
  });
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const openEdit = (char: Character) => {
    setEditingForm({
      id: char.id,
      name: char.name,
      clan: char.clan,
      role: char.role,
      bio: char.bio,
      initials: char.initials,
    });
    setEditModalOpen(true);
  };

  const handleBulkSave = (entries: CharacterFormData[]) => {
    setSaveError(null);
    const charactersList: Character[] = entries.map(e => ({
      id: e.id,
      name: e.name,
      clan: e.clan,
      role: e.role,
      bio: e.bio,
      initials: e.initials,
    }));
    addCharacters.mutate(charactersList, {
      onSuccess: () => {
        setBulkModalOpen(false);
        setSaveError(null);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setSaveError(msg || 'Failed to save characters. Please try again.');
      },
    });
  };

  const handleEditSave = (data: SingleCharacterFormData) => {
    const character: Character = {
      id: data.id,
      name: data.name,
      clan: data.clan,
      role: data.role,
      bio: data.bio,
      initials: data.initials,
    };
    updateCharacter.mutate(character, {
      onSuccess: () => setEditModalOpen(false),
    });
  };

  const handleDelete = (id: string) => {
    deleteCharacter.mutate(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-2xl font-bold text-white" style={{ textShadow: '0 0 15px rgba(79,195,247,0.3)' }}>
            Characters
          </h1>
          <p className="font-rajdhani text-sm text-silver/50 mt-1">Manage the cast of characters</p>
        </div>
        <button onClick={() => { setSaveError(null); setBulkModalOpen(true); }} className="admin-btn-primary flex items-center gap-2">
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

      {/* Bulk Add Modal */}
      <BulkAddModal
        open={bulkModalOpen}
        onClose={() => { setBulkModalOpen(false); setSaveError(null); }}
        onSave={handleBulkSave}
        isSaving={addCharacters.isPending}
        saveError={saveError}
        clanOptions={clanOptions}
      />

      {/* Edit Modal */}
      <EditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initial={editingForm}
        onSave={handleEditSave}
        isSaving={updateCharacter.isPending}
        clanOptions={clanOptions}
      />
    </div>
  );
}
