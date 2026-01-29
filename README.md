# Admin + Website Backend (Node.js + Express + PostgreSQL + Prisma + Swagger)

## 1) O'rnatish
```bash
cp .env.example .env
npm i
```

## 2) DB ishga tushirish (Docker)
```bash
docker compose up -d
```

## 3) Prisma migrate + generate
```bash
npm run prisma:gen
npm run prisma:mig
```

## 4) Admin seed (birinchi admin)
```bash
npm run seed
```
.env ichida:
- SEED_ADMIN_EMAIL
- SEED_ADMIN_PASSWORD

## 5) Run
```bash
npm run dev
```

## Swagger
`http://localhost:5000/api/docs`

## Auth
- Admin token: `POST /api/admin/auth/login`
- User token: `POST /api/auth/login` / `POST /api/auth/register`

Admin himoyalangan endpointlarda:
`Authorization: Bearer <ADMIN_TOKEN>`
