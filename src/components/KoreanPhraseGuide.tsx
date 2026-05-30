import { useState } from 'react';

// ── Morandi palette ───────────────────────────────────────────
const DOTS = ['#7d9baa', '#9eab96', '#c4a882', '#b09898', '#8c9daa', '#a89c8c'];

// ── 速查詞彙 data ─────────────────────────────────────────────
interface QuickPhrase { kr: string; zh: string; ph: string; }
interface QuickCat    { label: string; color: string; items: QuickPhrase[]; }

const QUICK: QuickCat[] = [
  {
    label: '基本禮貌', color: '#7d9baa',
    items: [
      { kr: '안녕하세요', zh: '你好',            ph: '安寧哈誰優' },
      { kr: '감사합니다', zh: '謝謝',            ph: '感沙哈米達' },
      { kr: '죄송합니다', zh: '對不起',          ph: '確松哈米達' },
      { kr: '저기요',     zh: '不好意思／請問',  ph: '糗ㄎㄧ優' },
      { kr: '괜찮아요',   zh: '沒關係／不用了',  ph: '肯燦那優' },
    ],
  },
  {
    label: '問路 · 交通', color: '#9eab96',
    items: [
      { kr: '화장실 어디예요?', zh: '廁所在哪裡？', ph: '花將洗 歐滴耶優' },
      { kr: '어디예요?',        zh: '在哪裡？',     ph: '歐滴耶優' },
      { kr: '입구',             zh: '入口',         ph: '以朴估' },
      { kr: '출구',             zh: '出口',         ph: '出兒估' },
    ],
  },
  {
    label: '餐廳 · 飲食', color: '#c4a882',
    items: [
      { kr: '이거 주세요',        zh: '這個請給我',       ph: '一狗 啾誰優' },
      { kr: '물 주세요',          zh: '請給我水',         ph: '木兒 啾誰優' },
      { kr: '이모님',             zh: '阿姨（叫大媽店員）', ph: '姨某膩' },
      { kr: '혼자예요',           zh: '我一個人',         ph: '轟加耶優' },
      { kr: '맛있어요',           zh: '很好吃',           ph: '馬西搜優' },
      { kr: '맵지 않게 해주세요', zh: '請不要辣',         ph: '梅朴幾 昂給 嘿啾誰優' },
    ],
  },
  {
    label: '購物 · 付款', color: '#b09898',
    items: [
      { kr: '얼마예요?',     zh: '多少錢？',     ph: '歐罵耶優' },
      { kr: '한 개',         zh: '一個',         ph: '夯給' },
      { kr: '두 개',         zh: '兩個',         ph: '督給' },
      { kr: '카드 돼요?',    zh: '可以刷卡嗎？', ph: '咖滴 帶優' },
      { kr: '할인 돼요?',    zh: '可以打折嗎？', ph: '哈令 帶優' },
      { kr: '영수증 주세요', zh: '請給我收據',   ph: '勇書證 啾誰優' },
    ],
  },
  {
    label: '緊急 · 其他', color: '#8c9daa',
    items: [
      { kr: '도와주세요',        zh: '請幫助我',     ph: '都挖 啾誰優' },
      { kr: '사진 찍어도 돼요?', zh: '可以拍照嗎？', ph: '撒進 幾哦都 帶優' },
      { kr: '영업 중',           zh: '營業中',       ph: '勇業 中' },
      { kr: '휴무',              zh: '公休 / 打烊',  ph: '嘿務' },
    ],
  },
];

// ── 旅途碎語 data ─────────────────────────────────────────────
interface Situation { icon: string; text: string; example?: string; note?: string; }
interface Narrative {
  kr: string; phonetic: string; zhPh: string; meaning: string;
  desc?: string; situations?: Situation[];
  tip?: string; warning?: string; story?: string;
}

