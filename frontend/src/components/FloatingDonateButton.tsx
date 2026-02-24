import React from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function FloatingDonateButton() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on /donate and /admin routes
  if (pathname === '/donate' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <button
      onClick={() => navigate({ to: '/donate' })}
      className="donate-float-btn"
      aria-label="Donate to support the project"
    >
      <Heart size={16} fill="white" className="shrink-0" />
      <span>Donate</span>
    </button>
  );
}
