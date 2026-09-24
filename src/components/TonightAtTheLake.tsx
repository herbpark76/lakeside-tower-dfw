import { useState, useEffect, useMemo } from 'react';
import { Sun } from 'lucide-react';
import * as SunCalc from 'suncalc';

const LAT = 32.98822;
const LON = -97.06793;
const TIMEZONE = 'America/Chicago';

interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  sunsetCloudCover: number | null;
}

interface SunPhase {
  phase: 'pre_dawn' | 'before_golden' | 'golden' | 'afterglow' | 'night';
  headline: string;
  subline: string;
  sunsetTime: Date | null;
  sunriseTime: Date | null;
  duskTime: Date | null;
}

const WMO_CONDITIONS: Record<number, string> = {
  0: 'Clear',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  56: 'Freezing drizzle',
  57: 'Freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE,
  });
}

function getChicagoDateParts(now: Date) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? '0');
  return { year: get('year'), month: get('month'), day: get('day') };
}

function getSunTimesForChicagoDate(now: Date): SunCalc.GetTimesResult {
  const { year, month, day } = getChicagoDateParts(now);
  const dateForCalc = new Date(year, month - 1, day, 12, 0, 0);
  return SunCalc.getTimes(dateForCalc, LAT, LON);
}

function getSunPhase(now: Date, sunTimes: SunCalc.GetTimesResult): SunPhase {
  const sunset = sunTimes.sunset ?? null;
  const dusk = sunTimes.dusk ?? null;
  const sunrise = sunTimes.sunrise ?? null;

  const goldenStart = sunset ? new Date(sunset.getTime() - 60 * 60 * 1000) : null;

  // Pre-dawn: between midnight and today's sunrise
  if (sunrise && now < sunrise) {
    return {
      phase: 'pre_dawn',
      headline: `Sunrise at ${formatTime(sunrise)}`,
      subline: '',
      sunsetTime: sunset,
      sunriseTime: sunrise,
      duskTime: dusk,
    };
  }

  // Before golden hour (after sunrise, before golden hour starts)
  if (goldenStart && now < goldenStart) {
    const diff = sunset!.getTime() - now.getTime();
    return {
      phase: 'before_golden',
      headline: `Sunset at ${formatTime(sunset!)}`,
      subline: `in ${formatDuration(diff)}`,
      sunsetTime: sunset,
      sunriseTime: sunrise,
      duskTime: dusk,
    };
  }

  // During golden hour
  if (goldenStart && sunset && now >= goldenStart && now < sunset) {
    const diff = sunset.getTime() - now.getTime();
    return {
      phase: 'golden',
      headline: 'Golden hour',
      subline: `Sunset at ${formatTime(sunset)} \u00b7 in ${formatDuration(diff)}`,
      sunsetTime: sunset,
      sunriseTime: sunrise,
      duskTime: dusk,
    };
  }

  // Afterglow: sunset to dusk
  if (sunset && dusk && now >= sunset && now < dusk) {
    return {
      phase: 'afterglow',
      headline: 'The sun has just set',
      subline: `Afterglow until ${formatTime(dusk)}`,
      sunsetTime: sunset,
      sunriseTime: sunrise,
      duskTime: dusk,
    };
  }

  // Night: after dusk until midnight — show tomorrow's sunrise
  const chicagoParts = getChicagoDateParts(now);
  const tomorrowDate = new Date(chicagoParts.year, chicagoParts.month - 1, chicagoParts.day + 1, 12, 0, 0);
  const tomorrowTimes = SunCalc.getTimes(tomorrowDate, LAT, LON);
  const tomorrowSunrise = tomorrowTimes.sunrise ?? null;

  if (tomorrowSunrise) {
    return {
      phase: 'night',
      headline: `Tomorrow's sunrise at ${formatTime(tomorrowSunrise)}`,
      subline: '',
      sunsetTime: sunset,
      sunriseTime: tomorrowSunrise,
      duskTime: dusk,
    };
  }

  return {
    phase: 'night',
    headline: '',
    subline: '',
    sunsetTime: sunset,
    sunriseTime: null,
    duskTime: dusk,
  };
}

