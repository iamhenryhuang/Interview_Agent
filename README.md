# Interview Agent — 模擬面試平台

AI 驅動的模擬面試平台：上傳履歷，選擇面試模式，獲得即時評分與回饋。

## 功能特色

### 面試模式

| 模式 | 說明 | 是否需要履歷 | 題目來源 |
|------|------|:---:|------|
| 綜合面試 | 技術 + 行為題 | ✅ | AI 依據履歷出題 |
| 技術面試 | 專案 & 技術深度 | ✅ | AI 依據履歷出題 |
| 行為面試 | 情境 & 軟技能 | ✅ | AI 依據履歷出題 |
| **Coding Test** | 演算法 & 資料結構 | ❌ | 本地題庫 (30 題) |
| **System Design** | 架構設計面試 | ❌ | 本地題庫 (15 題) |

### 核心功能
- **履歷 PDF 解析** — 拖放上傳，自動解析文字
- **即時評分** — 每題 AI 多維度評分與回饋
- **Coding IDE** — 支援多語言，時間/空間複雜度分析
- **設計評估** — API 設計、資料模型、擴展性等維度
- **面試報告** — 五維雷達圖、逐題回顧、面試官建議
- **歷史記錄** — localStorage 自動保存

## Tech Stack

- **Frontend:** HTML + Vanilla CSS + JavaScript (ES Modules)
- **Backend:** Node.js + Express
- **AI:** Google Gemini 2.5 Flash
- **PDF:** pdf-parse
- **Fonts:** DM Serif Display + Inter + JetBrains Mono

## 專案結構

```
interview_agent/
├── server.js                        # 入口（middleware + 路由掛載）
├── package.json
├── .env                             # GEMINI_API_KEY
│
├── src/                             # 後端模組
│   ├── gemini.js                    # Gemini client + callGemini()
│   ├── prompts/
│   │   ├── interview.js             # 面試出題 & 評估 prompt
│   │   ├── coding.js                # Coding 評估 prompt
│   │   ├── design.js                # Design 評估 prompt
│   │   └── summary.js              # 總結報告 prompt
│   ├── routes/
│   │   ├── upload.js                # POST /api/upload-resume
│   │   ├── interview.js             # start-interview, evaluate-answer, summary
│   │   ├── coding.js                # start-coding-test, evaluate-code
│   │   └── design.js                # start-system-design, evaluate-design, summary
│   └── data/
│       ├── coding-questions.js      # 30 題 Coding 題庫
│       └── design-questions.js      # 15 題 System Design 題庫
│
├── public/                          # 前端
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js                  # 入口：state, view, loading
│       ├── api.js                   # fetch 封裝
│       ├── timer.js                 # 計時器
│       ├── canvas.js                # Score Circle + Radar Chart
│       ├── upload.js                # 上傳 & 設定
│       ├── interview.js             # 傳統面試流程
│       ├── coding.js                # Coding Test 流程
│       ├── design.js                # System Design 流程
│       ├── result.js                # 結果頁面
│       └── history.js               # 歷史記錄
│
└── uploads/                         # PDF 暫存
```

## API Endpoints

| Method | Path | Description | API Call |
|--------|------|-------------|:---:|
| POST | `/api/upload-resume` | 上傳 PDF 並解析 | ❌ |
| POST | `/api/start-interview` | 依履歷生成面試題目 | ✅ |
| POST | `/api/evaluate-answer` | 評估單題回答 | ✅ |
| POST | `/api/interview-summary` | 生成面試總結報告 | ✅ |
| POST | `/api/start-coding-test` | 取得 Coding 題目 | ❌ |
| POST | `/api/evaluate-code` | 評估程式碼 | ✅ |
| POST | `/api/start-system-design` | 取得設計題目 | ❌ |
| POST | `/api/evaluate-design` | 評估設計方案 | ✅ |
| POST | `/api/specialized-summary` | Coding/Design 總結 | ✅ |

> Coding Test 和 System Design 的題目來自本地題庫，不消耗 API 額度。

## 開始使用

```bash
npm install

# 在 .env 中設定 GEMINI_API_KEY=your_key_here

node server.js
# → http://localhost:3000
```
