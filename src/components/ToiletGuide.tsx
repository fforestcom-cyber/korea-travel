import { useState } from 'react';

/* ── Data ────────────────────────────────────────── */
const KEYWORDS = [
  { label: '公共廁所（通用）',  ko: '공중화장실' },
  { label: '廁所（口語）',      ko: '화장실' },
];

const TIPS = [
  { title: '便利商店',     body: 'GS25、CU、7-Eleven、emart24 各大連鎖通常都有廁所，可免費使用，最易找到。' },
  { title: '地鐵站',       body: '釜山地鐵各站均設有公共廁所，免費開放，通常在剪票口附近。' },
  { title: '百貨 / 大型商場', body: '新世界 Centum City、樂天百貨廁所乾淨寬敞，可隨時入內使用。' },
  { title: '觀光景點周邊', body: '甘川洞文化村、廣安里、海雲台沙灘周邊均有公共廁所，地圖上標示清楚。' },
];

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

/* ── Map button ──────────────────────────────────── */
const MapButton = ({
  label, sub, borderColor, textColor, bg, loading, onClick,
}: {
  label: string; sub: string;
  borderColor: string; textColor: string; bg: string;
  loading: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 5, padding: '14px 10px',
      background: bg,
      border: `1.5px solid ${borderColor}`,
      borderRadius: 12, cursor: loading ? 'default' : 'pointer',
      transition: 'all 0.15s', width: '100%',
      opacity: loading ? 0.7 : 1,
    }}
  >
    <div style={{ fontSize: 13, fontWeight: 700, color: textColor }}>{label}</div>
    <div style={{ fontSize: 10, color: 'var(--color-text-light)' }}>{sub}</div>
  </button>
);

/* ── Main component ──────────────────────────────── */
const ToiletGuide = () => {
  const [open, setOpen]           = useState(false);
  const [locating, setLocating]   = useState<'google' | 'naver' | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const openMap = (mapType: 'google' | 'naver') => {
    if (locating) return;
    setLocating(mapType);

    const go = (lat?: number, lng?: number) => {
      setLocating(null);
      let url: string;
      if (mapType === 'google') {
        url = lat != null && lng != null
          ? `https://www.google.com/maps/search/공중화장실/@${lat},${lng},16z`
          : `https://www.google.com/maps/search/공중화장실`;
      } else {
        url = lat != null && lng != null
          ? `https://map.naver.com/v5/search/공중화장실?c=${lng},${lat},16,0,0,0,dh`
          : `https://map.naver.com/v5/search/공중화장실`;
      }
      window.open(url, '_blank');
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => go(pos.coords.latitude, pos.coords.longitude),
        () => go(),
        { timeout: 8000, enableHighAccuracy: true },
      );
    } else {
      go();
    }
  };

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
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🚻</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>附近廁所搜尋</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>Google Maps / Naver Maps · 一鍵定位找廁所</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>

          {/* ── Map buttons ── */}
          <div style={{ paddingTop: 14, marginBottom: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 8 }}>🗺️ 開啟地圖搜尋</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
              點按後自動抓取 GPS 位置，在地圖上顯示周邊公共廁所。
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <MapButton
                label="Google Maps"
                sub={locating === 'google' ? '定位中…' : '搜尋附近廁所'}
                borderColor="#4285F4"
                textColor="#4285F4"
                bg={locating === 'google' ? '#E8F0FE' : '#F8F9FF'}
                loading={locating === 'google'}
                onClick={() => openMap('google')}
              />
              <MapButton
                label="Naver Maps"
                sub={locating === 'naver' ? '定位中…' : '네이버지도 搜尋'}
                borderColor="#03C75A"
                textColor="#029947"
                bg={locating === 'naver' ? '#E6F9EE' : '#F4FDF7'}
                loading={locating === 'naver'}
                onClick={() => openMap('naver')}
              />
            </div>
          </div>

          {/* ── Korean keywords to copy ── */}
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 14 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>⌨️ 手動搜尋關鍵字</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10 }}>點按複製後貼入任意地圖 App 搜尋欄</div>
          {KEYWORDS.map((kw) => {
            const isCopied = copiedKey === kw.ko;
            return (
              <div key={kw.ko} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginBottom: 4 }}>{kw.label}</div>
                <button
                  onClick={() => handleCopy(kw.ko, kw.ko)}
                  style={{
                    width: '100%', textAlign: 'left' as const, cursor: 'pointer',
                    background: isCopied ? '#03C75A20' : 'white',
                    border: `1.5px solid ${isCopied ? '#03C75A' : '#03C75A55'}`,
                    borderRadius: 10,
                    padding: '10px 14px 8px',
                    transition: 'all 0.15s',
                    display: 'block',
                    position: 'relative' as const,
                  }}
                >
                  <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, color: 'var(--color-text-main)', paddingRight: 52 }}>
                    {kw.ko}
                  </div>
                  <div style={{
                    position: 'absolute' as const, bottom: 8, right: 11,
                    fontSize: 10, fontWeight: 700,
                    color: isCopied ? '#03C75A' : 'var(--color-text-light)',
                    display: 'flex', alignItems: 'center', gap: 3,
                    transition: 'color 0.15s',
                  }}>
                    {isCopied ? <><CheckIcon color="#03C75A" /> 已複製</> : <><CopyIcon /> 複製</>}
                  </div>
                </button>
              </div>
            );
          })}

          {/* ── Tips ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💡 找廁所小技巧</div>
          {TIPS.map((tip, i) => (
            <div key={i}>
              <div style={{ padding: '8px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 4 }}>{tip.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.65 }}>{tip.body}</div>
              </div>
              {i < TIPS.length - 1 && <div style={{ height: 1, background: 'var(--color-border)' }} />}
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default ToiletGuide;
