# PowerShell Deployment Script for Vercel

Write-Host "🚀 Deploying to Vercel with Error Prevention..." -ForegroundColor Green

# Clean up any existing .vercel directory to prevent conflicts
if (Test-Path ".vercel") {
    Write-Host "🧹 Removing existing .vercel directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".vercel"
}

# Clean previous build
Write-Host "🧹 Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Install terser if not present
try {
    npm list terser | Out-Null
    Write-Host "✅ Terser already installed" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing terser..." -ForegroundColor Yellow
    npm install terser --save-dev
}

# Build the project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (-not (Test-Path "dist")) {
    Write-Host "❌ Build failed! dist directory not found." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Build output:" -ForegroundColor Cyan
Get-ChildItem "dist" | Format-Table Name, Length, LastWriteTime

# Check for common Vercel issues
Write-Host "🔍 Checking for common Vercel issues..." -ForegroundColor Yellow

# Check if vercel.json is valid
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json found" -ForegroundColor Green
    
    # Check for mixed routing properties
    $vercelContent = Get-Content "vercel.json" -Raw
    if ($vercelContent -match '"routes"' -and ($vercelContent -match '"headers"' -or $vercelContent -match '"rewrites"')) {
        Write-Host "❌ Mixed routing properties detected in vercel.json" -ForegroundColor Red
        Write-Host "   This will cause deployment errors. Please fix vercel.json" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️  No vercel.json found - using default Vercel configuration" -ForegroundColor Yellow
}

# Check for conflicting files
if (Test-Path "now.json") {
    Write-Host "❌ Conflicting now.json found - please remove it" -ForegroundColor Red
    exit 1
}

if (Test-Path ".now") {
    Write-Host "❌ Conflicting .now directory found - please remove it" -ForegroundColor Red
    exit 1
}

Write-Host "✅ No configuration conflicts detected" -ForegroundColor Green

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
Write-Host "📋 Deployment options:" -ForegroundColor Cyan
Write-Host "   1. Deploy to production (--prod)" -ForegroundColor White
Write-Host "   2. Deploy to preview" -ForegroundColor White
Write-Host "   3. Just build and exit" -ForegroundColor White

$choice = Read-Host "Choose option (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Deploying to production..." -ForegroundColor Green
        vercel --prod
    }
    "2" {
        Write-Host "🚀 Deploying to preview..." -ForegroundColor Green
        vercel
    }
    "3" {
        Write-Host "✅ Build completed. Ready for manual deployment." -ForegroundColor Green
        Write-Host "📁 Upload the 'dist' folder contents to your hosting platform." -ForegroundColor Cyan
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Deployment process completed!" -ForegroundColor Green 