const NARRATIVE: Narrative[] = [
  {
    kr: '저기요',
    phonetic: 'jeo-gi-yo', zhPh: '糗ㄎㄧ優',
    meaning: '不好意思 ／ 請問一下 ／ 欸那位～',
    desc: '韓國人超常用，餐廳叫店員、問路、想引起注意都能用，跟問「廁所在哪」一樣常見。',
    situations: [
      { icon: '🍽️', text: '餐廳想點餐',   example: '저기요～' },
      { icon: '🗺️', text: '問路',          example: '저기요, 혹시…', note: '不好意思，請問…' },
      { icon: '📢', text: '有人東西掉了', example: '저기요!' },
    ],
    warning: '語氣太重會變「喂？？？」，韓文很多時候靠語氣決定感覺。',
    story: '旅伴手機掉在計程車上，司機年紀大聽不懂英文，就先用這句搭訕路人小姊姊，請她幫忙用韓文和司機溝通，再跟我們用簡單英文說明在哪裡等。最後手機順利找回來。',
  },
  {
    kr: '이모님',
    phonetic: 'i-mo-nim', zhPh: '姨某膩',
    meaning: '姨母 ／ 阿姨（稱呼大媽店員）',
    desc: '韓國餐廳叫大媽店員，比「아줌마（阿珠媽）」更有禮貌，路邊店、韓式餐館超常用。',
    situations: [
      { icon: '🍜', text: '叫店員', example: '이모님~ 여기요!', note: '阿姨～這邊！（姨某膩 悠ㄍㄧ唷）' },
    ],
    tip: '直接讓韓國味跑出來。',
  },
  {
    kr: '괜찮아요',
    phonetic: 'gwaen-cha-na-yo', zhPh: '肯燦那優',
    meaning: '沒關係 ／ 不用了 ／ 還好',
    desc: '萬用句，以下這些情境全部能接。',
    situations: [
      { icon: '🛍️', text: '店員問需不需要袋子' },
      { icon: '➕',  text: '問要不要加什麼' },
      { icon: '🙏', text: '有人跟你道歉' },
    ],
  },
  {
    kr: '주세요',
    phonetic: 'ju-se-yo', zhPh: '啾誰優',
    meaning: '請給我',
    desc: '點餐神句。不會韓文也能活——直接手指菜單＋這句，成功率90%。',
    situations: [
      { icon: '👆', text: '點餐', example: '이거 주세요', note: '這個請給我（一狗 啾誰優）' },
    ],
  },
  {
    kr: '혼자예요',
    phonetic: 'hon-ja-ye-yo', zhPh: '轟加耶優',
    meaning: '我一個人',
    desc: '獨旅超常講。韓國現在很多地方對一人用餐已比以前友善很多，不要自己先怕。',
    situations: [
      { icon: '🙋', text: '店員問「一位嗎？」' },
    ],
  },
  {
    kr: '얼마예요?',
    phonetic: 'eol-ma-ye-yo', zhPh: '歐罵耶優',
    meaning: '多少錢？',
    desc: '市場、小店超好用。',
  },
  {
    kr: '화장실 어디예요?',
    phonetic: 'hwa-jang-sil eo-di-ye-yo', zhPh: '花將洗 歐滴耶優',
    meaning: '廁所在哪裡？',
    desc: '人有三急，這句請背。',
  },
  {
    kr: '한 개 / 두 개',
    phonetic: 'han gae / du gae', zhPh: '夯給 / 督給',
    meaning: '一個 ／ 兩個',
    desc: '買東西超常用。韓文數量其實複雜，但先記這兩個基本夠活了。',
    situations: [
      { icon: '🍓', text: '草莓一盒', example: '한 개 주세요', note: '夯給 啾誰優' },
      { icon: '🍞', text: '麵包兩個', example: '두 개 주세요', note: '督給 啾誰優' },
    ],
  },
];

// ── Icons ─────────────────────────────────────────────────────
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    style={{ width: 13, height: 13, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, color: 'var(--color-text-light)' }}
    fill="none" stroke="currentColor" strokeWidth={2}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── 速查詞彙：單一類別 ─────────────────────────────────────────
