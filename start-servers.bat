@echo off
echo Starting Galaxy Deals servers...

echo.
echo Starting Backend Server (Port 5000)...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo Starting Frontend Server (Port 3000)...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:5000/api/health
echo Frontend: http://localhost:3000
echo.
pause