# Portfolio Website — Setup Guide

A premium, recruiter-ready personal portfolio with React.js + Supabase.

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

---

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd portfolio-website
npm install
```

---

## 2. Supabase Setup

### 2.1 Create a new Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Choose a name, password, and region

### 2.2 Run the database schema

1. In your Supabase dashboard → **SQL Editor**
2. Paste and run the contents of `supabase/schema.sql`
3. Then paste and run `supabase/rls.sql`

### 2.3 Create Storage buckets

In **Storage → New bucket**, create these 4 **public** buckets:

| Bucket name      | Public |
|------------------|--------|
| `avatars`        | ✅ Yes |
| `projects`       | ✅ Yes |
| `certifications` | ✅ Yes |
| `resumes`        | ✅ Yes |

For each bucket, add Storage policies:
- **SELECT** → allow for `anon` role → `true`
- **INSERT** → allow for `authenticated` → `auth.uid() is not null`
- **UPDATE** → allow for `authenticated` → `auth.uid() is not null`
- **DELETE** → allow for `authenticated` → `auth.uid() is not null`

### 2.4 Create an admin user

In **Authentication → Users → Add user**:
- Enter your email + a strong password
- This is your admin dashboard login

---

## 3. Configure Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Fill in your values from **Project Settings → API**:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 4. Run Locally

```bash
npm run dev
```

Visit:
- **Portfolio**: http://localhost:5173
- **Admin dashboard**: http://localhost:5173/admin
- **Login**: http://localhost:5173/login

---

## 5. Populate Your Portfolio

1. Go to `/login` and sign in with your Supabase user
2. Start with **Profile** — set your name, bio, photo, and resume
3. Add **Skills**, **Projects**, **Education**, **Experience**, etc.
4. Changes are **instantly live** on the public portfolio

---

## 6. Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 7. Deploy

### Vercel (recommended)

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in **Vercel Dashboard → Settings → Environment Variables**:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Add a `vercel.json` for SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Netlify

Add a `public/_redirects` file:

```
/* /index.html 200
```

Then deploy with:
```bash
npm run build
netlify deploy --prod --dir dist
```

---

## 8. Post-Deployment

- Update `public/sitemap.xml` — replace `your-domain.com` with your real URL
- Update `public/robots.txt` — same replacement
- Add OG image: place a `og-image.png` (1200×630px) in `/public`
- Add canonical URL back in `index.html`: `<link rel="canonical" href="https://your-domain.com/" />`

---

## Project Structure

```
src/
├── components/
│   ├── portfolio/       # Public-facing section components
│   │   ├── Navbar, Hero, About, Skills, Education,
│   │   ├── Experience, Projects, Certifications,
│   │   ├── Achievements, Contact, Footer, BackToTop
│   └── ui/              # Shared: Button, Badge, Modal, Toast, Spinner...
├── context/             # AuthContext, ThemeContext
├── hooks/               # useScrollReveal, useCrud
├── layouts/             # AdminLayout (sidebar)
├── pages/
│   ├── Portfolio.jsx    # Public SPA
│   ├── Login.jsx
│   └── admin/           # All admin CRUD pages
├── services/            # Supabase service layer (one per table)
├── styles/              # variables.css, base.css, animations.css
└── utils/               # formatters.js, validators.js
supabase/
├── schema.sql           # All CREATE TABLE statements
└── rls.sql              # Row Level Security policies
```

---

## Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 18 + Vite                |
| Routing    | React Router DOM v6            |
| Database   | Supabase (PostgreSQL)          |
| Auth       | Supabase Auth                  |
| Storage    | Supabase Storage               |
| Styling    | Pure CSS3 with CSS Variables   |
| Deployment | Vercel / Netlify               |
