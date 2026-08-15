# Meri GF Frontend

Premium Next.js frontend for the Meri GF companion experience.

## Screens

- `/` cinematic landing page
- `/login` Google sign-in entry screen
- `/companions` companion discovery
- `/companions/[id]` cinematic companion profile
- `/chat?companion=luna` themed chat shell

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The frontend defaults to `http://localhost:3000`.

If the backend is also using port `3000`, run the backend with `PORT=4000` locally and keep:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

## Production Env

```env
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NEXT_PUBLIC_API_BASE_URL=https://api.merigf.com/api/v1
```

Do not put AI provider keys, Google secrets, JWT secrets, or database credentials in frontend env variables.
