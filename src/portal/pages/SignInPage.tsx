import { useNavigate } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import { useAuth } from '../auth/AuthContext';
import { ArrowRight } from 'lucide-react';

export function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (role: 'owner' | 'board') => {
    signIn(role);
    navigate('/portal');
  };

  return (
    <>
      <Head>
        <title>Owner Portal | Lakeside Tower</title>
        <meta name="description" content="Demo owner portal for Lakeside Tower." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-lake-deep px-6 text-center">
        <a href="/" className="mb-12 block w-44 brightness-0 invert" aria-label="Lakeside Tower home">
          <img
            src="/assets/images/logo-400.png"
            alt="The Lakeside Tower"
            className="h-auto w-full"
            width={200}
            height={50}
            loading="eager"
          />
        </a>
        <p className="eyebrow mb-6 text-brass-on-dark">Owner Portal</p>
        <h1 className="display-4 serif text-cream">
          Welcome to the<br />
          <em className="font-medium">demo portal.</em>
        </h1>
        <p className="body-text mt-8 max-w-md text-cream/60">
          This is a demo with sample data only. Nothing here is real or saved to a server. Choose a role to continue.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => handleSignIn('owner')}
            className="inline-flex items-center gap-3 bg-brass px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-lake-deep transition hover:brightness-110"
          >
            Continue as demo owner
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => handleSignIn('board')}
            className="inline-flex items-center gap-3 border border-cream/30 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.14em] text-cream transition hover:border-brass hover:text-brass-on-dark"
          >
            Continue as demo board member
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
