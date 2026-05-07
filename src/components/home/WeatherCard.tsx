import { useState, useEffect } from 'react';
import { WEATHER_DAYS, WeatherType, DayWeather } from '../../data/mockData';
import { fetchBusanWeather } from '../../lib/weather';

/* ── iOS 線條風格 SVG 天氣圖示 ── */
const WeatherIcon = ({ type }: { type: WeatherType }) => {
  const shared = { fill: 'none' as const, xmlns: 'http://www.w3.org/2000/svg' };

  if (type === 'sunny') return (
    <svg viewBox="0 0 56 56" {...shared}>
      <circle cx={28} cy={28} r={11} stroke="#F59E0B" strokeWidth={2.5} />
      <g stroke="#F59E0B" strokeWidth={2.5} strokeLinecap="round">
        <line x1={28} y1={6}    x2={28} y2={13}   />
        <line x1={28} y1={43}   x2={28} y2={50}   />
        <line x1={6}  y1={28}   x2={13} y2={28}   />
        <line x1={43} y1={28}   x2={50} y2={28}   />
        <line x1={12.1} y1={12.1} x2={17.1} y2={17.1} />
        <line x1={38.9} y1={38.9} x2={43.9} y2={43.9} />
        <line x1={43.9} y1={12.1} x2={38.9} y2={17.1} />
        <line x1={17.1} y1={38.9} x2={12.1} y2={43.9} />
      </g>
    </svg>
  );

  if (type === 'partlysunny') return (
    <svg viewBox="0 0 56 56" {...shared}>
      <circle cx={18} cy={18} r={7} stroke="#F59E0B" strokeWidth={2} />
      <g stroke="#F59E0B" strokeWidth={2} strokeLinecap="round">
        <line x1={18} y1={5}    x2={18} y2={9}    />
        <line x1={18} y1={27}   x2={18} y2={31}   />
        <line x1={5}  y1={18}   x2={9}  y2={18}   />
        <line x1={27} y1={18}   x2={31} y2={18}   />
        <line x1={8.1}  y1={8.1}  x2={10.9} y2={10.9} />
        <line x1={25.1} y1={25.1} x2={27.9} y2={27.9} />
        <line x1={27.9} y1={8.1}  x2={25.1} y2={10.9} />
        <line x1={10.9} y1={25.1} x2={8.1}  y2={27.9} />
      </g>
      <path
        d="M22 47 Q21 41 27 40 Q28 35 35 35 Q41 33 43 39 Q48 38 49 43 Q50 48 45 49 L26 49 Q22 49 22 47 Z"
        stroke="#9CA3AF" strokeWidth={2.2} strokeLinejoin="round"
      />
    </svg>
  );

  if (type === 'cloudy') return (
    <svg viewBox="0 0 56 56" {...shared}>
      <path
        d="M 8 40 Q 8 34 14 33 A 9 9 0 0 1 22 22 A 13 13 0 0 1 39 25 A 8 8 0 0 1 48 34 Q 49 42 43 43 L 14 43 Q 8 43 8 40 Z"
        stroke="#6B7280" strokeWidth={2.5} strokeLinejoin="round"
      />
    </svg>
  );

  if (type === 'rainy') return (
    <svg viewBox="0 0 56 56" {...shared}>
      <path
        d="M 8 34 Q 8 28 14 27 A 9 9 0 0 1 22 17 A 13 13 0 0 1 39 20 A 8 8 0 0 1 48 29 Q 49 37 43 38 L 14 38 Q 8 38 8 34 Z"
        stroke="#3B82F6" strokeWidth={2.5} strokeLinejoin="round"
      />
      <g stroke="#3B82F6" strokeWidth={2.2} strokeLinecap="round">
        <line x1={20} y1={43} x2={17} y2={52} />
        <line x1={28} y1={43} x2={25} y2={52} />
        <line x1={36} y1={43} x2={33} y2={52} />
      </g>
    </svg>
  );

  /* heavyrain */
  return (
    <svg viewBox="0 0 56 56" {...shared}>
      <path
        d="M 6 30 Q 6 23 13 22 A 10 10 0 0 1 22 12 A 14 14 0 0 1 40 15 A 9 9 0 0 1 50 25 Q 51 34 44 35 L 12 35 Q 6 35 6 30 Z"
        stroke="#2563EB" strokeWidth={2.5} strokeLinejoin="round"
      />
      <g stroke="#2563EB" strokeWidth={2.2} strokeLinecap="round">
        <line x1={15} y1={40} x2={12} y2={50} />
        <line x1={23} y1={40} x2={20} y2={50} />
        <line x1={31} y1={40} x2={28} y2={50} />
        <line x1={39} y1={40} x2={36} y2={50} />
      </g>
      <g stroke="#2563EB" strokeWidth={1.6} strokeLinecap="round" opacity={0.5}>
        <line x1={19} y1={45} x2={17} y2={53} />
        <line x1={27} y1={45} x2={25} y2={53} />
        <line x1={35} y1={45} x2={33} y2={53} />
      </g>
    </svg>
  );
};

