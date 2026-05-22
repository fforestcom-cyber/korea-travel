# Korea Travel App — CLAUDE.md

## 專案概述

韓國 5 天旅遊行程管理 App，用於規劃、記錄與追蹤旅遊相關資訊。

- **框架**：React 19 + TypeScript 4.9 + React Router 7
- **樣式**：`src/styles/template.css`（自訂 CSS class）＋ 元件 inline style
- **後端/資料庫**：Firebase 12（Firestore + Storage）
- **圖片 CDN**：Cloudinary（cloud: `dzflsgpjq`，preset: `korea-travel`）
- **專案路徑**：`D:\ClaudeCode\korea-travel`
- **線上網址**：https://korea-travel-751da.web.app

---

## 常用指令

```bash
npm start                                  # 啟動開發環境
DISABLE_ESLINT_PLUGIN=true npm run build   # 建置正式版（Windows 路徑大小寫問題須加此變數）
firebase deploy --only hosting             # 部署至 Firebase Hosting
```

> **Build 注意**：Windows 路徑大小寫不一致（`D:\claudecode` vs `D:\ClaudeCode`）會造成 ESLint plugin 衝突，建置時必須加 `DISABLE_ESLINT_PLUGIN=true`。

---

## 專案結構

```
src/
├── App.tsx                    # 根元件、路由設定、登入流程
├── index.tsx / index.css      # 進入點
├── styles/
│   └── template.css           # 全域 CSS（sl-*, note-*, btn 等 class 定義）
├── components/
│   ├── Navbar.tsx             # 頂部導覽列
│   ├── TaxiGuide.tsx          # 計程車叫車備查指南（Day1–5 目的地，點擊開啟 Naver 地圖）
│   ├── WowpassGuide.tsx       # WOWPASS 換匯機台地圖（釜山各區位置）
│   ├── CatchTableGuide.tsx    # 韓國訂位 App 캐치테이블 使用指南
│   ├── ToiletGuide.tsx        # 韓國廁所指南（韓文關鍵字複製）
│   ├── home/
│   │   └── WeatherCard.tsx    # 首頁天氣卡片
│   └── layout/
│       ├── AppWrapper.tsx     # 全域版面包裝
│       ├── DayPlanView.tsx    # 單日行程檢視（Firebase 驅動）
│       └── TabBar.tsx         # 底部分頁導覽列
├── pages/
│   ├── HomePage.tsx           # 首頁（天氣、旅程概覽）
│   ├── SchedulePage.tsx       # 行程頁（5 天行程 + 每日 Checklist）
│   ├── ChecklistPage.tsx      # 清單頁（購物清單卡片格）
│   ├── ExpensePage.tsx        # 費用頁（旅遊預算追蹤）
│   └── NotesPage.tsx          # 旅記頁（指南區塊 + 自由筆記）
├── data/
│   └── mockData.ts            # 靜態資料（機票、日期、匯率、天氣、待辦）
├── lib/
│   ├── firebase.ts            # Firebase 初始化（唯一初始化位置）
│   ├── authContext.tsx        # 登入狀態與 useIsOwner hook
│   └── storage.ts             # Cloudinary 圖片上傳封裝
└── types/
    ├── dayPlan.ts             # 單日行程相關型別
    └── index.ts               # 共用型別定義
scripts/
└── import-shopping.js         # 一次性購物清單匯入腳本（參考用）
```

---

## 路由（React Router 7）

路由設定在 `App.tsx`。新增頁面需同步更新 `App.tsx` 路由與 `TabBar.tsx` 導覽項目。

---

## Firebase 說明

元件**直接** import `firebase/firestore` 操作資料，`storage.ts` 僅封裝 Cloudinary 圖片上傳。`firebase.ts` 是唯一初始化入口，勿在其他地方呼叫 `initializeApp`。

**Firestore Collections：**

| Collection | 用途 | 可寫入者 |
|-----------|------|---------|
| `sectionCards` | 行程頁靜態行程卡 | 僅 owner |
| `cardOverrides` | 行程卡客製化覆蓋 | 僅 owner |
| `customCards` | 自訂行程卡 | 僅 owner |
| `checklistItems` | 行程頁每日 Checklist | 僅 owner |
| `shoppingItems` | 購物清單 | 僅 owner |
| `expenses` / `twd_expenses` | 費用記錄 | 任何登入用戶 |
| `notes` | 旅遊筆記 | 任何登入用戶 |

**Owner**：`abc022778@gmail.com`（`useIsOwner` hook 判斷）

