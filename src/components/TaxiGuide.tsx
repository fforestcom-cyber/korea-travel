import { useState } from 'react';

const D: Record<string, string> = {
  d1: '#5E9977', d2: '#4E7A9E', d3: '#7B5E8E',
  d4: '#B87848', d5a: '#7D9BAA', d5b: '#9E6878',
};

type AppType = 'uber' | 'kride' | 'both';

interface Ride {
  num: string;
  ko: string;
  naver: string;
  route: string;
  time: string;
  cost: string;
  app: AppType;
}

interface DayData {
  key: string;
  label: string;
  theme: string;
  color: string;
  rides: Ride[];
  noRide?: string;
  alert?: { type: 'warn' | 'note'; text: string };
}

const DAYS: DayData[] = [
  {
    key: 'd1', label: 'Day 1', theme: '抵達 · 西面落腳', color: D.d1,
    rides: [
      { num: '1-備', ko: '어반스테이 부산서면\n부산 부산진구 서면로 68',
        naver: '어반스테이 부산서면 서면로 68',
        route: '（備案）機場 → 西面飯店・地鐵受阻時使用', time: '', cost: '₩25,000–35,000', app: 'both' },
    ],
    noRide: '✅ Day 1 全程地鐵＋步行，零計程車。機場→西面輕軌轉地鐵（₩1,800）。',
  },
  {
    key: 'd2', label: 'Day 2', theme: '釜田市場 · 甘川洞 · 南浦洞採買', color: D.d2,
    rides: [
      { num: '2-①', ko: '감천문화마을\n부산 사하구 감내2로 203',
        naver: '감천문화마을 사하구 감내2로 203',
        route: '釜田市場 → 甘川洞文化村（遊客中心）', time: '', cost: '₩12,000–15,000', app: 'both' },
      { num: '2-②', ko: '국제시장\n부산 중구 국제시장4길 23',
        naver: '국제시장 부산 중구 국제시장4길 23',
        route: '甘川洞文化村 → 國際市場', time: '', cost: '₩8,000–12,000', app: 'both' },
      { num: '2-③', ko: '어반스테이 부산서면\n부산 부산진구 서면로 68',
        naver: '어반스테이 부산서면 서면로 68',
        route: '樂天超市光復店 → 西面飯店', time: '傍晚採買後', cost: '₩8,000–12,000', app: 'both' },
    ],
  },
  {
    key: 'd3', label: 'Day 3', theme: 'ARTE MUSEUM → ClubD Oasis → 入住海雲台', color: D.d3,
    rides: [
      { num: '3-①', ko: '아르떼뮤지엄 부산\n부산 영도구 해양로247번길 29',
        naver: '아르떼뮤지엄 부산 영도구 해양로247번길 29',
        route: '西面 → ARTE MUSEUM（影島）', time: '09:30', cost: '₩12,000–15,000', app: 'uber' },
      { num: '3-②', ko: '클럽디 오아시스\n부산 기장군 기장읍 기장해안로',
        naver: '클럽디 오아시스',
        route: 'ARTE MUSEUM → ClubD Oasis', time: '', cost: '₩20,000–28,000', app: 'both' },
      { num: '3-③', ko: '라마다 앙코르 바이 윈덤 부산 해운대\n부산 해운대구 해운대해변로 368',
        naver: '라마다 앙코르 바이 윈덤 부산 해운대',
        route: 'ClubD Oasis → 海雲台溫德姆華美達安可飯店', time: '傍晚', cost: '₩15,000–22,000', app: 'both' },
    ],
  },
  {
    key: 'd4', label: 'Day 4', theme: 'Skyline Luge × 膠囊列車 × Spa Land × 廣安里夜場', color: D.d4,
    rides: [
      { num: '4-①', ko: '스카이라인루지 부산\n부산 기장군 기장읍\n기장해안로 205',
        naver: '스카이라인루지 부산 기장해안로 205',
        route: '海雲台飯店 → Skyline Luge（機張）', time: '09:00（08:45 叫車）', cost: '₩20,000–25,000', app: 'both' },
      { num: '4-②', ko: '해운대블루라인파크 미포역\n부산 해운대구\n달맞이길62번길 13',
        naver: '해운대블루라인파크 미포역 달맞이길62번길 13',
        route: 'Skyline Luge → 尾浦站（膠囊列車起點）', time: '11:00（時間緊）', cost: '₩15,000–20,000', app: 'both' },
      { num: '4-③', ko: '신세계백화점 센텀시티점\n부산 해운대구 센텀남대로 35',
        naver: '신세계백화점 센텀시티점 센텀남대로 35',
        route: '青沙浦（午餐後）→ 新世界百貨 Spa Land', time: '14:00', cost: '₩9,000–12,000', app: 'uber' },
      { num: '4-④', ko: '광안리해수욕장\n부산 수영구 광안해변로 219',
        naver: '광안리해수욕장 수영구 광안해변로 219',
        route: '新世界百貨 → 廣安里（無人機秀）', time: '夜間', cost: '₩7,000–10,000', app: 'both' },
    ],
    alert: { type: 'note', text: 'ℹ 廣安里無人機秀於夜間舉行，Spa Land 結束後計程車直達廣安里海水浴場約 ₩7,000–10,000。' },
  },
  {
    key: 'd5a', label: 'Day 5A', theme: '海雲台放空收尾', color: D.d5a,
    rides: [
      { num: '5A-①', ko: '김해국제공항 국제선\n경남 김해시 공항로 108',
        naver: '김해국제공항 국제선터미널 공항로 108',
        route: '海雲台飯店 → 金海機場（國際線）', time: '15:00 出發', cost: '₩20,000–25,000', app: 'both' },
    ],
  },
  {
    key: 'd5b', label: 'Day 5B', theme: '田浦採買收尾', color: D.d5b,
    rides: [
      { num: '5B-①', ko: '전포 카페거리\n부산 부산진구 전포대로 209',
        naver: '전포 카페거리 전포대로 209',
        route: '海雲台飯店 → 田浦商圈', time: '10:00 出發', cost: '₩12,000–16,000', app: 'uber' },
      { num: '5B-②', ko: '김해국제공항 국제선\n경남 김해시 공항로 108',
        naver: '김해국제공항 국제선터미널 공항로 108',
        route: '田浦商圈 → 金海機場（國際線）', time: '13:45（最晚出發）', cost: '₩20,000–25,000', app: 'both' },
    ],
  },
];

