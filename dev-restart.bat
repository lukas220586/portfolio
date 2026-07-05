@echo off
cd /d "E:\Obsidian Vault\portfolio\portfolio"
echo Stopping old dev server...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Starting dev server...
start cmd /k "npm run dev"
echo Open http://localhost:5173/portfolio/ in your browser
echo Press Ctrl+Shift+R for hard refresh
