#!/bin/bash

echo "🚀 Starting deployment process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

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

# Create a simple server configuration for testing
echo "🌐 Creating server configuration..."
cat > dist/_headers << EOF
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/*.js
  Content-Type: application/javascript

/*.css
  Content-Type: text/css

/*.html
  Content-Type: text/html
EOF

echo "✅ Deployment files ready!"
echo "📤 Upload the contents of the 'dist' folder to your hosting platform."
echo "🔗 Make sure your hosting platform supports SPA routing." 