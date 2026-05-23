import { useState } from 'react';

/* ── Data ────────────────────────────────────────── */
interface Phrase {
  kr: string;
  zh: string;
  pronunciation: string;
}

interface Category {
  label: string;
  icon: string;
  items: Phrase[];
}

const CATEGORIES: Category[] = [
  {
    label: '基本禮貌',
    icon: '🙏',
    items: [
      { kr: '안녕하세요',    zh: '你好',     pronunciation: '安寧哈誰優' },
      { kr: '감사합니다',    zh: '謝謝',     pronunciation: '感沙哈米達' },
      { kr: '죄송합니다',    zh: '對不起',   pronunciation: '確松哈米達' },
      { kr: '괜찮아요',      zh: '沒關係',   pronunciation: '苦安恰那優' },
    ],
  },
  {
    label: '問路 · 交通',
    icon: '🗺️',
    items: [
      { kr: '어디예요?',              zh: '在哪裡？',   pronunciation: '哦滴耶優' },
      { kr: '화장실이 어디예요?',     zh: '廁所在哪裡？', pronunciation: '花莊細里 哦滴耶優' },
      { kr: '입구',                   zh: '入口',       pronunciation: '以朴估' },
      { kr: '출구',                   zh: '出口',       pronunciation: '出兒估' },
    ],
  },
  {
    label: '餐廳 · 飲食',
    icon: '🍜',
    items: [
      { kr: '이거 주세요',            zh: '請給我這個',   pronunciation: '以勾 粗誰優' },
      { kr: '물 주세요',              zh: '請給我水',     pronunciation: '木兒 粗誰優' },
      { kr: '맛있어요',               zh: '很好吃',       pronunciation: '馬西搜優' },
      { kr: '맵지 않게 해주세요',     zh: '請不要辣',     pronunciation: '梅朴幾 昂給 嘿粗誰優' },
      { kr: '혼자예요',               zh: '我一個人',     pronunciation: '紅炸耶優' },
      { kr: '몇 명이에요?',           zh: '幾個人？',     pronunciation: '謬 名以耶優' },
    ],
  },
  {
    label: '購物 · 付款',
    icon: '🛍️',
    items: [
      { kr: '얼마예요?',      zh: '多少錢？',       pronunciation: '哦兒馬耶優' },
      { kr: '카드 돼요?',     zh: '可以刷卡嗎？',   pronunciation: '咖滴 帶優' },
      { kr: '할인 돼요?',     zh: '可以打折嗎？',   pronunciation: '哈令 帶優' },
      { kr: '영수증 주세요',  zh: '請給我收據',     pronunciation: '勇書證粗誰優' },
    ],
  },
  {
    label: '其他 · 緊急',
    icon: '🆘',
    items: [
      { kr: '도와주세요',          zh: '請幫助我',     pronunciation: '都挖粗誰優' },
      { kr: '사진 찍어도 돼요?',   zh: '可以拍照嗎？', pronunciation: '撒進 幾哦都 帶優' },
      { kr: '영업 중',             zh: '營業中',       pronunciation: '勇業 中' },
      { kr: '휴무',                zh: '公休 / 打烊',  pronunciation: '嘿務' },
    ],
  },
];

/* ── Icons ───────────────────────────────────────── */
const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Phrase row ──────────────────────────────────── */
const PhraseRow = ({ phrase }: { phrase: Phrase }) => (
  <div style={{
    background: 'white',
    border: '1.5px solid #4E7A9E44',
    borderRadius: 10,
    padding: '10px 14px',
    marginBottom: 8,
  }}>
    <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, color: 'var(--color-text-main)', letterSpacing: '0.01em' }}>
      {phrase.kr}
    </div>
    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
      {phrase.zh}　<span style={{ color: 'var(--color-text-light)' }}>念：{phrase.pronunciation}</span>
    </div>
  </div>
);

/* ── Main component ──────────────────────────────── */
const KoreanPhraseGuide = () => {
  const [open, setOpen]         = useState(false);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});

  const toggleCat = (label: string) =>
    setOpenCats(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem' }}>

      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🇰🇷</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>旅遊常用韓語詞彙</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>附中文念法</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ paddingTop: 14 }}>
            {CATEGORIES.map((cat, ci) => (
              <div key={cat.label} style={{ marginBottom: 10 }}>

                {/* ── Category header ── */}
                <button
                  onClick={() => toggleCat(cat.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                    background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
                    borderBottom: '2px solid #4E7A9E55',
                    marginBottom: openCats[cat.label] ? 10 : 0,
                  }}
                >
                  <span style={{ fontSize: 13 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', flex: 1, textAlign: 'left' as const }}>{cat.label}</span>
                  <ChevronIcon open={!!openCats[cat.label]} />
                </button>

                {/* ── Phrases ── */}
                {openCats[cat.label] && cat.items.map((phrase) => (
                  <PhraseRow key={phrase.kr} phrase={phrase} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KoreanPhraseGuide;
