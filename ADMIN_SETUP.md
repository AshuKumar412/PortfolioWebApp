# Admin Credentials Setup

## Creating the Admin User in Supabase

> **Security note:** The admin password is managed entirely by Supabase Authentication.
> It is NEVER stored in source code, `.env` files, or the browser.

---

### Step 1 — Open Supabase Dashboard

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → Your Project

---

### Step 2 — Create the Admin User

Go to **Authentication → Users → Add user → Create new user**

Fill in:
- **Email:** `2400032678@kluniversity.in`
- **Password:** *(the password you want to use — stored only in Supabase, not anywhere in this codebase)*
- Check **"Auto Confirm User"**

Click **Create User**.

---

### Step 3 — Test Login

Open [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

Enter:
- Email: `2400032678@kluniversity.in`
- Password: *(the password you set in Step 2)*

On success you'll be redirected to `/admin`.

---

### Step 4 — Change Password Later (if needed)

In Supabase Dashboard → **Authentication → Users** → find your user → **Send Password Reset** or update directly.

---

## Security Principles Applied

| What | How |
|------|-----|
| Password storage | Supabase Auth only — never in JS/HTML/env |
| Browser key | Only `anon` key (safe for public) — no `service_role` key |
| Route protection | `ProtectedRoute` component + Supabase session check |
| Database protection | Row Level Security on all tables |
| Error messages | Generic — never reveals auth internals to the UI |
