import { Head } from 'vite-react-ssg';
import { PortalLayout } from '../components/PortalLayout';

interface PlaceholderProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderProps) {
  return (
    <>
      <Head>
        <title>{title} | Owner Portal | Lakeside Tower</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PortalLayout>
        <div className="container-wide py-20 text-center">
          <p className="eyebrow text-brass-on-light">Owner Portal</p>
          <h1 className="display-4 serif mt-4 text-lake">{title}</h1>
          <p className="body-text mx-auto mt-6 max-w-md text-lake/60">
            {description}
          </p>
          <p className="eyebrow mt-8 text-lake/30">Coming next</p>
        </div>
      </PortalLayout>
    </>
  );
}

export function EventsPage() {
  return (
    <PlaceholderPage
      title="Events"
      description="A calendar of upcoming gatherings, meetings, and social occasions at the Tower. This section is coming next."
    />
  );
}

export function DocumentsPage() {
  return (
    <PlaceholderPage
      title="Documents"
      description="Association documents, meeting minutes, and reference materials in one place. This section is coming next."
    />
  );
}

export function DirectoryPage() {
  return (
    <PlaceholderPage
      title="Directory"
      description="A private directory of owners, residents, and board contacts for the community. This section is coming next."
    />
  );
}
