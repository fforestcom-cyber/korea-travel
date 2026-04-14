import { useState } from 'react';
import WeatherCard from '../components/home/WeatherCard';
import DayPlanView from '../components/layout/DayPlanView';
import {
  TRIP_INFO, SCHEDULE_EVENTS, ScheduleEvent,
  TagItem,
} from '../data/mockData';
import day1Plan from '../data/scheduleDay1';
import day2Plan from '../data/scheduleDay2';
import day3Plan from '../data/scheduleDay3';
import day4Plan from '../data/scheduleDay4';
import day5Plan from '../data/scheduleDay5';

/* ── Day 1 行前 Checklist ─────────────────────────────── */
interface ChecklistItemData { key: string; label: string; desc: string; }

const DAY1_CHECKLIST: ChecklistItemData[] = [
  { key: 'arrival-card', label: '出發前',        desc: '填寫韓國電子入境卡（e-Arrival Card），提前 3 天線上填。' },
  { key: 'transit-card', label: '交通卡',        desc: 'T-money、WOWpass 或 Visit Busan Pass 實體卡均可，到機場輕軌站儲值使用。' },
  { key: 'busan-pass',   label: 'Visit Busan Pass', desc: 'Gate 2 旁旅遊諮詢處領取（10:00–17:00，午休 12:00–13:00）。班機 15:30 落地時間剛好，不要拖太久。若過了 17:00 則第二天補領。' },
  { key: 'exchange',     label: '換錢',          desc: '機場輕軌站內 Money Box（黃色招牌），人工窗口 06:00–21:00，門口有 24h 自助機。換 ₩5–8 萬韓幣即可。' },
  { key: 'transfer',     label: '沙上換乘',      desc: '輕軌出站後步行 6–7 分鐘到地鐵站，行李多請多留時間，跟著綠色指標走，找電梯再進站。' },
  { key: 'hotel',        label: '飯店確認',      desc: '抵達後確認 Urbanstay Seomyeon 在 ZIM CARRY 合作名單，於 KKday 預訂 Day 3 行李宅配至海雲台飯店。' },
  { key: 'cash',         label: '宵夜現金',      desc: '布帳馬車多為現金，帶 ₩20,000–30,000 出門。' },
  { key: 'naver',        label: 'Naver Map',     desc: '出地鐵站後用 Naver Map 導航飯店，比 Google Map 在釜山更精準。' },
];

