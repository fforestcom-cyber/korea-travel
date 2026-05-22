import { useState } from 'react';

interface WowLocation {
  dayRef: string;
  area: string;
  ko: string;
  naver: string;
  note: string;
}

const LOCATIONS: WowLocation[] = [
  {
    dayRef: 'Day 1 抵達',
    area: '金海機場',
    ko: '김해국제공항 국제선 터미널',
    naver: '우패스 김해국제공항',
    note: '入境後第一站兌換，建議換足 Day 1–2 用量',
  },
  {
    dayRef: 'Day 1–2 住宿',
    area: '西面',
    ko: '서면역 부근',
    naver: '우패스 서면',
    note: '飯店周邊，方便隨時補充',
  },
  {
    dayRef: 'Day 2 採買',
    area: '南浦洞',
    ko: '남포동 BIFF광장 부근',
    naver: '우패스 남포동',
    note: '逛國際市場、樂天超市前補現金',
  },
  {
    dayRef: 'Day 3–5 住宿',
    area: '海雲台',
    ko: '해운대역 부근',
    naver: '우패스 해운대',
    note: '入住海雲台後補換，Spa Land 現金備用',
  },
  {
    dayRef: 'Day 4 購物',
    area: '센텀시티',
    ko: '신세계백화점 센텀시티점 부근',
    naver: '우패스 센텀시티',
    note: '新世界百貨內或周邊，購物前補充',
  },
];

const TIPS = [
  { title: 'App 先下載', body: '出發前下載 <b>WOWPASS</b> App，完成會員註冊（護照資訊）。機台操作支援<b>中文介面</b>，插入護照即可兌換。' },
  { title: '匯率優勢', body: '機台匯率通常比機場銀行好 <b>3–5%</b>，但有手續費上限。建議兌換 <b>₩200,000–300,000</b> 現金備用，其餘刷卡消費。' },
  { title: '卡片消費', body: 'WOWPASS 卡片擁有 <b>VISA 標誌</b>，可直接在餐廳、便利商店、景點刷卡，無須全程帶大量現金。' },
  { title: '餘額退款', body: '回台灣後若有剩餘韓幣，可透過 App 申請退回台幣，退款約 <b>3–7 工作天</b>。' },
];

/* ── Icons ───────────────────────────────────────── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ── Location card ───────────────────────────────── */
const LocationCard = ({ loc }: { loc: WowLocation }) => {
  const naverUrl = `https://map.naver.com/p/search/${encodeURIComponent(loc.naver)}`;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ background: '#5B8FA8', color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, flexShrink: 0 }}>{loc.dayRef}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>{loc.note}</span>
      </div>
      <a
        href={naverUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block', width: '100%', textDecoration: 'none',
          background: 'white', border: '1.5px solid #5B8FA855',
          borderRadius: 10, padding: '12px 14px 10px',
          position: 'relative' as const, boxSizing: 'border-box' as const,
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)', marginBottom: 3 }}>
          {loc.area}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, paddingRight: 44 }}>
          {loc.ko}
        </div>
        <div style={{
          position: 'absolute' as const, bottom: 10, right: 12,
          fontSize: 10, fontWeight: 700, color: '#1a7340',
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <MapPinIcon /> 地圖
        </div>
      </a>
    </div>
  );
};

/* ── Main component ──────────────────────────────── */
const WowpassGuide = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem' }}>

      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>💳</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>WOWPASS 換匯 · 機台地圖</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>釜山各區機台位置 · 點按開啟 Naver 導航</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>

          {/* ── What is WOWPASS ── */}
          <div style={{ paddingTop: 14, marginBottom: 14 }}>
            <div style={{ background: '#EEF4F8', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: '#2A4A5A', lineHeight: 1.7 }}>
              <b>WOWPASS</b> 是專為外國旅客設計的韓國預付卡。機台直接換匯（插護照操作），卡片具 <b>VISA</b> 標誌可刷卡消費，匯率通常優於機場銀行。
            </div>
          </div>

          {/* ── Locations ── */}
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 12 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>📍 各區機台位置</div>
          {LOCATIONS.map(loc => (
            <LocationCard key={loc.area} loc={loc} />
          ))}

          {/* ── Tips ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💡 使用技巧</div>
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

export default WowpassGuide;
