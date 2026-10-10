@echo off
setlocal

cd /d "%~dp0"
title Job Search Tracker - Development

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

echo Starting PostgreSQL and applying development migrations...
call docker compose up -d
if errorlevel 1 (
    echo Could not start PostgreSQL.
    pause
    exit /b 1
)

call npm run db:migrate
if errorlevel 1 (
    echo Development migrations failed.
    pause
    exit /b 1
)

call npm run dev

echo.
echo The application has stopped. Press any key to close this window.
pause >nul