# Crazy Fantasy Official Website

## Overview
Crazy Fantasy 公式HP (Version 1.0)
Built with Next.js (App Router), Tailwind CSS, and Supabase.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Language**: TypeScript

## Getting Started

### 1. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

```bash
cp .env.local.example .env.local
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
The app uses i18n routing (`/ja`, `/en`). The root `/` redirects to `/ja` by default.

## Project Structure

- `src/app/[lang]/` - Localized routes (pages)
- `src/components/ui/` - Reusable UI components (including 8bit styled components)
- `src/lib/supabase/` - Supabase client configuration
- `docs/` - Requirements and Schema documentation

## Deployment
Deploy to Vercel is recommended.
Connect your repository to Vercel and set the Environment Variables.
