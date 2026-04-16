/* ═══════════════════════════════════════════════════════
   靜態假資料（對應 template.html 所有視圖）
   ═══════════════════════════════════════════════════════ */

// ── 行程基本資訊 ────────────────────────────────────────
export const TRIP_INFO = {
  title:     '韓國釜山自由行 5天4夜',
  dateRange: '2026/06/10 - 2026/06/14',
  start:     '2026-06-10',
  end:       '2026-06-14',
};

// ── 匯率 ────────────────────────────────────────────────
export const EXCHANGE = {
  label: '1 TWD ≈ 41.5 KRW',
  rate:  41.5,
};

// ── 機票 ────────────────────────────────────────────────
export const FLIGHTS = [
  {
    direction: 'dep' as const,
    directionLabel: '去程',
    flightNo: 'BR 159 · 2026/06/10',
    from: { iata: 'TPE', city: '台北桃園', time: '13:15' },
    to:   { iata: 'PUS', city: '釜山金海', time: '15:50' },
    duration: '2h 35m',
    flip: false,
  },
  {
    direction: 'arr' as const,
    directionLabel: '回程',
    flightNo: 'BR 160 · 2026/06/14',
    from: { iata: 'PUS', city: '釜山金海', time: '16:30' },
    to:   { iata: 'TPE', city: '台北桃園', time: '18:50' },
    duration: '2h 20m',
    flip: true,
  },
];

// ── 待辦事項 ─────────────────────────────────────────────
export interface CheckItem { text: string; sub?: string; done: boolean; }

export const TODO_ITEMS: CheckItem[] = [
  { text: '訂購來回機票',        sub: 'BR 159 / BR 160 · 已確認',    done: true  },
  { text: '預訂住宿',            sub: 'Urbanstay Seomyeon · 已確認', done: true  },
  { text: '申辦海外網路卡 / SIM', sub: '建議選擇韓國 10 日方案',       done: false },
  { text: '換匯韓元',            sub: '建議備妥 ₩200,000 現金',       done: false },
  { text: '填寫出入境 Q-Code',    sub: '出發前 48 小時內填寫',        done: false },
  { text: '下載 Naver Map 離線地圖', sub: '釜山市區範圍',             done: false },
];

export const PREP_ITEMS: CheckItem[] = [
  { text: '護照（效期 6 個月以上）',   done: true  },
  { text: '信用卡 / 金融卡',   sub: '建議帶 Visa 國際卡',            done: true  },
  { text: '220V 轉接頭（韓規雙圓孔）', done: false },
  { text: '行動電源',          sub: '不可托運，須放隨身行李',          done: false },
  { text: '防曬 / 雨傘',       sub: '6月釜山偶有陣雨',               done: false },
  { text: '常備藥品',          sub: '胃藥、感冒藥、OK 繃',           done: false },
];

// ── 天氣資料 ─────────────────────────────────────────────
export type WeatherType = 'sunny' | 'partlysunny' | 'cloudy' | 'rainy' | 'heavyrain';

export interface DayWeather {
  day: string; date: number; type: WeatherType;
  temp: string; range: string; desc: string; rain: string; outfit: string;
}

export const WEATHER_DAYS: DayWeather[] = [
  { day: '週三', date: 10, type: 'sunny',       temp: '32°', range: '/ 26°C', desc: '晴時多雲，部分地區有午後陣雨', rain: '降雨 15%', outfit: '短袖＋薄外套'   },
  { day: '週四', date: 11, type: 'partlysunny', temp: '29°', range: '/ 23°C', desc: '晴時多雲，午後偶有陣雨',       rain: '降雨 35%', outfit: '短袖＋薄外套'   },
  { day: '週五', date: 12, type: 'cloudy',      temp: '25°', range: '/ 20°C', desc: '多雲，偶有雲層遮蔽陽光',       rain: '降雨 20%', outfit: '長袖薄外套'     },
  { day: '週六', date: 13, type: 'rainy',       temp: '22°', range: '/ 18°C', desc: '有雨，出門記得帶傘',           rain: '降雨 80%', outfit: '雨衣＋防水鞋'   },
  { day: '週日', date: 14, type: 'heavyrain',   temp: '20°', range: '/ 16°C', desc: '大雨特報，避免戶外活動',       rain: '降雨 95%', outfit: '全套雨具必備'   },
];

// ── 記帳分類 ─────────────────────────────────────────────
export const EXPENSE_CATS = [
  { name: '餐飲', amt: '₩18,000', pct: 28, color: '#7D9BAA' },
  { name: '購物', amt: '₩30,000', pct: 47, color: '#B09080' },
  { name: '交通', amt: '₩9,000',  pct: 14, color: '#849E88' },
  { name: '景點', amt: '₩7,000',  pct: 11, color: '#9888AA' },
];

export type PayType  = 'cash' | 'card';
export type Category = '餐飲' | '購物' | '交通' | '景點';

export interface ExpenseItem {
  id: number;
  title: string; date: string; category: Category;
  type: PayType; price: string;
}

export const EXPENSE_ITEMS: ExpenseItem[] = [
  { id: 1, title: '松亭三代豬肉湯飯', date: '06/10', category: '餐飲', type: 'cash', price: '₩ 9,000'  },
  { id: 2, title: 'Olive Young 美妝', date: '06/10', category: '購物', type: 'card', price: '₩ 45,000' },
  { id: 3, title: '地鐵 T-money',     date: '06/10', category: '交通', type: 'cash', price: '₩ 3,200'  },
  { id: 4, title: '甘川文化村門票',   date: '06/11', category: '景點', type: 'cash', price: '₩ 6,800'  },
];

// ── 備註 ─────────────────────────────────────────────────
export type DotColor = 'red' | 'yellow' | 'green' | 'blue';

export interface NoteItem {
  id: number; text: string; date: string;
  color: DotColor; img?: string;
}

export const INIT_NOTES: NoteItem[] = [
  {
    id: 1, color: 'yellow', date: '6月10日 20:14',
    text: '記得幫同事買 Olive Young 的維他命C！',
    img:  'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=400',
  },
  { id: 2, color: 'blue',  date: '6月10日 09:30', text: '計程車司機不一定懂英文，記得截圖 Naver Map 的韓文地址備用。' },
  { id: 3, color: 'green', date: '6月09日 22:05', text: '購物清單：韓牛牛排片 × 2、Laneige 水凝面膜、COSRX 蝸牛精華、便利商店早午餐試吃清單整理' },
];
