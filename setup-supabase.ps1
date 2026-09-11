# ============================================================
# Portfolio Website — Supabase Setup Script
# Run this AFTER creating your Supabase project at supabase.com
# Usage:  .\setup-supabase.ps1
# ============================================================

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Portfolio Website — Supabase Configuration  " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "You need a free Supabase project. If you haven't created one yet:" -ForegroundColor Yellow
Write-Host "  1. Go to https://supabase.com  (free, no credit card)" -ForegroundColor Yellow
Write-Host "  2. Sign In / Sign Up" -ForegroundColor Yellow
Write-Host "  3. Click 'New Project', give it a name, choose a region, click 'Create'" -ForegroundColor Yellow
Write-Host "  4. Wait ~1 minute for it to be ready" -ForegroundColor Yellow
Write-Host "  5. Go to: Project Settings → API" -ForegroundColor Yellow
Write-Host "  6. Copy the 'Project URL' and 'anon public' key" -ForegroundColor Yellow
Write-Host ""

$supabaseUrl  = Read-Host "Paste your Supabase Project URL (e.g. https://abcxyz.supabase.co)"
$supabaseKey  = Read-Host "Paste your Supabase anon public key"

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "ERROR: Both values are required." -ForegroundColor Red
    exit 1
}

if (-not $supabaseUrl.StartsWith("https://")) {
    Write-Host "ERROR: URL must start with https://" -ForegroundColor Red
    exit 1
}

# Write .env
$envContent = @"
VITE_SUPABASE_URL=$supabaseUrl
VITE_SUPABASE_ANON_KEY=$supabaseKey
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8
Write-Host ""
Write-Host "SUCCESS: .env file written." -ForegroundColor Green
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Next: Set up the database                   " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open your Supabase Dashboard → SQL Editor" -ForegroundColor Yellow
Write-Host "2. Click 'New query'" -ForegroundColor Yellow
Write-Host "3. Paste and run the contents of:  supabase\schema.sql" -ForegroundColor Yellow
Write-Host "4. Then paste and run:             supabase\rls.sql" -ForegroundColor Yellow
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Next: Create the admin user                 " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "In Supabase Dashboard → Authentication → Users → Add user:" -ForegroundColor Yellow
Write-Host "  Email:    2400032678@kluniversity.in" -ForegroundColor White
Write-Host "  Password: (your chosen password)" -ForegroundColor White
Write-Host "  Check:    'Auto Confirm User'" -ForegroundColor White
Write-Host ""
Write-Host "Then click 'Create User'." -ForegroundColor Yellow
Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Storage Buckets                             " -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "In Supabase Dashboard → Storage → New bucket, create 4 PUBLIC buckets:" -ForegroundColor Yellow
Write-Host "  avatars  |  projects  |  certifications  |  resumes" -ForegroundColor White
Write-Host ""
Write-Host "For each bucket add these policies (Storage → bucket → Policies):" -ForegroundColor Yellow
Write-Host "  SELECT: allow for anon  -> true" -ForegroundColor White
Write-Host "  INSERT: allow for authenticated -> auth.uid() is not null" -ForegroundColor White
Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  All set! Starting dev server...             " -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

npm run dev
