@echo off
setlocal
cd /d "%~dp0"
title VENT - dev server

if not exist "package.json" (
  if exist "vent-source.zip" (
    echo Packar upp projektet...
    tar -xf "vent-source.zip"
    if errorlevel 1 (
      echo Kunde inte packa upp vent-source.zip. Hogerklicka den och valj "Extrahera alla" hit.
      pause
      exit /b 1
    )
  )
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js saknas. Installera Node 18+ fran https://nodejs.org och kor igen.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installerar dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install misslyckades.
    pause
    exit /b 1
  )
)

echo Startar VENT pa http://localhost:5173
start "" "http://localhost:5173"
call npm run dev
pause
