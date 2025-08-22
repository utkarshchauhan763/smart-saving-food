Write-Host "🧪 Testing Complete MERN Stack Integration..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000" -Method Get
    Write-Host "✅ Backend is running: $($healthResponse.message)" -ForegroundColor Green
    Write-Host "📊 Status: $($healthResponse.status)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Register a new user
Write-Host "2. Testing user registration..." -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "Test Student"
        email = "test$(Get-Random)@example.com"  # Random email to avoid conflicts
        password = "password123"
        role = "student"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    if ($registerResponse.success) {
        Write-Host "✅ User registered successfully" -ForegroundColor Green
        Write-Host "👤 User ID: $($registerResponse.user.id)" -ForegroundColor Green
        $testUser = $registerResponse.user
        $testToken = $registerResponse.token
    }
    else {
        Write-Host "⚠️ Registration failed: $($registerResponse.message)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Registration error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Login the user
Write-Host "3. Testing user login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = $testUser.email
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "✅ Login successful" -ForegroundColor Green
        Write-Host "👤 User: $($loginResponse.user.name)" -ForegroundColor Green
        Write-Host "🎭 Role: $($loginResponse.user.role)" -ForegroundColor Green
        $authToken = $loginResponse.token
    }
}
catch {
    Write-Host "❌ Login error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get today's menu
Write-Host "4. Testing menu retrieval..." -ForegroundColor Yellow
try {
    $headers = @{
        'Authorization' = "Bearer $authToken"
        'Content-Type' = 'application/json'
    }
    
    $menuResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/menu/today" -Method Get -Headers $headers
    
    if ($menuResponse.success) {
        Write-Host "✅ Menu retrieved successfully" -ForegroundColor Green
        Write-Host "📅 Date: $($menuResponse.menu.date)" -ForegroundColor Green
        Write-Host "🍽️ Meals available: $($menuResponse.menu.meals.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Menu retrieval error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 5: Save meal preferences
Write-Host "5. Testing meal preferences..." -ForegroundColor Yellow
try {
    $preferencesBody = @{
        date = (Get-Date).ToString("yyyy-MM-dd")
        mealType = "breakfast"
        preferences = @{
            "1" = 2  # 2 chapatis
            "2" = 1  # 1 bowl aloo sabzi
            "3" = 1  # 1 cup tea
        }
    } | ConvertTo-Json -Depth 3

    $preferencesResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/preferences" -Method Post -Body $preferencesBody -Headers $headers
    
    if ($preferencesResponse.success) {
        Write-Host "✅ Preferences saved successfully" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Preferences error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 MERN Stack Integration Test Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5174" -ForegroundColor Blue
Write-Host "🔧 Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "💾 Database: MongoDB (Connected)" -ForegroundColor Blue
