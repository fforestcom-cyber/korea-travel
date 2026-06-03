import { useState } from 'react';

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: 'var(--color-text-light)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── 退稅種類 ───────────────────────────────────────── */
const TYPES = [
  {
    label: '機場退稅', labelEn: 'Tax Refund / Tax Free',
    color: '#4E7A9E', icon: '✈️',
    desc: '結帳時支付原價，出境時在機場領回稅金。',
    note: '單筆退稅金額 ≥ ₩75,000 須人工查驗，需額外預留時間。',
    tag: '最常見',
  },
  {
    label: '即刻退稅', labelEn: 'Immediate Tax Free',
    color: '#5E9977', icon: '💰',
    desc: '結帳時店家直接扣除稅金，機場無需再辦任何手續。',
    note: '退稅單上顯示「즉시」(immediate) 即為此類，確認後可省略機場流程。',
    tag: '最方便',
  },
  {
    label: '免稅購買', labelEn: 'Duty Free',
    color: '#7B5E8E', icon: '🏪',
    desc: '在免稅店直接以免稅價格購買，無需任何退稅手續。',
    note: '如機場免稅店、市區免稅店（樂天、新世界等）。',
    tag: '免手續',
  },
];

/* ── 機場退稅流程步驟 ────────────────────────────────── */
const STEPS = [
  {
    step: '01',
    title: '確認退稅單種類',
    location: '購物當下',
    color: '#B87848',
    desc: '結帳時要求退稅單，確認單據上有「TAX FREE」或「Refund」字樣。',
    detail: '⚠️ 一般購物收據無法退稅，必須取得專屬退稅單。\n若顯示「즉시」(即刻退稅) 則已在結帳時扣除，機場無需再辦。',
    diagram: [
      { label: '一般收據', badge: '✗ 不能退稅', badgeColor: '#c0392b', badgeBg: '#fdecea' },
      { label: 'TAX FREE 退稅單', badge: '✓ 可退稅', badgeColor: '#27ae60', badgeBg: '#eafaf1' },
      { label: '즉시 即刻退稅單', badge: '✓ 已扣除免辦', badgeColor: '#2980b9', badgeBg: '#eaf4fb' },
    ],
  },
  {
    step: '02',
    title: '依退稅金額走不同路線',
    location: '2F 報到大廳 Gate 4 旁',
    color: '#4E7A9E',
    desc: '退稅金額門檻 ₩75,000（單筆購物約 ₩100 萬）決定你走哪條路，兩條路都不需要同時走。',
    detail: '路線 A｜退稅金額 < ₩75,000（一般購物）\n→ 排自助機台掃描護照＋退稅單\n→ 顯示「⭕」即完成，通關後領款\n\n路線 B｜退稅金額 ≥ ₩75,000（單筆購物 ≥ ₩100 萬）\n→ 直接跳過機台，走人工海關退稅櫃台\n→ 攜帶商品＋退稅單給海關查驗蓋章\n→ 蓋章後才能託運行李，通關後領款\n\n💡 不同地區的退稅單可在同一台機器一次辦理（路線 A）\n💡 市區商場自助退稅機可提前完成，省機場排隊時間',
    diagram: [
      { label: '路線 A　退稅 < ₩75,000', badge: '→ 自助機台', badgeColor: '#1a5276', badgeBg: '#eaf4fb' },
      { label: '路線 B　退稅 ≥ ₩75,000', badge: '→ 直接人工櫃台', badgeColor: '#6c3483', badgeBg: '#f4ecf7' },
    ],
  },
  {
    step: '03',
    title: '辦理登機 & 通關',
    location: '航空公司報到櫃台',
    color: '#5E9977',
    desc: '完成航空公司報到手續、託運行李、通過證照查驗與安全檢查。',
    detail: '📌 路線 B（高價商品）需在通關前完成海關蓋章，商品須隨身帶給海關驗看，蓋章後才可託運。\n📌 路線 A 正常辦理，無需帶商品給海關。',
    diagram: [],
  },
  {
    step: '04',
    title: '領取退稅現款',
    location: '通關後 4 號登機口斜對面 / 樓梯下方',
    color: '#5E9977',
    desc: '出示護照與退稅單，選擇領取貨幣後當場取款。',
    detail: '⏰ 營業時間：06:30 – 21:00\n💵 可領：韓元（₩）、美金（$）、日圓（¥）\n⚠️ 若在營業時間外，需投入退稅信封箱並填寫：\n   ・護照英文姓名\n   ・信用卡號（退款將匯回卡片）\n⏱ 建議預留 30 分鐘以上，人工櫃台有不固定休息時間',
    diagram: [
      { label: '韓元 ₩', badge: '現場領取', badgeColor: '#27ae60', badgeBg: '#eafaf1' },
      { label: '美金 $', badge: '現場領取', badgeColor: '#27ae60', badgeBg: '#eafaf1' },
      { label: '日圓 ¥', badge: '現場領取', badgeColor: '#27ae60', badgeBg: '#eafaf1' },
      { label: '信用卡匯款', badge: '非營業時間用', badgeColor: '#e67e22', badgeBg: '#fef9e7' },
    ],
  },
];

