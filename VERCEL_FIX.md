# 🔧 Fix Vercel Deployment Error

You're seeing a 502 Bad Gateway error. This is because Vercel needs to know where your Next.js app is in the monorepo.

## Quick Fix (2 minutes)

### Option 1: Change Root Directory in Vercel Settings

1. **Go to Project Settings:**
   https://vercel.com/startuplive/depotclear/settings

2. **Click "General" in the left sidebar**

3. **Scroll to "Root Directory"**
   - Click "Edit"
   - Enter: `apps/web`
   - Click "Save"

4. **Scroll to "Build & Development Settings"**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: (leave as default `.next`)
   - Install Command: `npm install`

5. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

---

### Option 2: Simpler - Deploy Only the Web App

Instead of deploying the whole monorepo, deploy just the web app:

1. **Disconnect current project** (optional)

2. **Create new Vercel project:**
   ```bash
   cd /Users/myles/depotclear/apps/web
   vercel
   ```
   - Link to existing project or create new one
   - Framework: Next.js
   - Root: `./` (current directory)

3. **This deploys only the Next.js app** (cleaner!)

---

## What Happened?

Your repo structure:
```
depotclear/
├── apps/
│   └── web/          ← Next.js app is HERE
├── packages/
│   └── scraper/
└── vercel.json       ← Vercel was looking HERE
```

Vercel was trying to build from the root, but your Next.js app is in `apps/web/`.

---

## After Fixing

Once deployment succeeds, you should see:
- ✅ Build successful
- ✅ Deployment URL: https://depotclear-xxx.vercel.app
- ✅ No more 502 errors

Then add your environment variables and you're live! 🚀
