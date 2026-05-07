import type { DayWeather, WeatherType } from '../data/mockData';

const BUSAN_LAT = 35.18;
const BUSAN_LON = 129.08;

const TRIP_DATES = ['2026-06-10', '2026-06-11', '2026-06-12', '2026-06-13', '2026-06-14'];
const WEEKDAYS_ZH = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

function wmoToType(code: number): WeatherType {
  if (code === 0) return 'sunny';
  if (code <= 2) return 'partlysunny';
  if (code <= 3 || code === 45 || code === 48) return 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
  if (code >= 95) return 'heavyrain';
  return 'cloudy';
}

function wmoToDesc(code: number, rainProb: number): string {
  if (code === 0) return '晴空萬里，陽光充足';
  if (code === 1) return '大致晴朗';
  if (code === 2) return '晴時多雲';
  if (code === 3) return '多雲，陽光偶爾露臉';
  if (code === 45 || code === 48) return '有霧，注意能見度';
  if (code >= 51 && code <= 55) return '毛毛雨，可備傘';
  if (code >= 56 && code <= 57) return '凍雨，路面濕滑';
  if (code >= 61 && code <= 65) return '有雨，出門記得帶傘';
  if (code >= 80 && code <= 82) return rainProb >= 70 ? '陣雨，建議備雨衣' : '偶有陣雨，可備傘';
  if (code === 95) return '雷陣雨，儘量室內活動';
  if (code >= 96) return '強烈雷雨，避免戶外活動';
  return '天氣多變，留意最新預報';
}

function tempToOutfit(maxTemp: number, rainProb: number): string {
  if (rainProb >= 80) return '全套雨具必備';
  if (rainProb >= 60) return '雨衣＋防水鞋';
  if (maxTemp >= 30) return '短袖＋防曬必備';
  if (maxTemp >= 25) return '短袖＋薄外套';
  if (maxTemp >= 20) return '長袖薄外套';
  return '外套＋長褲';
}

export interface WeatherFetchResult {
  days: DayWeather[];
  isReal: boolean;
  daysUntilForecast: number | null; // null = data is available
}

export async function fetchBusanWeather(): Promise<WeatherFetchResult | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(BUSAN_LAT));
    url.searchParams.set('longitude', String(BUSAN_LON));
    url.searchParams.set('daily', 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
    url.searchParams.set('timezone', 'Asia/Seoul');
    url.searchParams.set('forecast_days', '16');

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = await res.json();
    const times: string[]  = data.daily.time;
    const codes: number[]  = data.daily.weathercode;
    const maxTs: number[]  = data.daily.temperature_2m_max;
    const minTs: number[]  = data.daily.temperature_2m_min;
    const rains: number[]  = data.daily.precipitation_probability_max;

    // Check if trip start date is within forecast window
    const tripStartIdx = times.indexOf(TRIP_DATES[0]);
    if (tripStartIdx === -1) {
      // Calculate how many days until the trip enters the 16-day window
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tripStart = new Date(TRIP_DATES[0] + 'T00:00:00');
      const diff = Math.ceil((tripStart.getTime() - today.getTime()) / 86400000) - 15;
      return { days: [], isReal: false, daysUntilForecast: Math.max(0, diff) };
    }

    const days: DayWeather[] = [];
    for (const dateStr of TRIP_DATES) {
      const idx = times.indexOf(dateStr);
      if (idx === -1) break;

      const d = new Date(dateStr + 'T00:00:00');
      const code  = codes[idx] ?? 0;
      const maxT  = Math.round(maxTs[idx] ?? 25);
      const minT  = Math.round(minTs[idx] ?? 18);
      const rain  = rains[idx] ?? 0;

      days.push({
        day:    WEEKDAYS_ZH[d.getDay()],
        date:   d.getDate(),
        type:   wmoToType(code),
        temp:   `${maxT}°`,
        range:  `/ ${minT}°C`,
        desc:   wmoToDesc(code, rain),
        rain:   `降雨 ${rain}%`,
        outfit: tempToOutfit(maxT, rain),
      });
    }

    return { days, isReal: true, daysUntilForecast: null };
  } catch {
    return null;
  }
}
