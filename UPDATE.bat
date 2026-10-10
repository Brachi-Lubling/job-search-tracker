@echo off
setlocal

cd /d "%~dp0"
title Job Search Tracker - Production Update

where node >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed or is not available in PATH.
    pause
    exit /b 1
)

where docker >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed or is not available in PATH.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm ci
    if errorlevel 1 (
        echo Dependency installation failed.
        pause
        exit /b 1
    )
)

echo Building the production version and deploying pending migrations...
call npm run update:production
if errorlevel 1 (
    echo Production update failed. Review the build and migration output before starting the app.
    pause
    exit /b 1
)

echo Production build updated. Start the system with START.bat.
pause