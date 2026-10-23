# Fraud-O-Mat v3.4

An intentionally satirical, deliberately non-authoritative analyzer of marketing offers.
Formal assessment comes first; a sarcastic reading of the **same text** follows.

## What's new

- Reworked responsive cream / ink dashboard (Russian + English).
- Six explicitly risk-oriented criteria scored 0–3, with supporting excerpts and a deterministic heuristic index.
- Server-side Gemini access: no client-embedded API key.
- An atomic shared daily quota counter via Upstash Redis REST (two model calls per analysis).
- Escaped model output, strict JSON validation, length checks and same-origin browser checks.
- Sample reports available without spending quota. OpenRouter connection is reserved for v3.5.

## Configuration

This project is a Vite frontend with two native Vercel Functions in `api/`.
Use Node.js 22+. Run `npm install`, then `npx vercel dev` for full-stack local development;
plain `npm run dev` serves **only the frontend**, not the API routes.

Set these **server-side** environment variables in the Vercel project's
Production/Preview/Development scopes, or in a local untracked `.env.local`:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key; never sent to the browser |
| `GEMINI_MODEL` | Optional; defaults to `gemini-2.5-flash` |
| `GEMINI_RPD_LIMIT` | Optional; defaults to 20 provider requests/day |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

Create an Upstash Redis database (the free tier is sufficient at 10 reports/day)
and connect it to the Vercel project. **Until the Redis variables are configured,
the API fails closed and does not call Gemini.** No fake remaining quota is displayed.

`npm run typecheck` validates client and server TypeScript.
`npm run build` builds the production frontend.

## How the shared quota works

By default Gemini's 20 RPD permit 10 complete reports (2 model calls each).
`GET /api/quota` returns the number of *unreserved reports for this website*.
`POST /api/analyze` atomically reserves two requests in Redis before the first
provider call. The daily key changes at midnight **America/Los_Angeles**.
Failed requests remain reserved conservatively; there is no unsafe refund.
Google's actual quota is authoritative: external calls from the same API project
can cause 429 errors sooner. The UI explicitly labels the counter as site usage,
not an exact reading of Google AI Studio. RPM/TPM limits are independent.

Do **not** assume the endpoint is abuse-proof: daily quota limits total consumption
but a hostile user could exhaust a small shared allowance. Before a wider launch
consider verified bot protection and per-client rate limiting.

## Privacy and limitations

The provider receives the submitted text for both stages. No text is stored by
this application and errors do not echo the submitted offer to logs. The user is
asked to omit personal data, secrets and non-public contracts. The scores reflect
rhetorical red flags **in the provided text**, not a finding of fraud or legal advice.

To keep production unchanged during review, use the `feature/v3.4-refurbishment`
branch and its GitHub pull request. Rotate an earlier Gemini key if it was exposed
by a previous client-side build.