/* ── Chip 小圖示 ── */
const DropIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width={13} height={13}>
    <path d="M8 2 C8 2 3.5 7.5 3.5 10.5 a4.5 4.5 0 0 0 9 0 C12.5 7.5 8 2 8 2z"
      stroke="#2563A8" strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);

const ShirtIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width={13} height={13}>
    <path d="M5 2 L2 5 L5 6 L5 14 L11 14 L11 6 L14 5 L11 2 L9 4 L7 4 Z"
      stroke="#5E35A8" strokeWidth={1.3} strokeLinejoin="round" />
  </svg>
);

/* ── Main Component ── */
interface WeatherCardProps {
  activeIdx: number;
  onDayChange: (idx: number) => void;
}

const WeatherCard = ({ activeIdx, onDayChange }: WeatherCardProps) => {
  const [days, setDays]                 = useState<DayWeather[]>(WEATHER_DAYS);
  const [isReal, setIsReal]             = useState(false);
  const [daysUntil, setDaysUntil]       = useState<number | null>(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    fetchBusanWeather().then(result => {
      if (result?.isReal && result.days.length === 5) {
        setDays(result.days);
        setIsReal(true);
        setDaysUntil(null);
      } else if (result && !result.isReal) {
        setDaysUntil(result.daysUntilForecast);
      }
      setLoading(false);
    });
  }, []);

  const d = days[activeIdx];

  return (
    <>
      {/* 狀態提示列 */}
      {!loading && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          marginBottom: 8, fontSize: 11,
          color: isReal ? '#059669' : '#9ca3af',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isReal ? '#34d399' : '#d1d5db',
            flexShrink: 0,
          }} />
          {isReal
            ? '即時預報・Open-Meteo'
            : daysUntil !== null && daysUntil > 0
              ? `預報約 ${daysUntil} 天後開放・目前顯示估計資料`
              : '預估資料・僅供參考'
          }
        </div>
      )}

      {/* 日期選擇列 */}
      <div className="date-scroller mb-4">
        {days.map((day, i) => (
          <div
            key={day.date}
            className={`date-item${i === activeIdx ? ' date-item--active' : ''}`}
            onClick={() => onDayChange(i)}
          >
            <span className="date-item__day">{day.day}</span>
            <div className="date-item__number">{day.date}</div>
          </div>
        ))}
      </div>

      {/* 天氣卡 */}
      <div className={`weather-card weather-card--${d.type}`}>
        <div className="weather-card__top">
          <div className="weather-card__icon-wrap">
            <WeatherIcon type={d.type} />
          </div>
          <div className="weather-card__main">
            <div className="weather-card__temp">
              {d.temp} <span>{d.range}</span>
            </div>
            <div className="weather-card__desc">{d.desc}</div>
          </div>
        </div>
        <div className="weather-card__chips">
          <span className="weather-chip weather-chip--rain">
            <DropIcon /> {d.rain}
          </span>
          <span className="weather-chip weather-chip--outfit">
            <ShirtIcon /> {d.outfit}
          </span>
        </div>
      </div>
    </>
  );
};

export default WeatherCard;
