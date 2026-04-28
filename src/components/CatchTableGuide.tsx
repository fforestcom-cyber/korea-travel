import { useState } from 'react';

/* ── Data ────────────────────────────────────────── */
const MORANDI_DOTS = ['#7d9baa', '#9eab96', '#c4a882', '#b09898', '#8c9daa'];
const MORANDI_LINE = '#e8e0d8';

const SETUP = [
  { title: '安裝 App', body: 'App Store / Play Store 搜尋「캐치테이블」下載安裝' },
  { title: '登入帳號', body: 'Google 帳號或台灣手機號碼（+886 開頭）驗證登入' },
  { title: '綁定信用卡', body: '設定 → 結算資訊，綁 Visa/Master；熱門店訂位需預刷訂金，取消有截止時間' },
  { title: '搜尋 & 預訂', body: '搜尋韓文店名 → 選日期・人數・可用時段 → 確認' },
  { title: '到店出示', body: '出示 App 訂位確認畫面給服務員掃描，建議也截圖備用' },
];

type Status = 'reserved' | 'walk-in' | 'tbd';

interface Place {
  name: string;
  ko: string;
  note: string;
  status: Status;
}

interface ResvDay {
  key: string;
  day: string;
  theme: string;
  color: string;
  places: Place[];
}

const DAYS: ResvDay[] = [
  {
    key: 'd1', day: 'Day 1', theme: '西面 · 抵達晚餐', color: '#5E9977',
    places: [
      {
        name: '松亭三代豬肉湯飯',
        ko: '송정3대국밥\n부산 부산진구 가야대로 772',
        note: '80 年老店，不接受訂位，現場排隊約 10–20 分鐘',
        status: 'walk-in',
      },
    ],
  },
  {
    key: 'd3', day: 'Day 3', theme: '影島串聯 → 海雲台入住', color: '#7B5E8E',
    places: [
      {
        name: '晚餐（海雲台周邊）',
        ko: '',
        note: '入住海雲台後晚餐，建議提前 1–2 天在 Catch Table 預約',
        status: 'tbd',
      },
    ],
  },
  {
    key: 'd4', day: 'Day 4', theme: '廣安里晚餐', color: '#B87848',
    places: [
      {
        name: '廣安里晚餐',
        ko: '',
        note: 'Spa Land 後步行或搭車至廣安里，人氣店旺季 3–5 天前搶訂',
        status: 'tbd',
      },
    ],
  },
];

const TIPS = [
  { title: '提前多久訂？', body: '廣安里、海雲台人氣烤肉 / 韓定食通常需提前 <b>1–3 天</b>；週末旺季建議 <b>1 週前</b>搶。' },
  { title: '訂金規則', body: '熱門店訂位需預刷 <b>₩10,000–30,000/人</b> 訂金，取消截止多為 <b>前一天 17:00</b>，逾期扣款不退。' },
  { title: '現場候位（不用排隊）', body: 'Catch Table 有「현장 웨이팅（現場候位）」功能，到店後 App 登記排隊，可在附近逛逛等推播通知。' },
  { title: '搜尋技巧', body: '不確定店名時，輸入地區＋料理類型，例如 <b>광안리 한우</b>（廣安里韓牛）或 <b>해운대 횟집</b>（海雲台生魚片）。' },
];

const STATUS_META: Record<Status, { bg: string; text: string; label: string }> = {
  reserved:  { bg: '#D4EDDA', text: '#1A5C2C', label: '已訂位' },
  'walk-in': { bg: 'var(--color-bg-input)', text: 'var(--color-text-muted)', label: '直接入場' },
  tbd:       { bg: '#FFF3CD', text: '#7A5800', label: '待訂' },
};

/* ── Copy helper ─────────────────────────────────── */
const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

/* ── Icons ───────────────────────────────────────── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11 }} fill="none" stroke={color} strokeWidth={2.5}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Main component ──────────────────────────────── */
const CatchTableGuide = () => {
  const [open, setOpen]         = useState(false);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleDay = (key: string) =>
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));

  const handleCopy = (key: string, text: string) => {
    copyText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem' }}>

      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🍽️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>餐廳訂位 × Catch Table 備查指南</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>App 設定 · 各日訂位 · 訂位技巧</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>

          {/* ── Setup steps ── */}
          <div style={{ paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>🔧 App 設定步驟</div>
            {SETUP.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: MORANDI_DOTS[i % MORANDI_DOTS.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 11, fontWeight: 600, flexShrink: 0,
                  }}>{i + 1}</div>
                  {i < SETUP.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: MORANDI_LINE, marginTop: 4, minHeight: 14 }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < SETUP.length - 1 ? 14 : 0, flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Per-day reservations ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>📅 各日訂位備查</div>
          {DAYS.map(day => (
            <div key={day.key} style={{ marginBottom: 10 }}>
              <button
                onClick={() => toggleDay(day.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '7px 0', borderBottom: `2px solid ${day.color}`, marginBottom: openDays[day.key] ? 8 : 0 }}
              >
                <span style={{ background: day.color, color: 'white', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 3, flexShrink: 0 }}>{day.day}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', flex: 1, textAlign: 'left' as const }}>{day.theme}</span>
                <ChevronIcon open={!!openDays[day.key]} />
              </button>

              {openDays[day.key] && (
                <div>
                  {day.places.map((place, pi) => {
                    const st = STATUS_META[place.status];
                    const copyKey = `${day.key}-${pi}`;
                    const isCopied = copiedKey === copyKey;
                    return (
                      <div key={pi} style={{ marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-main)' }}>{place.name}</span>
                          <span style={{ background: st.bg, color: st.text, fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, flexShrink: 0 }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: place.ko ? 6 : 0 }}>{place.note}</div>
                        {place.ko && (
                          <button
                            onClick={() => handleCopy(copyKey, place.ko)}
                            style={{
                              width: '100%', textAlign: 'left' as const, cursor: 'pointer',
                              background: isCopied ? day.color + '20' : 'white',
                              border: `1.5px solid ${isCopied ? day.color : day.color + '55'}`,
                              borderRadius: 10,
                              padding: '10px 14px 8px',
                              transition: 'all 0.15s',
                              display: 'block',
                              position: 'relative' as const,
                            }}
                          >
                            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.6, color: 'var(--color-text-main)', wordBreak: 'keep-all' as const, paddingRight: 48 }}>
                              {place.ko.split('\n').map((line, li) => <div key={li}>{line}</div>)}
                            </div>
                            <div style={{
                              position: 'absolute' as const, bottom: 8, right: 11,
                              fontSize: 10, fontWeight: 700,
                              color: isCopied ? day.color : 'var(--color-text-light)',
                              display: 'flex', alignItems: 'center', gap: 3,
                              transition: 'color 0.15s',
                            }}>
                              {isCopied
                                ? <><CheckIcon color={day.color} /> 已複製</>
                                : <><CopyIcon /> 複製</>
                              }
                            </div>
                            <div style={{ marginTop: 4, fontSize: 10, color: 'var(--color-text-light)' }}>複製後貼入 Catch Table 或 Naver Map</div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          {/* ── Tips ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💡 訂位實用技巧</div>
          {TIPS.map((tip, i) => (
            <div key={i}>
              <div style={{ padding: '8px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 4 }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: tip.body }} />
              </div>
              {i < TIPS.length - 1 && <div style={{ height: 1, background: 'var(--color-border)' }} />}
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default CatchTableGuide;
