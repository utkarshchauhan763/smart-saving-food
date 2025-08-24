@echo off
echo 🚀 Starting Smart Saving Food Backend...
echo.

cd /d "%~dp0server"

echo 📦 Installing dependencies...
npm install

echo.
echo 🏃 Starting server...
echo 📡 Backend will be available at: http://localhost:5000
echo 🛑 Press Ctrl+C to stop the server
echo.

node server.js

pause