const Day1ChecklistPanel = () => {
  const [open, setOpen]       = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const doneCount = DAY1_CHECKLIST.filter(item => checked[item.key]).length;

  return (
    <div style={{ marginBottom: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', overflow: 'hidden' }}>
      {/* 標題列（點擊展開） */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, color: 'var(--color-primary)', flexShrink: 0 }}
          fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--color-text-main)' }}>Day 1 行前 Checklist</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: doneCount === DAY1_CHECKLIST.length ? 'var(--color-primary)' : 'var(--color-text-light)', marginRight: 6 }}>
          {doneCount}/{DAY1_CHECKLIST.length}
        </span>
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* 進度條：左側對齊 flex 文字（padding 16 + icon 15 + gap 8 = 39px） */}
      <div style={{ height: 3, background: 'var(--color-bg-chip, #f0f0f0)', margin: '0 16px 0 39px' }}>
        <div style={{ height: '100%', width: `${(doneCount / DAY1_CHECKLIST.length) * 100}%`, background: 'var(--color-primary)', borderRadius: 4, transition: 'width 0.3s ease' }} />
      </div>

      {/* 展開內容 */}
      {open && (
        <div style={{ padding: '10px 16px 14px' }}>
          {DAY1_CHECKLIST.map((item, i) => (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                width: '100%', padding: '7px 0', textAlign: 'left', cursor: 'pointer',
                background: 'none', border: 'none',
              }}
            >
              <span style={{
                width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                border: checked[item.key] ? '2px solid var(--color-primary)' : '2px solid var(--color-border, #d1d5db)',
                background: checked[item.key] ? 'var(--color-primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
              }}>
                {checked[item.key] && (
                  <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, color: 'white' }} fill="none" stroke="currentColor" strokeWidth={3}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <div style={{ flex: 1, fontSize: 12, lineHeight: 1.7, color: checked[item.key] ? 'var(--color-text-light)' : 'var(--color-text-main)' }}>
                <span style={{ fontWeight: 600 }}>{item.label}　</span>
                {item.desc}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── 小元件 ───────────────────────────────────────────── */
const PinIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const InfoIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color, flexShrink: 0, marginTop: 2 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ForkIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const TagGroup = ({ tags }: { tags: TagItem[] }) => (
  <div className="tag-group">
    {tags.map((t, i) => {
      if (t.type === 'time') return (
        <span key={i} className="tag tag--time">
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          {t.label}
        </span>
      );
      if (t.type === 'naver') return (
        <span key={i} className="tag tag--naver">
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          </svg>
          {t.label}
        </span>
      );
      return (
        <span key={i} className="tag tag--google">
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          {t.label}
        </span>
      );
    })}
  </div>
);

const TransitBlock = ({ icon, label, content }: { icon: React.ReactNode; label: string; content: string }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      {icon}
      <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
    </div>
    <div style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
      {content.split('\n').map((line, i) => (
        <p key={i} style={{ margin: '0 0 4px' }}>{line}</p>
      ))}
    </div>
  </div>
);

const TransitTabs = ({ subway, taxi }: { subway: string; taxi: string }) => (
  <div style={{ marginBottom: '1rem' }}>
    <TransitBlock
      icon={
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, color: '#7d9baa', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="4" y="3" width="16" height="16" rx="2" />
          <path d="M4 11h16" /><path d="M12 3v8" />
          <path d="M8 19l-2 3" /><path d="M16 19l2 3" />
        </svg>
      }
      label="大眾運輸"
      content={subway}
    />
    <div style={{ height: 1, background: '#e8e0d8', margin: '4px 0 14px' }} />
    <TransitBlock
      icon={
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, color: '#c4a882', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
        </svg>
      }
      label="計程車"
      content={taxi}
    />
  </div>
);

const EventCard = ({ ev }: { ev: ScheduleEvent }) => {
  const [open, setOpen] = useState(false);
  const { detail: d } = ev;

  return (
    <div className={`event-card${open ? ' is-open' : ''}`}>
      <div className="event-card__summary" onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
        <div className="event-card__thumbnail">
          <div className="event-card__thumb-icon">
            <svg viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <span className="event-card__time-badge">{ev.time}</span>
        </div>
        <div className="event-card__content">
          <div className="event-card__title-row">
            <h3 className="event-card__title">{ev.title}</h3>
            <svg viewBox="0 0 24 24" className="chevron-icon" style={{ width: 18, height: 18 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          <div className="event-card__location">
            <PinIcon />{ev.location}
          </div>
          <div className="event-card__tags">
            <span className="badge">{ev.badge}</span>
          </div>
        </div>
      </div>

      {open && (
        <div className="event-card__details">
          <p className="event-card__desc">{d.desc}</p>

          {d.image && (
            <div className="info-image-box">
              <img src={d.image.url} alt={d.image.caption} />
              <div className="info-image-caption">
                <InfoIcon color="var(--color-primary)" />
                {d.image.caption}
              </div>
            </div>
          )}

          {d.rules?.map((r, i) => (
            <div key={i} className="rule-item">
              {r.color === 'primary'
                ? <ForkIcon />
                : <InfoIcon color="var(--color-info)" />
              }
              <span className="rule-item__text">{r.text}</span>
            </div>
          ))}

          {d.transit && (
            <TransitTabs subway={d.transit.subway} taxi={d.transit.taxi} />
          )}

          {d.shops && (
            <div className="shop-list">
              <h4 className="shop-list__title">
                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: 'var(--color-primary)' }}>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                口袋名單精選
              </h4>
              {d.shops.map((s, i) => (
                <div key={i} className="shop-item">
                  <div className="shop-item__header">
                    <span className="shop-item__name">{s.name}</span>
                    <span className="shop-item__kr">{s.kr}</span>
                  </div>
                  <p className="shop-item__desc">{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {d.tags && <TagGroup tags={d.tags} />}
        </div>
      )}
    </div>
  );
};

/* ── Day Plans 資料 ───────────────────────────────────── */
const DAY_PLANS = [day1Plan, day2Plan, day3Plan, day4Plan, day5Plan];

/* ── 通用 Day Checklist Panel（day2~5 用，從 plan 資料提取） ── */
const DayChecklistPanel = ({ title, items }: { title: string; items: string[] }) => {
  const [open, setOpen]       = useState(false);
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const doneCount = items.filter((_, i) => checked[i]).length;

  const parseItem = (text: string) => {
    const match = text.match(/^\*\*(.+?)\*\*[：:]\s*([\s\S]*)/);
    if (match) return { label: match[1], desc: match[2] };
    return { label: '', desc: text };
  };

  return (
    <div style={{ marginBottom: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, color: 'var(--color-primary)', flexShrink: 0 }}
          fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: 'var(--color-text-main)' }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: doneCount === items.length ? 'var(--color-primary)' : 'var(--color-text-light)', marginRight: 6 }}>
          {doneCount}/{items.length}
        </span>
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div style={{ height: 3, background: 'var(--color-bg-chip, #f0f0f0)', margin: '0 16px 0 39px' }}>
        <div style={{ height: '100%', width: `${(doneCount / items.length) * 100}%`, background: 'var(--color-primary)', borderRadius: 4, transition: 'width 0.3s ease' }} />
      </div>

      {open && (
        <div style={{ padding: '10px 16px 14px' }}>
          {items.map((item, i) => {
            const { label, desc } = parseItem(item);
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', padding: '7px 0', textAlign: 'left', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span style={{
                  width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  border: checked[i] ? '2px solid var(--color-primary)' : '2px solid var(--color-border, #d1d5db)',
                  background: checked[i] ? 'var(--color-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                }}>
                  {checked[i] && (
                    <svg viewBox="0 0 24 24" style={{ width: 10, height: 10, color: 'white' }} fill="none" stroke="currentColor" strokeWidth={3}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <div style={{ flex: 1, fontSize: 12, lineHeight: 1.7, color: checked[i] ? 'var(--color-text-light)' : 'var(--color-text-main)' }}>
                  {label && <span style={{ fontWeight: 600 }}>{label}　</span>}
                  {desc}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── 行程頁 ───────────────────────────────────────────── */
const SchedulePage = () => {
  const [activeDay, setActiveDay] = useState(0);
  const currentPlan = DAY_PLANS[activeDay];

  // 從 plan 資料中找 Checklist section（day2~5 用）
  const checklistSection = activeDay > 0
    ? currentPlan.sections.find(s => s.title.includes('Checklist'))
    : null;
  const checklistItems = checklistSection?.blocks[0]?.kind === 'checklist'
    ? (checklistSection.blocks[0] as { kind: 'checklist'; items: string[] }).items
    : [];

  return (
    <>
      <div className="page-trip-header">
        <div className="page-trip-header__title">{TRIP_INFO.title}</div>
        <div className="page-trip-header__date">
          <svg viewBox="0 0 24 24" style={{ width: 13, height: 13 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {TRIP_INFO.dateRange}
        </div>
      </div>

      <div className="section-px">
        <div className="mb-6">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>2026年 6月</div>
          <WeatherCard activeIdx={activeDay} onDayChange={setActiveDay} />
        </div>

        {activeDay === 0
          ? <Day1ChecklistPanel />
          : checklistItems.length > 0 && (
              <DayChecklistPanel
                title={checklistSection!.title}
                items={checklistItems}
              />
            )
        }

        <DayPlanView plan={currentPlan} />
      </div>
    </>
  );
};

export default SchedulePage;
