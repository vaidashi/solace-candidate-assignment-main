## Solace Candidate Assignment

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies

```bash
npm i
```

Run the development server:

```bash
npm run dev
```

Run the automated checks:

```bash
npm test
npm run lint
npm run build
```

## Database set up

The app is configured to return a default list of advocates. This allows you to get the app up and running without needing to configure a database. If you’d like to configure a database, you’re encouraged to do so.

1. Feel free to use whatever configuration of postgres you like. The project is set up to use docker-compose.yml to set up postgres. The url is in .env.

```bash
docker compose up -d
```

2. Create a `solaceassignment` database.

3. Push migration to the database

```bash
npx drizzle-kit push
```

4. Seed the database

```bash
curl -X POST http://localhost:3000/api/seed
```

5. Test the API rate limit

```bash
sh test-rate-limit.sh
```