**環境變數（`.env`，不可提交）：**
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

---

## 頁面與功能對應

| 頁面 | 檔案 | 功能 |
|------|------|------|
| 首頁 | `HomePage.tsx` | 天氣卡片、旅程概覽、行前 Checklist |
| 行程 | `SchedulePage.tsx` | 5 天行程（DayPlanView）+ 每日 Checklist（Firebase，樂觀更新） |
| 清單 | `ChecklistPage.tsx` | 購物清單卡片格、血條統計、勾選、右鍵貼圖、新增商品 |
| 費用 | `ExpensePage.tsx` | 費用記錄與統計 |
| 旅記 | `NotesPage.tsx` | TaxiGuide、WowpassGuide、CatchTableGuide、ToiletGuide ＋ 自由筆記 |

---

## 元件說明

### TaxiGuide（`src/components/TaxiGuide.tsx`）

靜態元件，放於旅記頁最頂部。

**結構：**
1. 叫車 App 比較（Uber / k.ride / Kakao T）
2. 最佳叫車策略
3. 各日目的地（Day 1–5）— 點擊卡片直接開啟 Naver 地圖導航
4. 叫車實用技巧

**資料修改：**
- `DAYS` 陣列：各日行程、韓文地址、`naver` 搜尋字串
- `TIPS` 陣列：技巧說明（支援 `<b>` / `<br>`）

---

### WowpassGuide（`src/components/WowpassGuide.tsx`）

靜態元件，放於旅記頁 TaxiGuide 下方。

**功能：**
- WOWPASS 簡介
- 釜山各區機台位置（金海機場、西面、南浦洞、海雲台、센텀시티），點擊開啟 Naver 地圖
- 使用技巧（App 下載、匯率說明、VISA 刷卡、餘額退款）

**資料修改：** `LOCATIONS` 陣列（新增/修改機台位置）

---

### CatchTableGuide（`src/components/CatchTableGuide.tsx`）

靜態元件，放於旅記頁 WowpassGuide 下方。

**功能：** App 安裝步驟（`SETUP`）、餐廳訂位清單（`PLACES`，含訂位狀態/韓文店名/備註）

---

### ToiletGuide（`src/components/ToiletGuide.tsx`）

靜態元件，放於旅記頁 CatchTableGuide 下方。

**功能：** 韓文關鍵字複製（`KEYWORDS`）、廁所地點說明（`TIPS`）

---

## ChecklistPage 說明

**ShoppingItem 型別：** `{ id, name, store, imageUrl, bought, createdAt }`

**功能：**
- 上方血條統計（各店家已買進度），可點選篩選
- 全部 / 未買 / 已買 切換
- 2 欄卡片格：勾選、刪除、圖片上傳
- **右鍵貼上**：在圖片區右鍵可直接從剪貼板貼上圖片（`navigator.clipboard.read()`）
- **新增商品**：清單末尾「＋ 新增商品」虛線格，點擊開啟 Modal，填入名稱、店家、圖片

**圖片：** 上傳至 Cloudinary `korea-travel/shopping/`，透過 `uploadImage()` 函式

**重置：** 「清空並重新匯入」按鈕重置為 `IMPORT_SEED` 內建資料（含 Cloudinary 圖片 URL）

---

## NotesPage 旅遊筆記說明

**Note 型別：** `{ id, title, text, imageUrl, dotColor, createdAt }`

- 內文 URL 自動渲染為可點擊連結（`renderWithLinks`）
- 支援圖片附件（上傳至 Cloudinary `korea-travel/notes/`）
- 三色圓點（yellow / green / blue）循環輪替

---

## SchedulePage Checklist 說明

`ChecklistPanel` 元件（在 `SchedulePage.tsx` 內）管理每日行前 Checklist。

- 資料存於 Firestore `checklistItems`，以 `dayNum` 區分各天
- **樂觀更新**：新增項目時立即更新本地 `items` state，Firebase 寫入在背景執行，失敗時 rollback
- 僅 owner 可新增/編輯/刪除

---

## Cloudinary 說明

- **Cloud Name**：`dzflsgpjq`
- **Upload Preset**：`korea-travel`（unsigned，前端可直接上傳）
- **上傳函式**：`uploadImage(file, folder)` in `src/lib/storage.ts`
- 購物清單圖片：`korea-travel/shopping/`
- 旅遊筆記圖片：`korea-travel/notes/`

---

## .claude/ 目錄

存放 Claude Code 對話設定，請勿手動刪除。