/* ── Global Blue 退稅級距 ───────────────────────────── */
const TAX_TABLE = [
  { range: '15,000 – 29,999', refund: '1,000' },
  { range: '30,000 – 49,999', refund: '2,000' },
  { range: '50,000 – 74,999', refund: '3,000' },
  { range: '75,000 – 99,999', refund: '5,000' },
  { range: '100,000 – 124,999', refund: '7,000' },
  { range: '125,000 – 149,999', refund: '9,000' },
  { range: '150,000 – 199,999', refund: '11,000' },
  { range: '200,000 – 249,999', refund: '14,000' },
  { range: '300,000 – 349,999', refund: '21,000' },
  { range: '500,000 – 549,999', refund: '35,000' },
];

/* ── 退稅資格 ────────────────────────────────────────── */
const REQUIREMENTS = [
  { icon: '🛂', text: '非韓國居民之外國遊客', sub: '停留 6 個月以內' },
  { icon: '🧾', text: '單日單店消費滿 ₩15,000', sub: '2024 年起新制，含稅金額' },
  { icon: '🪪', text: '出示護照正本', sub: '結帳時及機場辦理均須攜帶' },
  { icon: '📅', text: '購物後 3 個月內出境', sub: '超過期限退稅單失效' },
];

/* ── 注意事項 ────────────────────────────────────────── */
const TIPS = [
  { title: '並非所有店家都有退稅', body: '認明店門口或收銀台的「TAX FREE」、「Global Blue」、「GLOBAL TAX FREE」貼紙，結帳前先確認，結帳後才索取退稅單通常不被受理。' },
  { title: '提前完成登記省排隊', body: '釜山市區（西面樂天、海雲台新世界等）部分商場設有自助退稅機，可在購物後立即掃描，不必等到機場才辦，尤其適合最後一天行程緊湊時。' },
  { title: '預留充足機場時間', body: '建議在報到程序外額外預留 30 分鐘辦理退稅，人工查驗若有排隊可能更久。如退稅金額小、時間緊，可評估是否值得排隊。' },
  { title: '貨幣換算小技巧', body: '現場領韓元再換台幣通常匯率優於直接領美金，建議先查當日匯率再決定領取幣別。' },
  { title: '退稅單填寫提醒', body: '部分退稅單需手寫填入：護照號碼、出境日、簽名。建議購物後當天確認是否填妥，避免機場前補填浪費時間。' },
];

