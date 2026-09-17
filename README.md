# Pathly AI

## Run locally

1. Install dependencies:
   `npm install`
2. Create `.env.local` in the project root (the same folder as `package.json`).
3. Put your OpenAI key there:
   `OPENAI_API_KEY=sk-proj-...`
   Quotes are optional.
4. Optional model:
   `OPENAI_MODEL=gpt-5.6-luna`
5. Restart the dev server after changing `.env.local`:
   `npm run dev`
6. Open `/api/ai` in the browser. It should show `configured: true` when Next.js can see the key.

Important: `.env.example` is only a template. Next.js does not use it as the runtime environment file.

## Routes

- `/` — landing
- `/auth` — login / registration
- `/onboarding` — profile setup
- `/app` — overview
- `/app/universities` — university discovery
- `/app/shortlist` — shortlist
- `/app/roadmap` — roadmap
- `/app/funding` — funding
- `/app/profile` — profile

The app now uses real browser routes, so the browser Back/Forward buttons work normally.

## AI

`/api/ai` is a server-side proxy to the OpenAI Responses API. The API key never goes into client-side JavaScript.

If the key is missing or OpenAI returns an error, Pathly falls back to its local recommendation engine and returns a diagnostic `errorCode`/`errorMessage` instead of silently hiding the problem.

## University photos

`/api/universities/photo` automatically resolves a university image from Wikimedia/Wikipedia and falls back to a generated SVG placeholder if no image is found. This avoids broken Unsplash URLs and keeps every university card visual.

## OpenAI setup

Create `.env.local` in the same directory as `package.json`:

```env
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-5.6-luna
```

Do not put the key in a `NEXT_PUBLIC_*` variable. Restart `npm run dev` after changing `.env.local`.

Verify the server sees the key by opening `/api/ai`. It should return `configured: true`. If it is false, Next.js is not reading the environment file. If it is true but chat fails, the response now reports the exact OpenAI HTTP/configuration error instead of silently switching to the local recommendation engine.

## App routes

- `/` landing
- `/auth` login/signup
- `/onboarding` onboarding
- `/app` overview
- `/app/universities` universities
- `/app/shortlist` shortlist
- `/app/roadmap` roadmap
- `/app/funding` funding
- `/app/profile` profile
