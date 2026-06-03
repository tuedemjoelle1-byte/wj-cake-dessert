$projectRoot = Split-Path -Parent $PSScriptRoot

function Test-PortInUse {
  param([int]$Port)

  $match = netstat -ano | Select-String ":$Port "
  return $null -ne $match
}

function Start-ServiceWindow {
  param(
    [string]$Title,
    [string]$Command
  )

  Start-Process powershell `
    -WindowStyle Normal `
    -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot'; `$Host.UI.RawUI.WindowTitle = '$Title'; $Command"
}

if (-not (Test-PortInUse 4000)) {
  Start-ServiceWindow -Title "WJ Backend" -Command "npm run dev:api"
} else {
  Write-Host "Backend deja actif sur http://localhost:4000"
}

if (-not (Test-PortInUse 4178)) {
  Start-ServiceWindow -Title "WJ Frontend" -Command "`$env:FRONTEND_PORT='4178'; npm --prefix frontend run dev"
} else {
  Write-Host "Frontend deja actif sur http://localhost:4178"
}

if (-not (Test-PortInUse 4179)) {
  Start-ServiceWindow -Title "WJ Admin" -Command "`$env:ADMIN_PORT='4179'; npm --prefix admin run dev"
} else {
  Write-Host "Admin deja actif sur http://localhost:4179"
}

Write-Host ""
Write-Host "Acces projet :"
Write-Host "- Frontend : http://localhost:4178"
Write-Host "- Admin    : http://localhost:4179"
Write-Host "- Backend  : http://localhost:4000/api/v1"
Write-Host "- Swagger  : http://localhost:4000/swagger"
