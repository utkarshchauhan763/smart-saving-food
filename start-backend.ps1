# 🚀 Start Smart Saving Food Backend
# PowerShell script to start the backend server

Write-Host "🚀 Starting Smart Saving Food Backend..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Change to server directory
Set-Location -Path "$PSScriptRoot\server"

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n🏃 Starting server..." -ForegroundColor Yellow
Write-Host "📡 Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 API endpoints:" -ForegroundColor Cyan
Write-Host "   - Auth: http://localhost:5000/api/auth" -ForegroundColor White
Write-Host "   - Menu: http://localhost:5000/api/menu" -ForegroundColor White
Write-Host "   - Admin: http://localhost:5000/api/admin" -ForegroundColor White
Write-Host "`n🛑 Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Start the server
node server.js
