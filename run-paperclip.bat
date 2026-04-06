@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20+ was not found on PATH.
  exit /b 1
)

where pnpm.cmd >nul 2>nul
if errorlevel 1 (
  where npm >nul 2>nul
  if errorlevel 1 (
    echo npm was not found on PATH.
    exit /b 1
  )
  echo Installing pnpm 9.15.4...
  call npm install -g pnpm@9.15.4
  if errorlevel 1 exit /b 1
)

set "RUNNING_PORT="
set "RUNNING_PORT_FILE=%TEMP%\paperclip-running-port.txt"
if exist "%RUNNING_PORT_FILE%" del /f /q "%RUNNING_PORT_FILE%" >nul 2>nul
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; foreach ($port in 3100..3110) { try { $r = Invoke-RestMethod ('http://127.0.0.1:' + $port + '/api/health') -TimeoutSec 2; if ($r.status -eq 'ok') { Set-Content -Path $env:RUNNING_PORT_FILE -Value $port; exit 0 } } catch {} } exit 1"
if not errorlevel 1 if exist "%RUNNING_PORT_FILE%" (
  set /p RUNNING_PORT=<"%RUNNING_PORT_FILE%"
  echo Paperclip is already running at http://127.0.0.1:!RUNNING_PORT!
  start "" "http://127.0.0.1:!RUNNING_PORT!"
  exit /b 0
)

if not exist "node_modules" (
  echo Installing dependencies...
  call pnpm.cmd install
  if errorlevel 1 exit /b 1
)

set "PAPERCLIP_HOME=%USERPROFILE%\paperclip-dev-home"
set "PAPERCLIP_INSTANCE_ID=local-dev-win"
set "PAPERCLIP_MIGRATION_AUTO_APPLY=true"
set "PAPERCLIP_MIGRATION_PROMPT=never"
set "PAPERCLIP_UI_DEV_MIDDLEWARE=true"
set "PAPERCLIP_OPEN_ON_LISTEN=true"
set "PAPERCLIP_EMBEDDED_POSTGRES_WINDOWS_X64_ROOT=%USERPROFILE%\paperclip-embedded-postgres-windows-x64"

echo Preparing Windows dev runtime...
call node scripts\prepare-windows-dev.mjs
if errorlevel 1 exit /b 1

echo Building plugin SDK...
call pnpm.cmd --filter @paperclipai/plugin-sdk build
if errorlevel 1 exit /b 1

echo Starting Paperclip...
echo UI will be available at http://127.0.0.1:3100
call pnpm.cmd --filter @paperclipai/server run dev:watch

exit /b %ERRORLEVEL%
