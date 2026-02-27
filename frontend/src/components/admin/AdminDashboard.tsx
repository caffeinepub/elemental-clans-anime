import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Film, Users, Newspaper, Image, Swords, LogOut, Menu, X, Moon, ChevronRight, Copy, Check, Mail, Heart } from 'lucide-react';
import EpisodesPanel from './panels/EpisodesPanel';
import CharactersPanel from './panels/CharactersPanel';
import NewsPanel from './panels/NewsPanel';
import GalleryPanel from './panels/GalleryPanel';
import ClansPanel from './panels/ClansPanel';
import ContactMessagesPanel from './panels/ContactMessagesPanel';
import FanMailPanel from './panels/FanMailPanel';
import { useGetContactMessages, useGetFanMailEntries } from '../../hooks/useQueries';
import { ContactStatus } from '../../backend';

type Section = 'episodes' | 'characters' | 'news' | 'gallery' | 'clans' | 'contactMessages' | 'fanMail';

function PrincipalCard({ principalId }: { principalId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(principalId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = principalId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="mb-3 rounded p-3"
      style={{
        background: 'rgba(79,195,247,0.05)',
        border: '1px solid rgba(79,195,247,0.2)',
        boxShadow: '0 0 12px rgba(79,195,247,0.08)',
      }}
    >
      <p className="font-rajdhani text-xs text-moon-blue/70 tracking-widest uppercase mb-1.5">
        Your Principal ID
      </p>
      <p className="font-rajdhani text-xs text-silver/70 break-all leading-relaxed mb-2">
        {principalId}
      </p>
      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-rajdhani tracking-wide transition-all duration-200 ${
          copied
            ? 'text-green-400 bg-green-400/10 border border-green-400/30'
            : 'text-moon-blue/80 hover:text-moon-blue bg-moon-blue/5 hover:bg-moon-blue/10 border border-moon-blue/20 hover:border-moon-blue/40'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Copy Principal ID</span>
          </>
        )}
      </button>
    </div>
  );
}

function NewBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-rajdhani font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
      {count}
    </span>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<Section>('episodes');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const { data: contactMessages } = useGetContactMessages();
  const { data: fanMailEntries } = useGetFanMailEntries();

  const newContactCount = contactMessages
    ? contactMessages.filter(m => m.status === ContactStatus.new_).length
    : 0;
  const newFanMailCount = fanMailEntries
    ? fanMailEntries.filter(e => e.status === ContactStatus.new_).length
    : 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  const principalId = identity?.getPrincipal().toString() ?? '';
  const principalShort = principalId ? principalId.slice(0, 12) + '...' : '';

  const renderPanel = () => {
    switch (activeSection) {
      case 'episodes': return <EpisodesPanel />;
      case 'characters': return <CharactersPanel />;
      case 'news': return <NewsPanel />;
      case 'gallery': return <GalleryPanel />;
      case 'clans': return <ClansPanel />;
      case 'contactMessages': return <ContactMessagesPanel />;
      case 'fanMail': return <FanMailPanel />;
    }
  };

  type NavItem = {
    id: Section;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  };

  const navItems: NavItem[] = [
    { id: 'episodes', label: 'Episodes', icon: <Film className="w-4 h-4" /> },
    { id: 'characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
    { id: 'news', label: 'News & Dev Log', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery', icon: <Image className="w-4 h-4" /> },
    { id: 'clans', label: 'Clans', icon: <Swords className="w-4 h-4" /> },
    { id: 'contactMessages', label: 'Contact Messages', icon: <Mail className="w-4 h-4" />, badge: newContactCount },
    { id: 'fanMail', label: 'Fan Mail', icon: <Heart className="w-4 h-4" />, badge: newFanMailCount },
  ];

  const activeLabel = navItems.find(n => n.id === activeSection)?.label ?? '';

  const renderNavItem = (item: NavItem, isMobile = false) => (
    <button
      key={item.id}
      onClick={() => handleNavClick(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-all duration-200 font-rajdhani text-sm tracking-wide ${
        activeSection === item.id
          ? 'text-moon-blue'
          : 'text-silver/60 hover:text-silver hover:bg-white/5'
      }`}
      style={
        activeSection === item.id
          ? {
              background: 'rgba(79,195,247,0.08)',
              border: '1px solid rgba(79,195,247,0.2)',
              boxShadow: '0 0 12px rgba(79,195,247,0.15)',
            }
          : { border: '1px solid transparent' }
      }
    >
      {item.icon}
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && <NewBadge count={item.badge} />}
      {!isMobile && activeSection === item.id && (!item.badge || item.badge === 0) && (
        <ChevronRight className="w-3 h-3 ml-auto" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-void text-foreground flex">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-moon-blue/10"
        style={{
          background: 'rgba(13,13,26,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-moon-blue/10">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-8 h-8 rounded-full border border-moon-blue/40 flex items-center justify-center flex-shrink-0"
              style={{ background: 'radial-gradient(circle, rgba(79,195,247,0.15) 0%, transparent 100%)', boxShadow: '0 0 10px rgba(79,195,247,0.2)' }}
            >
              <Moon className="w-4 h-4 text-moon-blue" />
            </div>
            <div>
              <p className="font-cinzel text-sm font-bold text-white leading-tight">Admin Portal</p>
              <p className="font-rajdhani text-xs text-moon-blue/60 tracking-widest uppercase">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => renderNavItem(item))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-moon-blue/10">
          {principalId && <PrincipalCard principalId={principalId} />}
          <div className="mb-3 px-2">
            <p className="font-rajdhani text-xs text-silver/30 tracking-widest uppercase mb-0.5">Logged in as</p>
            <p className="font-rajdhani text-xs text-silver/50 truncate">{principalShort}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded text-left font-rajdhani text-sm text-crimson/70 hover:text-crimson hover:bg-crimson/10 transition-all duration-200 border border-transparent hover:border-crimson/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-moon-blue/10"
        style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-moon-blue" />
          <span className="font-cinzel text-sm font-bold text-white">Admin</span>
          <span className="text-silver/30 mx-1">·</span>
          <span className="font-rajdhani text-sm text-moon-blue">{activeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {(newContactCount + newFanMailCount) > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-rajdhani font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {newContactCount + newFanMailCount}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(v => !v)}
            className="p-2 text-silver/60 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 pt-14">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div
            className="relative w-64 h-full flex flex-col border-r border-moon-blue/10"
            style={{ background: 'rgba(13,13,26,0.98)', backdropFilter: 'blur(20px)' }}
          >
            <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto">
              {navItems.map(item => renderNavItem(item, true))}
            </nav>
            <div className="p-4 border-t border-moon-blue/10">
              {principalId && <PrincipalCard principalId={principalId} />}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded text-left font-rajdhani text-sm text-crimson/70 hover:text-crimson hover:bg-crimson/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14 overflow-auto">
        <div className="p-6 lg:p-8">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
