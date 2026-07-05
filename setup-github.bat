@echo off
cd /d "E:\Obsidian Vault\portfolio\portfolio"

echo ============================================
echo  Portfolio - Setup GitHub Repository
echo ============================================
echo.
echo Step 1: Init git repo
git init
if %errorlevel% neq 0 ( echo FAILED & pause & exit /b )

echo.
echo Step 2: Add all files
git add -A

echo.
echo Step 3: Commit
git commit -m "Initial commit: portfolio site with interactive 3D scrolling effects"

echo.
echo Step 4: Add remote (crea il repo su GitHub prima!)
echo   1. Vai su https://github.com/new
echo   2. Repository name: portfolio
echo   3. Public
echo   4. NO README, NO .gitignore
echo   5. Clicca "Create repository"
echo.
echo   Poi torna qui e premi un tasto...
pause >nul

git remote add origin https://github.com/lukas220586/portfolio.git

echo.
echo Step 5: Push to GitHub
git branch -M main
git push -u origin main

echo.
echo ============================================
echo  FATTO!
echo  Vai su https://github.com/lukas220586/portfolio
echo  Settings ^> Pages ^> Source: GitHub Actions
echo ============================================
pause
