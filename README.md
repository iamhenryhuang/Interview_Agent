# Interview Agent

Practice mock interviews with AI. Upload your resume (PDF), pick a mode, answer questions, and get scored with feedback as you go.

## What it does

- **Resume-based modes** (General / Technical / Behavioral): AI generates questions from your PDF. Uses Gemini to tailor questions and grade your answers.
- **Coding Test**: Built-in 30 algo questions, local IDE, multiple languages. No resume needed.
- **System Design**: 15 built-in questions on API design, data models, scalability.

You get per-question scores, feedback, and a final report (radar chart + recap).

## Modes

| Mode | Resume? | Question source |
|------|:-------:|-----------------|
| General | ✅ | AI (from resume) |
| Technical | ✅ | AI (from resume) |
| Behavioral | ✅ | AI (from resume) |
| Coding Test | ❌ | Local (30 Qs) |
| System Design | ❌ | Local (15 Qs) |

## Stack

- Frontend: HTML, vanilla CSS, JS (ES modules)
- Backend: Node, Express
- AI: Google Gemini 2.5 Flash
- PDF: pdf-parse

## Project structure

```
interview_agent/
├── server.js
├── package.json
├── .env                 # GEMINI_API_KEY
├── src/
│   ├── gemini.js
│   ├── prompts/
│   ├── routes/
│   └── data/            # coding-questions.js, design-questions.js
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/
└── uploads/             # temp PDFs
```

## API

| Method | Path |
|--------|------|
| POST | `/api/upload-resume` |
| POST | `/api/start-interview` |
| POST | `/api/evaluate-answer` |
| POST | `/api/interview-summary` |
| POST | `/api/start-coding-test` |
| POST | `/api/evaluate-code` |
| POST | `/api/start-system-design` |
| POST | `/api/evaluate-design` |
| POST | `/api/specialized-summary` |

## Run

```bash
npm install
# add GEMINI_API_KEY to .env
node server.js
# http://localhost:3000
```
