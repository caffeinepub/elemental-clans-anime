import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminLogin from './AdminLogin';
import AdminDashboard from '../components/admin/AdminDashboard';
import AccessDenied from '../components/admin/AccessDenied';

export default function Admin() {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Show spinner while identity is initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-moon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-rajdhani text-silver/60 tracking-widest uppercase text-sm">Initializing...</p>
        </div>
      </div>
    );
  }

  // Not logged in — show login screen
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Logged in but still checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-moon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-rajdhani text-silver/60 tracking-widest uppercase text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Logged in but not an admin — show access denied
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Authenticated admin — show dashboard
  return <AdminDashboard />;
}
