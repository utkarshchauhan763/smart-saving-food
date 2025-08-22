Write-Host "🧪 Testing Smart Saving Food API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000" -Method Get
    Write-Host "✅ Health Check: $($healthResponse.message)" -ForegroundColor Green
    Write-Host "📊 Status: $($healthResponse.status)" -ForegroundColor Green
    Write-Host "🔗 Endpoints: $($healthResponse.endpoints.PSObject.Properties.Name -join ', ')" -ForegroundColor Green
}
catch {
    Write-Host "❌ Health check failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register User  
Write-Host "2. Testing user registration..." -ForegroundColor Yellow
try {
    $registerBody = @{
        name = "Test Student"
        email = "test@example.com"
        password = "password123"
        role = "student"
    } | ConvertTo-Json

    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    
    if ($registerResponse.success) {
        Write-Host "✅ User registered successfully" -ForegroundColor Green
        Write-Host "👤 User ID: $($registerResponse.user.id)" -ForegroundColor Green
        Write-Host "🔑 Token received" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Registration response: $($registerResponse.message)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Login User
Write-Host "3. Testing user login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    
    if ($loginResponse.success) {
        Write-Host "✅ Login successful" -ForegroundColor Green
        Write-Host "👤 User: $($loginResponse.user.name)" -ForegroundColor Green
        Write-Host "🎭 Role: $($loginResponse.user.role)" -ForegroundColor Green
        
        # Save token for further tests
        $token = $loginResponse.token
        
        # Test 4: Get Menu (requires authentication)
        Write-Host ""
        Write-Host "4. Testing menu endpoint..." -ForegroundColor Yellow
        try {
            $headers = @{
                'Authorization' = "Bearer $token"
                'Content-Type' = 'application/json'
            }
            
            $menuResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/menu/today" -Method Get -Headers $headers
            
            if ($menuResponse.success) {
                Write-Host "✅ Menu retrieved successfully" -ForegroundColor Green
                Write-Host "📅 Date: $($menuResponse.menu.date)" -ForegroundColor Green
            }
            else {
                Write-Host "⚠️ Menu response: $($menuResponse.message)" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "⚠️ Menu test: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "❌ Login failed: $($loginResponse.message)" -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 API Testing Complete!" -ForegroundColor Cyan
