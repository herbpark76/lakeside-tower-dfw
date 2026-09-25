import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  mapPlaces,
  filterCategories,
  type MapPlace,
  type Category,
} from '@/data/lakesideMap';
import { useReveal } from '@/hooks/useReveal';

const WalkabilityMapInner = lazy(() =>
  import('@/components/WalkabilityMapInner').then((m) => ({
    default: m.WalkabilityMapInner,
  }))
);

export function WalkabilitySection() {
  const [activeFilter, setActiveFilter] = useState<'All' | Category>('All');
  const [mounted, setMounted] = useState(false);
  const [focusPlace, setFocusPlace] = useState<MapPlace | null>(null);

  const headerRef = useReveal<HTMLDivElement>();
  const mapRef = useReveal<HTMLDivElement>();
  const listRef = useReveal<HTMLDivElement>();

  useEffect(() => {
    setMounted(true);
  }, []);

  const placesByWalkTime = useMemo(() => {
    const groups: Record<number, MapPlace[]> = {};
    for (const place of mapPlaces) {
      if (!groups[place.walkMinutes]) groups[place.walkMinutes] = [];
      groups[place.walkMinutes].push(place);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([minutes, places]) => ({ minutes: parseInt(minutes), places }));
  }, []);

  const handleListClick = (place: MapPlace) => {
    setFocusPlace({ ...place, _ts: Date.now() } as MapPlace & { _ts: number });
    const mapElement = document.querySelector('.walkability-map-wrapper');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="bg-cream section-pad">
      <div className="container-wide">
        <div ref={headerRef} data-reveal className="mb-10 max-w-2xl">
          <p className="eyebrow text-brass-on-light">Walkability</p>
          <h2 className="display-4 serif mt-6 text-lake">
            Everything within<br />
            <em className="font-medium">a short walk.</em>
          </h2>
        </div>

        <div ref={mapRef} data-reveal>
          <div className="flex flex-wrap gap-2 mb-6">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`walkability-pill ${activeFilter === cat ? 'walkability-pill--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="walkability-map-wrapper">
            {mounted && (
              <Suspense fallback={<div className="walkability-map-placeholder" />}>
                <WalkabilityMapInner
                  activeFilter={activeFilter}
                  focusPlace={focusPlace}
                />
              </Suspense>
            )}
            {!mounted && (
              <div className="walkability-map-placeholder" />
            )}
          </div>
        </div>

        <div ref={listRef} data-reveal className="mt-12">
          <p className="eyebrow text-brass-on-light mb-6">By walking time</p>
          <div className="grid gap-8 sm:grid-cols-2">
            {placesByWalkTime.map(({ minutes, places }) => (
              <div key={minutes}>
                <p className="serif text-lg text-lake mb-3">
                  {minutes} {minutes === 1 ? 'minute' : 'minutes'}
                </p>
                <ul className="space-y-2">
                  {places.map((place) => {
                    const filteredBusinesses =
                      activeFilter === 'All'
                        ? place.businesses
                        : place.businesses.filter(
                            (b) => b.category === activeFilter
                          );
                    if (filteredBusinesses.length === 0) return null;
                    return filteredBusinesses.map((b) => (
                      <li key={`${place.id}-${b.name}`}>
                        <button
                          onClick={() => handleListClick(place)}
                          className="walkability-list-item"
                        >
                          <span className="walkability-list-name">{b.name}</span>
                          <span className="walkability-list-cat">{b.category}</span>
                        </button>
                      </li>
                    ));
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WalkabilitySection;
