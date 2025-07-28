#!/bin/bash

echo "🚀 Deploying to Vercel with Error Prevention..."

# Clean up any existing .vercel directory to prevent conflicts
if [ -d ".vercel" ]; then
    echo "🧹 Removing existing .vercel directory..."
    rm -rf .vercel
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install terser if not present
if ! npm list terser > /dev/null 2>&1; then
    echo "📦 Installing terser..."
    npm install terser --save-dev
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build output:"
ls -la dist/

# Check for common Vercel issues
echo "🔍 Checking for common Vercel issues..."

# Check if vercel.json is valid
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Check for mixed routing properties
    if grep -q '"routes"' vercel.json && (grep -q '"headers"' vercel.json || grep -q '"rewrites"' vercel.json); then
        echo "❌ Mixed routing properties detected in vercel.json"
        echo "   This will cause deployment errors. Please fix vercel.json"
        exit 1
    fi
else
    echo "⚠️  No vercel.json found - using default Vercel configuration"
fi

# Check for conflicting files
if [ -f "now.json" ]; then
    echo "❌ Conflicting now.json found - please remove it"
    exit 1
fi

if [ -d ".now" ]; then
    echo "❌ Conflicting .now directory found - please remove it"
    exit 1
fi

echo "✅ No configuration conflicts detected"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "📋 Deployment options:"
echo "   1. Deploy to production (--prod)"
echo "   2. Deploy to preview"
echo "   3. Just build and exit"

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to production..."
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying to preview..."
        vercel
        ;;
    3)
        echo "✅ Build completed. Ready for manual deployment."
        echo "📁 Upload the 'dist' folder contents to your hosting platform."
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "✅ Deployment process completed!" 