const QuickCatBlock = ({ cat, open, onToggle }: { cat: QuickCat; open: boolean; onToggle: () => void }) => (
  <div style={{ marginBottom: 6 }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', background: open ? 'rgba(0,0,0,.02)' : 'none',
        border: 'none', cursor: 'pointer', borderRadius: 8, textAlign: 'left' as const,
      }}
    >
      <div style={{ width: 3, height: 16, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)' }}>{cat.label}</span>
      <span style={{ fontSize: 10, color: 'var(--color-text-light)', marginRight: 4 }}>{cat.items.length} 詞</span>
      <ChevronIcon open={open} />
    </button>

    {open && (
      <div style={{ marginLeft: 13, paddingLeft: 10, borderLeft: `2px solid ${cat.color}44`, paddingBottom: 4 }}>
        {cat.items.map((p, i) => (
          <div
            key={p.kr}
            style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              padding: '7px 4px',
              borderBottom: i < cat.items.length - 1 ? '1px solid #f3ede8' : 'none',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: '#374151', flex: 1, minWidth: 0 }}>{p.kr}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 20,
              background: cat.color + '22', color: cat.color, flexShrink: 0,
            }}>{p.ph}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-light)', flexShrink: 0, minWidth: 0, textAlign: 'right' as const }}>{p.zh}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ── 旅途碎語：單張卡片 ─────────────────────────────────────────
const NarrativeCard = ({ phrase, idx }: { phrase: Narrative; idx: number }) => {
  const [open, setOpen] = useState(false);
  const color = DOTS[idx % DOTS.length];

  return (
    <div style={{ border: '1px solid #ece8e3', borderRadius: 10, background: '#fff', marginBottom: 10, overflow: 'hidden' }}>
      {/* ── card header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const,
        }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
        }}>
          {idx + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#374151', lineHeight: 1.3, letterSpacing: '0.01em' }}>
            {phrase.kr}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' as const }}>
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '1px 8px', borderRadius: 20,
              background: color + '22', color,
            }}>{phrase.zhPh}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-light)' }}>{phrase.meaning}</span>
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {/* ── expanded content ── */}
      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid #f3ede8' }}>

          {phrase.desc && (
            <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75, margin: '12px 0 10px' }}>
              {phrase.desc}
            </p>
          )}

          {phrase.situations && phrase.situations.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.07em', marginBottom: 8 }}>
                📍 情境
              </div>
              {phrase.situations.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: s.example ? 8 : 4 }}>
                  <span style={{ fontSize: 15, flexShrink: 0, lineHeight: 1 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: s.example ? 4 : 0 }}>{s.text}</div>
                    {s.example && (
                      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8, padding: '4px 10px', background: '#f8f5f1', borderRadius: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{s.example}</span>
                        {s.note && <span style={{ fontSize: 11, color: '#9ca3af' }}>{s.note}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {phrase.tip && (
            <div style={{
              borderLeft: '2px solid #9eab96', background: 'rgba(158,171,150,0.1)',
              borderRadius: '0 6px 6px 0', padding: '6px 10px',
              fontSize: 12, color: '#6b7280', lineHeight: 1.65, marginBottom: 8,
            }}>
              {phrase.tip}
            </div>
          )}

          {phrase.warning && (
            <div style={{
              borderLeft: '2px solid #c4a882', background: 'rgba(196,168,130,0.1)',
              borderRadius: '0 6px 6px 0', padding: '6px 10px',
              fontSize: 12, color: '#6b7280', lineHeight: 1.65, marginBottom: 8,
            }}>
              ⚠️ {phrase.warning}
            </div>
          )}

          {phrase.story && (
            <div style={{
              borderLeft: '2px solid #7d9baa', background: 'rgba(125,155,170,0.1)',
              borderRadius: '0 6px 6px 0', padding: '6px 10px',
              fontSize: 12, color: '#6b7280', lineHeight: 1.7, marginBottom: 8,
            }}>
              💬 {phrase.story}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────
const KoreanPhraseGuide = () => {
  const [open,     setOpen]     = useState(false);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [tab,      setTab]      = useState<'quick' | 'narrative'>('quick');

  const toggleCat = (label: string) =>
    setOpenCats(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <div style={{
      border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
      background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem',
    }}>

      {/* ── outer header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left' as const,
        }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🇰🇷</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>旅遊常用韓語詞彙</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>
            速查 · 旅途碎語 · 附中文念法
          </div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--color-border)' }}>

          {/* ── tab switcher ── */}
          <div style={{ display: 'flex', padding: '10px 16px 0', gap: 6 }}>
            {([
              { key: 'quick',     label: '速查詞彙' },
              { key: 'narrative', label: '旅途碎語' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  padding: '5px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                  background: tab === key ? '#7d9baa' : 'rgba(125,155,170,0.1)',
                  color: tab === key ? '#fff' : '#7d9baa',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── tab content ── */}
          <div style={{ padding: '12px 16px 16px' }}>

            {tab === 'quick' && QUICK.map(cat => (
              <QuickCatBlock
                key={cat.label}
                cat={cat}
                open={!!openCats[cat.label]}
                onToggle={() => toggleCat(cat.label)}
              />
            ))}

            {tab === 'narrative' && (
              <>
                {NARRATIVE.map((phrase, idx) => (
                  <NarrativeCard key={phrase.kr} phrase={phrase} idx={idx} />
                ))}

                {/* ── 附記：外國人通用詞 ── */}
                <div style={{
                  borderLeft: '2px solid #9eab96', background: 'rgba(158,171,150,0.1)',
                  borderRadius: '0 8px 8px 0', padding: '10px 12px', marginTop: 4,
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#9eab96', letterSpacing: '0.05em', marginBottom: 6 }}>
                    💡 附記
                  </div>
                  <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                    還有一些外國人一聽就知道你要幹嘛的簡單英文單字，直接用就好：
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginTop: 8 }}>
                    {['tax free?', 'check in', 'check out', 'delivery?', 'wifi?', 'receipt?'].map(w => (
                      <span key={w} style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                        background: '#fff', border: '1px solid #9eab9655', color: '#5a7a5a',
                      }}>{w}</span>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default KoreanPhraseGuide;