const TIPS = [
  { title: '出發前設定', body: '<b>Uber</b>：確認信用卡已綁，把常用目的地預存。<br><b>k.ride / Kakao T</b>：App Store 搜「k.ride」，台灣手機號驗證，綁 Visa/Master，<b>出發前完成，韓國設定容易卡關</b>。' },
  { title: '定位不準時', body: 'Uber 點「在地圖上設定地點」手動調整，避免定位到對面馬路。<br>上車後用 Naver Map 確認行駛方向。' },
  { title: '夜間加成', body: '<b>22:00–04:00</b> 夜間加成 <b>20–40%</b>，₩5,000 短程可能變 ₩7,000，正常現象。<br>深夜建議提前 5–10 分鐘叫好。' },
  { title: '司機拒載怎辦', body: '司機有時以「太近」或「太遠」拒接。<br><b>對策</b>：換另一個 App；或 k.ride 開 <b>SMART 呼叫（+₩1,000）</b>提高接單意願。' },
  { title: '行李多時', body: '<b>29 吋以上行李可能放不下</b>（後車廂部分有瓦斯桶）。<br>Day 5 去機場：k.ride 選「<b>대형（大型車）</b>」或叫廂型車。' },
  { title: '過橋費說明', body: '南浦洞往海雲台走<b>廣安大橋</b>加收 <b>₩1,000</b> 橋費（跳表加入，非私收），走橋比市區快約 10 分鐘。' },
];

/* ── Destination card ────────────────────────────── */
const DestCard = ({
  ride, color,
}: {
  ride: Ride; color: string;
}) => {
  const appLabel: Record<AppType, string> = { uber: 'Uber', kride: 'k.ride', both: 'Uber / k.ride' };
  const naverUrl = `https://map.naver.com/p/search/${encodeURIComponent(ride.naver)}`;

  return (
    <div style={{ marginBottom: 10 }}>
      {/* ── Secondary info row ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
        <span style={{ background: color, color: 'white', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 3, flexShrink: 0 }}>{ride.num}</span>
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>{ride.route}</span>
      </div>

      {/* ── Korean destination block (tap to open Naver Maps) ── */}
      <a
        href={naverUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '100%', textAlign: 'left' as const, cursor: 'pointer',
          background: 'white',
          border: `1.5px solid ${color}55`,
          borderRadius: 10,
          padding: '12px 14px 10px',
          display: 'block',
          position: 'relative' as const,
          textDecoration: 'none',
          boxSizing: 'border-box' as const,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, color: 'var(--color-text-main)', wordBreak: 'keep-all' as const, letterSpacing: '0.01em', paddingRight: 52 }}>
          {ride.ko.split('\n').map((line, i) => <div key={i}>{line}</div>)}
        </div>
        <div style={{
          position: 'absolute' as const, bottom: 9, right: 11,
          fontSize: 10, fontWeight: 700,
          color: '#1a7340',
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <MapPinIcon /> 地圖
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--color-text-light)' }}>
          建議：{appLabel[ride.app]}
        </div>
      </a>
    </div>
  );
};

