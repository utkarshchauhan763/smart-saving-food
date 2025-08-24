# 🔄 Update Frontend for Production Backend
# Run this script after Railway deployment

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayURL
)

Write-Host "🔄 Updating Frontend Configuration..." -ForegroundColor Green
Write-Host "Railway Backend URL: $RailwayURL" -ForegroundColor Cyan

# Update .env.production
$envContent = @"
# Production Environment Variables - UPDATED
VITE_API_BASE_URL=$RailwayURL/api
VITE_RAILWAY_API=$RailwayURL/api
NODE_ENV=production
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8

# Update GitHub Actions to use production backend
$workflowPath = ".github/workflows/deploy.yml"
$workflowContent = Get-Content $workflowPath -Raw
$updatedWorkflow = $workflowContent -replace "run: npm run build", "run: npm run build
        env:
          VITE_API_BASE_URL: $RailwayURL/api"

$updatedWorkflow | Out-File -FilePath $workflowPath -Encoding UTF8

Write-Host "✅ Configuration updated!" -ForegroundColor Green
Write-Host "🚀 Committing and pushing changes..." -ForegroundColor Yellow

# Commit and push changes
git add .
git commit -m "Connect frontend to Railway backend: $RailwayURL"
git push

Write-Host "🎉 Frontend will now use your Railway backend!" -ForegroundColor Green
Write-Host "🌐 Your full-stack app will be live at:" -ForegroundColor Cyan
Write-Host "   Frontend: https://utkarshchauhan763.github.io/smart-saving-food/" -ForegroundColor White
Write-Host "   Backend:  $RailwayURL" -ForegroundColor White

Write-Host "`nWait 2-3 minutes for GitHub Pages to rebuild with the new backend connection." -ForegroundColor Yellow
