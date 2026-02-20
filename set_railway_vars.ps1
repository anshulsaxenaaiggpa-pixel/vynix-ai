# Vynix AI - Railway Environment Variables Upload Script
# Reads from .env.production and sets each variable on Railway
#
# Usage:
#   1. Make sure you have the Railway CLI installed and are logged in (railway login)
#   2. Link your project: railway link
#   3. Run: .\set_railway_vars.ps1

$envFile = Join-Path $PSScriptRoot ".env.production"

if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env.production not found at $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "Reading .env.production and uploading variables to Railway..." -ForegroundColor Cyan
Write-Host ""

$count = 0
foreach ($line in Get-Content $envFile) {
    # Skip blank lines and comments
    if ($line -match '^\s*$' -or $line -match '^\s*#') { continue }

    # Skip placeholder values
    if ($line -match 'REPLACE_ME' -or $line -match 'REPLACE_WITH') {
        $key = $line.Split("=")[0]
        Write-Host "  SKIPPED (placeholder): $key" -ForegroundColor DarkYellow
        continue
    }

    $key = $line.Split("=")[0].Trim()
    Write-Host "  Setting $key..." -ForegroundColor Yellow
    railway variables set $line
    $count++
}

Write-Host ""
Write-Host "Done! Set $count variables on Railway." -ForegroundColor Green
Write-Host ""
Write-Host "Still need to add manually in Railway Dashboard (sensitive / placeholders):" -ForegroundColor Yellow
Write-Host "  - HF_API_TOKEN              (from hf.co/settings/tokens)"
Write-Host "  - RAZORPAY_WEBHOOK_SECRET   (from Razorpay Dashboard > Webhooks)"
Write-Host ""
Write-Host "Then redeploy: railway up" -ForegroundColor Cyan
