# Build once, then serve Voyagio in production mode for a fast, demo-safe run.
# Use this for the presentation: pages are precompiled, so they load instantly
# instead of compiling on first visit like `next dev` does. Run from the root:
#   .\start-demo.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

# 1. Stop any dev/prod server still holding the build folder.
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# 2. Use the portable Node bundled in the repo.
$env:PATH = "$PSScriptRoot\.tools\node;$env:PATH"
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# 3. Produce a fresh optimized production build.
Write-Host "Building production bundle (one-time, ~1-2 min)..." -ForegroundColor Cyan
node node_modules\next\dist\bin\next build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Fix the errors above before the demo." -ForegroundColor Red
    exit 1
}

# 4. Serve the precompiled app. Pages now respond in milliseconds.
Write-Host "Starting Voyagio (production) on http://localhost:3000 ..." -ForegroundColor Green
node node_modules\next\dist\bin\next start --port 3000
