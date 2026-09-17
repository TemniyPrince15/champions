# Pathly AI — LOCUS Case 02 Build

Pathly is a profile-first admission journey product. The core scenario is:

`Landing → Auth → Profile onboarding → Admission Brief → Recommendations → Why this fits → Compare → Roadmap → Next Action → Progress`

## Included
- Public landing page with value proposition, motivation, student stories and CTA.
- Demo auth flow (email/password + Google CTA).
- 3-step onboarding profile.
- Guardrails for age, grade, GPA, IELTS 0–9 by 0.5, SAT 400–1600 by 10, budget and target year.
- Explainable deterministic recommendation engine.
- Curated program cards + global university discovery endpoint.
- Deadline status: upcoming / passed / verify.
- Scholarship / funding module.
- Compare and shortlist.
- Roadmap with completion state and next action.
- Editable achievements and activities.
- Multilingual UI: English, Russian, Kazakh, Chinese, German, Spanish.
- Dark/light theme and compact/comfortable/large interface sizes.
- Responsive/mobile layout and reduced-motion support.

## Data transparency
Curated admissions facts are explicitly marked as demo data in the UI and should be verified against official university pages before real application decisions. Global directory results are discovery-only unless a university/program has a curated record.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Pathly AI setup

The app now includes a real server-side AI layer through the OpenAI Responses API.

1. Copy `.env.example` to `.env.local`.
2. Set `OPENAI_API_KEY` to your server-side API key.
3. Optionally set `OPENAI_MODEL` (default: `gpt-5.6-luna`).
4. Run `npm install` and then `npm run dev`.

The browser never receives the API key. Without a key, Pathly falls back to the local recommendation engine so the interface remains usable.

### AI behavior
- `Analyze my route` analyzes the current profile and current Pathly matches.
- `Ask Pathly` can answer questions, identify profile gaps, explain trade-offs and suggest universities.
- AI recommendations are constrained to the supplied university catalog IDs; admissions facts marked as demo data should still be verified on official university websites.

### Product structure
Pathly remains a single-page application shell, but the UX is split into distinct screens/views: landing, account, onboarding, Overview, Universities, Shortlist, Roadmap, Funding and Profile. Navigation changes the active view without a full page reload.
