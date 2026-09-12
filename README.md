# Developer Portfolio & Admin CMS

A modern personal portfolio and CMS web application built with **React.js**, **JavaScript**, **Advanced CSS3**, and **Supabase**, deployed on **Vercel**.

🌐 **Live URL:** [https://portfolio-website-chi-seven-67.vercel.app](https://portfolio-website-chi-seven-67.vercel.app)  
🔐 **Admin Portal:** [https://portfolio-website-chi-seven-67.vercel.app/admin/login](https://portfolio-website-chi-seven-67.vercel.app/admin/login)

---

## Features

### Public Portfolio
- **Hero Section:** Animated typing title, availability indicator, profile photo with floating effect, CV download CTA, and quick social links.
- **About Me:** Dynamic experience statistics, biographical text, and contact highlights.
- **Skills & Tech:** Categorized technical skills with proficiency tags.
- **Education & Experience:** Chronological timeline of academic background and industry roles.
- **Projects:** Interactive filterable portfolio grid featuring live demo links and GitHub repository shortcuts.
- **Certifications & Achievements:** Showcase of verified credentials and awards.
- **Contact Form:** Secure message submission directly storing inquiries in Supabase.
- **Theme Switcher:** Dark and light mode toggle persisted locally.
- **Fully Responsive & Accessible:** Glassmorphism UI, WCAG-compliant color contrast, keyboard navigable, and optimized for mobile/desktop.

### Admin Dashboard (`/admin`)
- **Supabase Authentication:** Secure email/password login with session persistence.
- **Profile Management:** Edit full name, role, bio, contact links, stats, and toggle the availability badge in real time.
- **Media & File Storage:** Upload, replace, and remove profile pictures and PDF resumes via Supabase Storage buckets.
- **CRUD Operations:** Manage Projects, Skills, Education, Experience, Certifications, Achievements, Services, and Social Links.
- **Inquiry Management:** View and manage visitor contact form inquiries.
- **Security:** Strict PostgreSQL Row-Level Security (RLS) ensures only the authorized administrator can modify portfolio records.

---

## Tech Stack

- **Frontend:** React 19, JavaScript (ES modules), Vanilla CSS3 (Custom Properties & Animations), Vite
- **Routing:** React Router v7 with SPA rewrites
- **Database & Auth:** Supabase PostgreSQL with Row-Level Security (RLS)
- **Storage:** Supabase Storage (`avatars`, `projects`, `certifications`, `resumes`)
- **Hosting:** Vercel

---

## Local Development

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd "Portfolio Website"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## Production Deployment (Vercel)

The application is configured for Vercel with SPA routing in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

To deploy updates:
```bash
npx vercel --prod
```

Production deployment verification completed.
