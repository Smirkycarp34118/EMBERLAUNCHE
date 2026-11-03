@echo off
chcp 65001 >nul
title EMBER Launcher - upload to GitHub
cd /d "%~dp0"

echo ==========================================
echo   EMBER Launcher - uploading to GitHub
echo ==========================================
echo.

if not exist ".git" (
  echo [1/4] Creating git repository...
  git init -b main
  git remote add origin https://github.com/Smirkycarp34118/EMBERLAUNCHE.git
) else (
  echo [1/4] Git repository already exists - reusing it.
)

echo [2/4] Adding files...
git add -A

echo [3/4] Creating commit...
git commit -m "Build: electron-builder for Windows .exe" >nul 2>&1

echo [4/4] Uploading to GitHub...
git push -u origin main --force

echo.
if %errorlevel%==0 (
  echo ==========================================
  echo   DONE! Code is on GitHub:
  echo   https://github.com/Smirkycarp34118/EMBERLAUNCHE
  echo ==========================================
) else (
  echo ==========================================
  echo   Upload FAILED. If it asked for a password,
  echo   use a GitHub token instead of your password.
  echo ==========================================
)
echo.
pause
