@echo off
setlocal

cd /d "%~dp0"
title Job Search Tracker

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or is not available in PATH.
    echo Install Node.js 18.18 or later and try again.
    pause
    exit /b 1
)

where docker >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed or is not available in PATH.
    echo Install and start Docker Desktop, then try again.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Dependencies are missing. Installing them now...
    call npm ci
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

if not exist ".next\BUILD_ID" (
    echo The production build is missing. Run UPDATE.bat first.
    pause
    exit /b 1
)

echo Starting PostgreSQL...
call docker compose up -d
if errorlevel 1 (
    echo Could not start PostgreSQL.
    pause
    exit /b 1
)

echo Starting the production application...
call npm run start:production

echo.
echo.
echo The application has stopped. Press any key to close this window.
pause >nul