/* ── Tiny icon components ────────────────────────── */
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 11, height: 11 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── App card (compare section) ──────────────────── */
const AppCard = ({ headerBg, headerText, name, badge, pros, notes }: {
  headerBg: string; headerText: string; name: string;
  badge: string; pros: string[]; notes: string[];
}) => (
  <div style={{ padding: '12px 0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
      <span style={{ background: headerBg, color: headerText, fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>{name}</span>
      <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>{badge}</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--color-text-light)', marginBottom: 5 }}>優點</div>
        {pros.map(p => <div key={p} style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 3 }}>✓ {p}</div>)}
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--color-text-light)', marginBottom: 5 }}>注意</div>
        {notes.map(n => <div key={n} style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 3 }}>△ {n}</div>)}
      </div>
    </div>
  </div>
);


/* ── Main component ──────────────────────────────── */
const TaxiGuide = () => {
  const [open, setOpen]         = useState(false);
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const toggleDay = (key: string) =>
    setOpenDays(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem' }}>

      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🚖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>計程車 × 叫車備查指南</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>Day 1–5 · 目的地韓文 · 點按開啟 Naver 地圖導航</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>

          {/* ── App compare ── */}
          <div style={{ paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>📱 叫車 App 比較</div>
            <AppCard
              headerBg="#1E2D35" headerText="white" name="Uber" badge="中文介面"
              pros={['可輸入中文目的地', '台灣帳號直接開用', '信用卡自動扣款']}
              notes={['偏遠區叫車較慢', '偶有繞路回報']}
            />
            <div style={{ height: 1, background: 'var(--color-border)' }} />
            <AppCard
              headerBg="#D4A84B" headerText="#6A4400" name="k.ride" badge="繁中介面"
              pros={['Kakao T 外國人版，合作車最多', '釜山叫車成功率更高', '台灣手機號＋信用卡可綁']}
              notes={['台灣完成註冊再出發', '目的地需輸入英/韓文']}
            />
            <div style={{ height: 1, background: 'var(--color-border)' }} />
            <AppCard
              headerBg="#FFCD00" headerText="#3A2800" name="Kakao T" badge="韓文版（備選）"
              pros={['韓國最大叫車平台', '司機最多、候車最短', '有韓國門號可直接使用']}
              notes={['需韓國手機號驗證', '信用卡設定較複雜', 'k.ride 已是其外國人版本']}
            />
          </div>

          {/* ── Strategy ── */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 12 }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>🎯 最佳叫車策略</div>
            {[
              { tag: 'Uber',   ts: { background: '#1E2D35', color: 'white' },                                  text: '先用 Uber 輸入中文確認目的地 + 看預估費用，合理就直接叫' },
              { tag: 'k.ride', ts: { background: '#D4A84B', color: '#6A4400' },                                text: '偏遠地區（水上樂園、Skyline Luge）同時開 k.ride，哪個先有司機就確認' },
              { tag: '雙開',   ts: { background: 'var(--color-bg-input)', color: 'var(--color-text-muted)' },  text: '超過 8 分鐘叫不到：切換另一個 App，或 k.ride 開 SMART 呼叫（+₩1,000）' },
            ].map((s, i, arr) => (
              <div key={s.tag}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 0' }}>
                  <span style={{ ...s.ts, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{s.tag}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{s.text}</span>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: 'var(--color-border)' }} />}
              </div>
            ))}
          </div>

          {/* ── Day sections ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>📍 各日目的地</div>
          {DAYS.map(day => (
            <div key={day.key} style={{ marginBottom: 10 }}>
              <button
                onClick={() => toggleDay(day.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '7px 0', borderBottom: `2px solid ${day.color}`, marginBottom: openDays[day.key] ? 8 : 0 }}
              >
                <span style={{ background: day.color, color: 'white', fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 3, flexShrink: 0 }}>{day.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', flex: 1, textAlign: 'left' as const }}>{day.theme}</span>
                <ChevronIcon open={!!openDays[day.key]} />
              </button>

              {openDays[day.key] && (
                <div>
                  {day.noRide && (
                    <div style={{ background: 'var(--color-bg-input)', border: '1px dashed var(--color-border)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' as const, marginBottom: 4 }}>
                      {day.noRide}
                    </div>
                  )}
                  {day.rides.map(ride => (
                    <DestCard
                      key={ride.num}
                      ride={ride}
                      color={day.color}
                    />
                  ))}
                  {day.alert && (
                    <div style={{
                      borderRadius: 8, padding: '8px 11px', fontSize: 11, lineHeight: 1.6, marginTop: 2,
                      background: day.alert.type === 'warn' ? '#FAF0D0' : '#EAF2F8',
                      color:      day.alert.type === 'warn' ? '#7A5800' : '#1A3A5A',
                    }}>
                      {day.alert.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* ── Tips ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💡 叫車實用技巧</div>
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

export default TaxiGuide;
