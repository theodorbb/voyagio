# Start Voyagio locally with a clean build cache.
# Fixes the recurring "won't start after an update" issue caused by a stale/
# OneDrive-corrupted .next cache. Run from the project root:  .\start-local.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

# 1. Stop any dev server still holding the .next folder.
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Remove the stale build cache so Next.js rebuilds cleanly.
foreach ($p in @(".next", "tsconfig.tsbuildinfo")) {
    if (Test-Path $p) { Remove-Item -Recurse -Force $p -ErrorAction SilentlyContinue }
}

# 3. Use the portable Node bundled in the repo and start the dev server.
$env:PATH = "$PSScriptRoot\.tools\node;$env:PATH"
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

Write-Host "Starting Voyagio on http://localhost:3000 ..." -ForegroundColor Green
node node_modules\next\dist\bin\next dev --port 3000
