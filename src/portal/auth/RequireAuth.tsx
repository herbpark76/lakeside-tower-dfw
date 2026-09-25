import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lake-deep">
        <p className="eyebrow text-brass-on-dark">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/portal/sign-in" replace />;
  }

  return <>{children}</>;
}