/* ── 主元件 ─────────────────────────────────────────── */
const BusanTaxFreeGuide = () => {
  const [open, setOpen] = useState(false);
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});
  const [showTable, setShowTable] = useState(false);
  const [openTips, setOpenTips] = useState<Record<number, boolean>>({});

  const toggleStep = (i: number) =>
    setOpenSteps(prev => ({ ...prev, [i]: !prev[i] }));
  const toggleTip = (i: number) =>
    setOpenTips(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', background: 'var(--color-bg-card)', overflow: 'hidden', marginBottom: '1.25rem' }}>

      {/* ── Header toggle ── */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
      >
        <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>🏷️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-main)' }}>金海機場退稅完整攻略</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-light)', marginTop: 2 }}>退稅資格 · 三種類型 · 4 步驟圖解 · 級距參考</div>
        </div>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>

          {/* ── 退稅資格 ── */}
          <div style={{ paddingTop: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>✅ 退稅資格</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {REQUIREMENTS.map((r, i) => (
                <div key={i} style={{ background: 'var(--color-bg-input)', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{r.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.4, marginBottom: 2 }}>{r.text}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-light)', lineHeight: 1.4 }}>{r.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 三種退稅類型 ── */}
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 14 }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💳 三種退稅類型</div>
          {TYPES.map((t, i) => (
            <div key={i} style={{ marginBottom: 8, border: `1.5px solid ${t.color}33`, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: `${t.color}10` }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{t.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, background: t.color, color: 'white', padding: '1px 6px', borderRadius: 3 }}>{t.tag}</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-light)', marginTop: 1 }}>{t.labelEn}</div>
                </div>
              </div>
              <div style={{ padding: '10px 12px', borderTop: `1px solid ${t.color}22` }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 6 }}>{t.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-light)', lineHeight: 1.6, background: 'var(--color-bg-input)', borderRadius: 6, padding: '6px 10px' }}>
                  {t.note}
                </div>
              </div>
            </div>
          ))}

          {/* ── 機場退稅流程圖解 ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>📍 金海機場退稅流程（圖解）</div>

          {/* Flow connector */}
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative' as const }}>
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <div style={{ position: 'absolute' as const, left: 20, top: '100%', width: 2, height: 12, background: `${s.color}55`, zIndex: 0 }} />
              )}

              <div style={{ marginBottom: i < STEPS.length - 1 ? 12 : 8, border: `1.5px solid ${s.color}44`, borderRadius: 10, overflow: 'hidden' }}>
                <button
                  onClick={() => toggleStep(i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: `${s.color}10`, border: 'none', cursor: 'pointer', textAlign: 'left' as const }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {s.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-main)' }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--color-text-light)', marginTop: 1 }}>📍 {s.location}</div>
                  </div>
                  <ChevronIcon open={!!openSteps[i]} />
                </button>

                {openSteps[i] && (
                  <div style={{ padding: '10px 12px', borderTop: `1px solid ${s.color}22` }}>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0 0 10px' }}>{s.desc}</p>

                    {/* Diagram blocks */}
                    {s.diagram.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                        {s.diagram.map((d, di) => (
                          <div key={di} style={{ background: 'white', border: `1px solid ${s.color}44`, borderRadius: 8, padding: '7px 10px', flex: '1 1 auto', minWidth: 80 }}>
                            <div style={{ fontSize: 11, color: 'var(--color-text-main)', fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{d.label}</div>
                            <span style={{ fontSize: 10, fontWeight: 700, color: d.badgeColor, background: d.badgeBg, padding: '1px 6px', borderRadius: 3 }}>{d.badge}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Detail lines */}
                    <div style={{ background: 'var(--color-bg-input)', borderRadius: 8, padding: '8px 10px' }}>
                      {s.detail.split('\n').map((line, li) => (
                        <div key={li} style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{line}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* ── 退稅級距表 ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <button
            onClick={() => setShowTable(!showTable)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', marginBottom: 10 }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)' }}>📊 Global Blue 退稅級距參考</div>
            <ChevronIcon open={showTable} />
          </button>

          {showTable && (
            <div style={{ overflowX: 'auto' as const }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 12 }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-input)' }}>
                    <th style={{ padding: '7px 10px', textAlign: 'left' as const, color: 'var(--color-text-muted)', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>購物金額（韓元）</th>
                    <th style={{ padding: '7px 10px', textAlign: 'right' as const, color: '#27ae60', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>退稅金額（₩）</th>
                  </tr>
                </thead>
                <tbody>
                  {TAX_TABLE.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '6px 10px', color: 'var(--color-text-muted)' }}>{row.range}</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right' as const, fontWeight: 600, color: 'var(--color-text-main)' }}>₩{row.refund}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--color-bg-input)' }}>
                    <td colSpan={2} style={{ padding: '6px 10px', fontSize: 10, color: 'var(--color-text-light)', textAlign: 'center' as const }}>
                      以上為 Global Blue 系統參考級距，實際退稅依店家合作系統而異
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ── 注意事項 ── */}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '14px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)', marginBottom: 10 }}>💡 退稅實用提醒</div>
          {TIPS.map((tip, i) => (
            <div key={i}>
              <button
                onClick={() => toggleTip(i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', textAlign: 'left' as const }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-main)' }}>{tip.title}</span>
                <ChevronIcon open={!!openTips[i]} />
              </button>
              {openTips[i] && (
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.65, padding: '0 0 8px', borderBottom: i < TIPS.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  {tip.body}
                </div>
              )}
              {!openTips[i] && i < TIPS.length - 1 && (
                <div style={{ height: 1, background: 'var(--color-border)' }} />
              )}
            </div>
          ))}

          {/* ── 來源 ── */}
          <div style={{ marginTop: 14, padding: '8px 10px', background: 'var(--color-bg-input)', borderRadius: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-light)', lineHeight: 1.6 }}>
              資料來源：
              <a href="https://lizzzstyle.tw/busan-taxfree/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', marginRight: 8 }}>lizzzstyle.tw</a>
              <a href="https://helena.tw/busan-taxfree/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }}>helena.tw</a>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default BusanTaxFreeGuide;
