import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef } from 'react';
import {
  mapPlaces,
  towerPlace,
  allPlaces,
  towerLocation,
  type MapPlace,
  type Category,
} from '@/data/lakesideMap';

function createTowerIcon() {
  return L.divIcon({
    className: 'tower-pin',
    html: `<div class="tower-pin-inner"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="2" width="6" height="16" rx="1" fill="currentColor"/><rect x="5" y="6" width="10" height="2" fill="currentColor" opacity="0.6"/><rect x="5" y="10" width="10" height="2" fill="currentColor" opacity="0.6"/><rect x="5" y="14" width="10" height="2" fill="currentColor" opacity="0.6"/></svg></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function createBuildingIcon(active: boolean) {
  const size = active ? 14 : 12;
  return L.divIcon({
    className: 'building-pin',
    html: `<div class="building-pin-dot${active ? ' building-pin-dot--active' : ''}" style="width:${size}px;height:${size}px"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

function FitBounds({ places }: { places: MapPlace[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    const bounds = L.latLngBounds(
      places.map((p) => [p.lat, p.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, places]);
  return null;
}

function PanToPlace({ place }: { place: MapPlace | null }) {
  const map = useMap();
  useEffect(() => {
    if (!place) return;
    map.flyTo([place.lat, place.lng], 17, { duration: 0.8 });
  }, [map, place]);
  return null;
}

function MapControls({
  scrollZoomRef,
}: {
  scrollZoomRef: React.MutableRefObject<boolean>;
}) {
  const map = useMap();
  useEffect(() => {
    const enableScrollZoom = () => {
      if (!scrollZoomRef.current) {
        map.scrollWheelZoom.enable();
        scrollZoomRef.current = true;
      }
    };
    map.on('click', enableScrollZoom);
    return () => {
      map.off('click', enableScrollZoom);
    };
  }, [map, scrollZoomRef]);
  return null;
}

function directionsUrl(place: MapPlace) {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    towerLocation.address
  )}&destination=${encodeURIComponent(place.address)}&travelmode=walking`;
}

export function WalkabilityMapInner({
  activeFilter,
  focusPlace,
}: {
  activeFilter: 'All' | Category;
  focusPlace: MapPlace | null;
}) {
  const scrollZoomRef = useRef(false);

  const visiblePlaces = useMemo(() => {
    if (activeFilter === 'All') return mapPlaces;
    return mapPlaces.filter((p) =>
      p.businesses.some((b) => b.category === activeFilter)
    );
  }, [activeFilter]);

  return (
    <MapContainer
      center={[32.992, -97.066]}
      zoom={15}
      scrollWheelZoom={false}
      className="walkability-map"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBounds places={allPlaces} />
      <PanToPlace place={focusPlace} />
      <MapControls scrollZoomRef={scrollZoomRef} />

      <Marker
        position={[towerPlace.lat, towerPlace.lng]}
        icon={createTowerIcon()}
        zIndexOffset={-1000}
      >
        <Popup>
          <div className="map-popup">
            <p className="map-popup-headline">Lakeside Tower</p>
            <p className="map-popup-sub">2800 Lakeside Pkwy</p>
          </div>
        </Popup>
      </Marker>

      {mapPlaces.map((place) => {
        const isVisible = visiblePlaces.some((p) => p.id === place.id);
        const filteredBusinesses =
          activeFilter === 'All'
            ? place.businesses
            : place.businesses.filter((b) => b.category === activeFilter);

        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createBuildingIcon(isVisible)}
            opacity={isVisible ? 1 : 0.2}
          >
            <Popup>
              <div className="map-popup">
                <p className="map-popup-headline">{place.walkMinutes} min walk</p>
                <p className="map-popup-sub">{place.label}</p>
                {place.note && (
                  <p className="map-popup-note">{place.note}</p>
                )}
                <ul className="map-popup-list">
                  {filteredBusinesses.map((b) => (
                    <li key={b.name}>
                      <span className="map-popup-biz-name">{b.name}</span>
                      <span className="map-popup-biz-cat">{b.category}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={directionsUrl(place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-popup-directions"
                >
                  Directions
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default WalkabilityMapInner;
