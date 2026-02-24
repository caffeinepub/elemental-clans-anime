import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRouter,
  createRootRoute,
  createRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Clans from './components/Clans';
import WorldMap from './components/WorldMap';
import Characters from './components/Characters';
import Episodes from './components/Episodes';
import Gallery from './components/Gallery';
import News from './components/News';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import FloatingDonateButton from './components/FloatingDonateButton';
import Admin from './pages/Admin';
import Donation from './pages/Donation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// ── Layout (root) ─────────────────────────────────────────────────────────────
function RootLayout() {
  return (
    <>
      <Outlet />
      <FloatingDonateButton />
    </>
  );
}

// ── Homepage ──────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Clans />
        <WorldMap />
        <Episodes />
        <Characters />
        <Gallery />
        <News />
      </main>
      <Footer />
    </>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: Admin,
});

const donateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/donate',
  component: Donation,
});

const routeTree = rootRoute.addChildren([indexRoute, adminRoute, donateRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
