@echo off
echo Starting Galaxy Deals Backend Server...
cd C:\Claude\backend
start "Galaxy Deals Backend" cmd /k "npm run dev"

timeout /t 3

echo Starting Galaxy Deals Frontend Server...
cd C:\Claude\frontend
start "Galaxy Deals Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000/api/health
echo Frontend: http://localhost:3000
echo.
echo Wait 10-15 seconds for servers to fully start, then test again.
pause