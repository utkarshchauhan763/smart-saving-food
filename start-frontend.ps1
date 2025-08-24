# 🚀 Start Frontend Development Server
# PowerShell script to start the React frontend

Write-Host "🚀 Starting Smart Saving Food Frontend..." -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🏃 Starting development server..." -ForegroundColor Yellow
Write-Host "🌐 Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start the development server
npm run dev
