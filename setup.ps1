# Portfolio - Setup completo GitHub
# Esegui questo script con: 右键 -> "Run with PowerShell"

$ErrorActionPreference = "Stop"
cd "E:\Obsidian Vault\portfolio\portfolio"

Write-Host "=== Portfolio GitHub Setup ===" -ForegroundColor Magenta

# 1. Installa Git se mancante
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git non trovato. Installo via winget..." -ForegroundColor Yellow
    try {
        winget install --id Git.Git -e --source winget
        # refresh PATH
        $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
    } catch {
        Write-Host "ERRORE: Installa Git manualmente da https://git-scm.com/download/win" -ForegroundColor Red
        pause
        exit
    }
}

# 2. Config git
git config user.name "lukas220586" 2>$null
git config user.email "lukas220586@gmail.com" 2>$null
git config --global user.name "lukas220586"
git config --global user.email "lukas220586@gmail.com"

# 3. Init repo
Write-Host "Init repository..." -ForegroundColor Cyan
git init
git add -A
git commit -m "Initial commit: portfolio con 3D interactive scrolling effects"

# 4. Crea branch e aggiungi remote
git branch -M main
git remote add origin https://github.com/lukas220586/portfolio.git

# 5. Push
Write-Host "Push su GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "=== FATTO! ===" -ForegroundColor Green
Write-Host "Il sito sara' live tra ~2 minuti su:" -ForegroundColor White
Write-Host "https://lukas220586.github.io/portfolio/" -ForegroundColor Magenta
Write-Host "GitHub Pages e' automatico via .github/workflows/deploy.yml" -ForegroundColor White
pause
