import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const PORTAL_NAV = [
  { label: 'Home', to: '/portal' },
  { label: 'Announcements', to: '/portal/announcements' },
  { label: 'Events', to: '/portal/events' },
  { label: 'Building', to: '/portal/building' },
  { label: 'Documents', to: '/portal/documents' },
  { label: 'Directory', to: '/portal/directory' },
] as const;

function DemoBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-lake-deep px-4 py-2 text-center">
      <p className="eyebrow text-brass-on-dark">
        Demo portal — sample data only. Nothing here is real or saved to a server.
      </p>
    </div>
  );
}

export function PortalLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) =>
    to === '/portal'
      ? location.pathname === '/portal'
      : location.pathname.startsWith(to);

  const handleSignOut = () => {
    signOut();
    navigate('/portal/sign-in');
  };

  return (
    <div className="min-h-screen bg-cream">
      <DemoBanner />

      {/* Top bar */}
      <header className="fixed inset-x-0 top-9 z-40 border-b border-lake/10 bg-cream">
        <div className="container-wide flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="block w-28"
              aria-label="Lakeside Tower home"
            >
              <img
                src="/assets/images/logo-400.png"
                alt="The Lakeside Tower"
                className="h-auto w-full"
                width={200}
                height={50}
                loading="eager"
              />
            </a>
            <nav className="hidden items-center gap-5 md:flex" aria-label="Portal navigation">
              {PORTAL_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-[12px] font-semibold uppercase tracking-[0.12em] transition ${
                    isActive(item.to)
                      ? 'text-brass-on-light'
                      : 'text-lake/60 hover:text-lake'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {user && (
              <span className="flex min-w-0 items-baseline gap-1.5 text-[13px] text-lake/70">
                <span className="truncate font-semibold text-lake/80">{user.displayName}</span>
                <span className="shrink-0 text-[11px] text-lake/40">
                  {user.role === 'staff' && user.staffTitle
                    ? user.staffTitle
                    : user.unit}
                </span>
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.12em] text-lake/60 transition hover:text-lake"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Sign out
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-lake/10 bg-cream md:hidden">
            <nav
              className="container-wide flex flex-col gap-1 py-4"
              aria-label="Mobile portal navigation"
            >
              {PORTAL_NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 text-sm font-semibold uppercase tracking-[0.12em] ${
                    isActive(item.to)
                      ? 'text-brass-on-light'
                      : 'text-lake/60'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <div className="mt-3 border-t border-lake/10 pt-3">
                  <p className="text-[13px] text-lake/70">
                    {user.displayName} ·{' '}
                    {user.role === 'staff' && user.staffTitle
                      ? user.staffTitle
                      : user.unit}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-lake/60"
                  >
                    <LogOut size={14} strokeWidth={1.5} />
                    Sign out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main id="main" className="pt-32">
        {children}
      </main>
    </div>
  );
}
