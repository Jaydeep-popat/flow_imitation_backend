# Ayanshi BMS Backend

TypeScript-based backend API for Ayanshi BMS using Express and Prisma.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up database:
   ```bash
   cp .env.example .env
   # Edit .env with your database details
   npm run prisma:generate
   npm run prisma:migrate
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
npm start
```