function formatDuration(ms: number): string {
  if (ms <= 0) return '0 minutes';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  if (minutes === 0) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${hours} hour${hours === 1 ? '' : 's'} ${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function getSunsetOutlook(cloudCover: number | null): string | null {
  if (cloudCover === null) return null;
  if (cloudCover >= 90) return 'Overcast \u2014 a quiet evening';
  if (cloudCover >= 70) return 'Heavy clouds \u2014 color is possible, but less likely';
  if (cloudCover >= 20) return 'Scattered clouds \u2014 could be a colorful one';
  return 'Clear skies \u2014 a clean, simple sunset';
}

async function fetchWeather(sunsetDate: Date | null): Promise<WeatherData | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&hourly=cloud_cover` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph` +
      `&timezone=${TIMEZONE}&forecast_days=2`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const temperature = Math.round(data.current?.temperature_2m ?? 0);
    const weatherCode = data.current?.weather_code ?? 0;
    const windSpeed = Math.round(data.current?.wind_speed_10m ?? 0);
    const condition = WMO_CONDITIONS[weatherCode] ?? 'Clear';

    // Find hourly cloud_cover closest to sunset time
    let sunsetCloudCover: number | null = null;
    if (sunsetDate && data.hourly?.time && data.hourly?.cloud_cover) {
      const sunsetMs = sunsetDate.getTime();
      let bestDiff = Infinity;
      let bestIdx = 0;
      for (let i = 0; i < data.hourly.time.length; i++) {
        const hourMs = new Date(data.hourly.time[i]).getTime();
        const diff = Math.abs(hourMs - sunsetMs);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = i;
        }
      }
      sunsetCloudCover = data.hourly.cloud_cover[bestIdx] ?? null;
    }

    return { temperature, condition, windSpeed, sunsetCloudCover };
  } catch {
    return null;
  }
}

function useSunPhase(now: Date) {
  return useMemo(() => {
    const sunTimes = getSunTimesForChicagoDate(now);
    return getSunPhase(now, sunTimes);
  }, [now]);
}

export function TonightAtTheLake() {
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherVisible, setWeatherVisible] = useState(false);

  const sunPhase = useSunPhase(now);

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather on mount and every 15 minutes
  useEffect(() => {
    let mounted = true;
    let interval: ReturnType<typeof setInterval>;

    const load = async () => {
      const data = await fetchWeather(sunPhase.sunsetTime);
      if (!mounted) return;
      setWeather(data);
      // Small delay for fade-in
      requestAnimationFrame(() => {
        if (mounted) setWeatherVisible(true);
      });
    };

    load();
    interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunPhase.sunsetTime?.getTime()]);

  const outlook = useMemo(() => {
    if (!weather || weather.sunsetCloudCover === null) return null;
    if (sunPhase.phase === 'pre_dawn' || sunPhase.phase === 'afterglow' || sunPhase.phase === 'night') return null;
    return getSunsetOutlook(weather.sunsetCloudCover);
  }, [weather, sunPhase.phase]);

  if (!sunPhase.headline) return null;

  return (
    <section className="bg-cream border-b border-lake/5 py-10 sm:py-12">
      <div className="container-wide">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
          {/* Eyebrow + icon */}
          <div className="flex items-center gap-3 shrink-0">
            <Sun size={16} strokeWidth={1.5} className="text-brass-on-light" />
            <p className="eyebrow text-brass-on-light">Tonight at the lake</p>
          </div>

          {/* Main sun line */}
          <div className="shrink-0">
            <p className="serif text-2xl text-lake leading-tight sm:text-3xl">
              {sunPhase.headline}
            </p>
            {sunPhase.subline && (
              <p className="mt-1 text-[15px] text-muted">
                {sunPhase.subline}
              </p>
            )}
          </div>

          {/* Conditions + outlook — fade in when weather arrives */}
          <div
            className="sm:ml-auto transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ opacity: weatherVisible ? 1 : 0 }}
          >
            {weather && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[15px] text-lake/70">
                  {weather.temperature}&deg; &middot; {weather.condition} &middot; Wind {weather.windSpeed} mph
                </p>
                {outlook && (
                  <p className="text-[14px] text-muted">{outlook}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TonightAtTheLake;
