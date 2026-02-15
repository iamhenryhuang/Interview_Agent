# Interview Agent

Mock interviews with AI. Upload a resume, pick a mode, get scored and feedback as you go.

## Modes

| Mode | What it is | Resume? | Questions from |
|------|------------|:-------:|----------------|
| General | Tech + behavioral | ✅ | AI (from resume) |
| Technical | Projects, depth | ✅ | AI (from resume) |
| Behavioral | Situations, soft skills | ✅ | AI (from resume) |
| Coding Test | Algo & data structures | ❌ | Local (30 questions) |
| System Design | Architecture | ❌ | Local (15 questions) |

Resume-based modes use Gemini to generate questions from your PDF. Coding and System Design use built-in question banks, no API calls for the questions themselves.

- PDF resume: drag & drop, text is extracted for the AI
- Per-question scoring and feedback
- Coding: built-in IDE, multiple languages, complexity notes
- Design: evaluated on API shape, data model, scalability, etc.
- Report: radar chart, per-question recap, suggestions
- History in localStorage

## Stack

- Frontend: HTML, vanilla CSS, JS (ES modules)
- Backend: Node, Express
- AI: Google Gemini 2.5 Flash
- PDF: pdf-parse
- Fonts: DM Serif Display, Inter, JetBrains Mono

## Layout

```
interview_agent/
├── server.js
├── package.json
├── .env                    # GEMINI_API_KEY
├── src/
│   ├── gemini.js           # client + callGemini()
│   ├── prompts/            # interview, coding, design, summary
│   ├── routes/             # upload, interview, coding, design
│   └── data/               # coding-questions.js (30), design-questions.js (15)
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/                 # main, api, timer, canvas, upload, interview, coding, design, result, history
└── uploads/                # temp PDFs
```

## API

| Method | Path | Calls Gemini? |
|--------|------|:-------------:|
| POST | `/api/upload-resume` | no |
| POST | `/api/start-interview` | yes |
| POST | `/api/evaluate-answer` | yes |
| POST | `/api/interview-summary` | yes |
| POST | `/api/start-coding-test` | no |
| POST | `/api/evaluate-code` | yes |
| POST | `/api/start-system-design` | no |
| POST | `/api/evaluate-design` | yes |
| POST | `/api/specialized-summary` | yes |

## Run

```bash
npm install
# add GEMINI_API_KEY to .env
node server.js
# http://localhost:3000
```
