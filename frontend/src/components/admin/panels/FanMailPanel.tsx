import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, AtSign, Loader2, AlertCircle, Heart } from 'lucide-react';
import { ContactStatus } from '../../../backend';
import {
  useGetFanMailEntries,
  useUpdateFanMailStatus,
  useDeleteFanMailEntry,
} from '../../../hooks/useQueries';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ms));
}

function StatusBadge({ status }: { status: ContactStatus }) {
  const config = {
    [ContactStatus.new_]: {
      label: 'New',
      className: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    [ContactStatus.read]: {
      label: 'Read',
      className: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    },
    [ContactStatus.replied]: {
      label: 'Replied',
      className: 'bg-green-500/15 text-green-400 border border-green-500/30',
    },
  };

  const { label, className } = config[status] ?? config[ContactStatus.new_];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-rajdhani font-semibold tracking-wide ${className}`}>
      {label}
    </span>
  );
}

function StatusSelector({
  currentStatus,
  entryIndex,
}: {
  currentStatus: ContactStatus;
  entryIndex: number;
}) {
  const updateStatus = useUpdateFanMailStatus();

  const statuses: { value: ContactStatus; label: string }[] = [
    { value: ContactStatus.new_, label: 'New' },
    { value: ContactStatus.read, label: 'Read' },
    { value: ContactStatus.replied, label: 'Replied' },
  ];

  return (
    <div className="flex items-center gap-1">
      {statuses.map(({ value, label }) => (
        <button
          key={value}
          disabled={currentStatus === value || updateStatus.isPending}
          onClick={() => updateStatus.mutate({ id: entryIndex, status: value })}
          className={`px-2 py-1 rounded text-xs font-rajdhani tracking-wide transition-all duration-150 disabled:cursor-not-allowed ${
            currentStatus === value
              ? value === ContactStatus.new_
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : value === ContactStatus.read
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-green-500/20 text-green-400 border border-green-500/40'
            : 'text-silver/40 border border-white/10 hover:text-silver/70 hover:border-white/20'
          }`}
        >
          {updateStatus.isPending && updateStatus.variables?.id === entryIndex && updateStatus.variables?.status === value ? (
            <Loader2 className="w-3 h-3 animate-spin inline" />
          ) : (
            label
          )}
        </button>
      ))}
    </div>
  );
}

function FanMailRow({
  entry,
  index,
}: {
  entry: {
    username: string;
    message: string;
    submittedAt: bigint;
    emailOrSocial?: string;
    status: ContactStatus;
  };
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const deleteEntry = useDeleteFanMailEntry();

  const isLong = entry.message.length > 120;
  const displayMessage = expanded || !isLong ? entry.message : entry.message.slice(0, 120) + '…';

  return (
    <div
      className="rounded-lg p-4 transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-cinzel text-sm font-semibold text-white truncate">{entry.username}</span>
            <StatusBadge status={entry.status} />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-rajdhani text-silver/50">
            {entry.emailOrSocial ? (
              <span className="flex items-center gap-1">
                <AtSign className="w-3 h-3" />
                {entry.emailOrSocial}
              </span>
            ) : (
              <span className="text-silver/30">No contact info</span>
            )}
            <span>{formatDate(entry.submittedAt)}</span>
          </div>
        </div>

        {/* Delete button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={deleteEntry.isPending}
              className="p-1.5 rounded text-silver/30 hover:text-crimson hover:bg-crimson/10 border border-transparent hover:border-crimson/20 transition-all duration-150 flex-shrink-0"
              title="Delete fan mail"
            >
              {deleteEntry.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent
            style={{ background: 'rgba(13,13,26,0.98)', border: '1px solid rgba(79,195,247,0.2)' }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-cinzel text-white">Delete Fan Mail?</AlertDialogTitle>
              <AlertDialogDescription className="font-rajdhani text-silver/60">
                This will permanently delete the fan mail from <strong className="text-silver/80">{entry.username}</strong>. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-rajdhani">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteEntry.mutate(index)}
                className="font-rajdhani bg-crimson/80 hover:bg-crimson text-white border-0"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Message body */}
      <p className="font-rajdhani text-sm text-silver/70 leading-relaxed mb-3 whitespace-pre-wrap">
        {displayMessage}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs font-rajdhani text-moon-blue/70 hover:text-moon-blue transition-colors mb-3"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}

      {/* Status selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-rajdhani text-silver/40 tracking-wide">Status:</span>
        <StatusSelector currentStatus={entry.status} entryIndex={index} />
      </div>
    </div>
  );
}

export default function FanMailPanel() {
  const { data: entries, isLoading, isError } = useGetFanMailEntries();

  const sorted = entries
    ? [...entries]
        .map((e, i) => ({ ...e, _index: i }))
        .sort((a, b) => Number(b.submittedAt - a.submittedAt))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-moon-blue animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="w-8 h-8 text-crimson/70" />
        <p className="font-rajdhani text-silver/50">Failed to load fan mail entries.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-white mb-1">Fan Mail</h2>
          <p className="font-rajdhani text-sm text-silver/50">
            {sorted.length} entr{sorted.length !== 1 ? 'ies' : 'y'} total
            {sorted.filter(e => e.status === ContactStatus.new_).length > 0 && (
              <span className="ml-2 text-amber-400">
                · {sorted.filter(e => e.status === ContactStatus.new_).length} new
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(79,195,247,0.08)', border: '1px solid rgba(79,195,247,0.15)' }}
          >
            <Heart className="w-7 h-7 text-moon-blue/50" />
          </div>
          <p className="font-cinzel text-silver/40 text-sm">No fan mail yet</p>
          <p className="font-rajdhani text-silver/30 text-xs">Fan mail submitted via the Contact page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(entry => (
            <FanMailRow key={entry._index} entry={entry} index={entry._index} />
          ))}
        </div>
      )}
    </div>
  );
}
