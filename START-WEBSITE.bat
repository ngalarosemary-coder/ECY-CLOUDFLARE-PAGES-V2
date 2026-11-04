@echo off
cd /d "%~dp0"
if not exist node_modules (
  call npm ci
)
if not exist .env (
  echo Copy .env.example to .env and configure the admin credentials and shipping rates first.
  pause
  exit /b 1
)
start "EL CARTEL DE YONG API" cmd /k npm run server
call npm run dev
