#!/bin/bash

echo "🚀 Deploying Backend with Database Configuration..."

# Database credentials
DB_HOST="sql12.freesqldatabase.com"
DB_USER="sql12791893"
DB_PASSWORD="3ALYm8PAgb"
DB_NAME="sql12791893"
DB_PORT="3306"

echo "📊 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Port: $DB_PORT"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test database connection
echo "🔍 Testing database connection..."
node -e "
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: '$DB_HOST',
  user: '$DB_USER',
  password: '$DB_PASSWORD',
  database: '$DB_NAME',
  port: $DB_PORT
});

pool.getConnection()
  .then(conn => {
    console.log('✅ Database connection successful!');
    conn.release();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
  echo "✅ Database connection test passed!"
else
  echo "❌ Database connection test failed!"
  exit 1
fi

# Start the server
echo "🚀 Starting backend server..."
echo "📊 API will be available at: http://localhost:5001/api"
echo "🔗 Health check: http://localhost:5001/api/health"
echo "📋 Tasks API: http://localhost:5001/api/tasks"
echo "💰 Finance API: http://localhost:5001/api/finances"

npm start 