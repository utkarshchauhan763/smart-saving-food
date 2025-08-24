# 🚀 Start Full MERN Stack - Smart Saving Food
# This script starts both frontend and backend servers

Write-Host "🚀 Starting Smart Saving Food - Full Stack" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

Write-Host "`n🔧 Prerequisites Check:" -ForegroundColor Yellow
Write-Host "✅ Node.js required" -ForegroundColor White
Write-Host "✅ MongoDB required (MongoDB Compass or local MongoDB)" -ForegroundColor White
Write-Host ""

# Check if MongoDB is running
Write-Host "📡 Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "✅ MongoDB is running on localhost:27017" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB not detected. Please start MongoDB Compass or local MongoDB server." -ForegroundColor Red
        Write-Host "   You can still run the app - it will use fallback mode." -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host "`n🎯 Starting servers..." -ForegroundColor Yellow
Write-Host "📍 Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Start backend in background
Write-Host "🚀 Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\start-backend.ps1"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "🚀 Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; .\start-frontend.ps1"

Write-Host "`n🎉 Both servers are starting!" -ForegroundColor Green
Write-Host "🌐 Open your browser and go to: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📋 API documentation: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 Close the PowerShell windows to stop the servers" -ForegroundColor Red

Read-Host "`nPress Enter to continue..."
