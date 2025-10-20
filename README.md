# DepotClear – Nationwide Home Depot Clearance Finder

A nimble, AI-assisted application that continuously crawls Home Depot's public endpoints to identify clearance and reduced-price items nationwide, correlating them to local store availability.

## 🏗️ Project Structure

```
depotclear/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # FastAPI backend
├── packages/
│   ├── scraper/      # Home Depot data scraper
│   ├── database/     # Database schemas and migrations
│   └── shared/       # Shared utilities and types
└── docs/             # Documentation
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Run scraper
npm run scraper
```

## 🧰 Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI (Python)
- **Scraper**: Playwright + Cheerio
- **Database**: PostgreSQL (Supabase)
- **Scheduler**: Vercel Cron
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel

## 📋 Development Roadmap

- [x] Project structure setup
- [ ] Prototype scraper (1-2 categories)
- [ ] Data normalization & storage
- [ ] Store correlation + geolocation
- [ ] Frontend search UI
- [ ] Automated refresh system
- [ ] AI insights layer
- [ ] Production deployment

## 🔑 Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=your_postgres_url
OPENAI_API_KEY=your_openai_key
```

## 📄 License

MIT
