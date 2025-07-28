# Galaxy Deals - Testing Guide

## Quick Test Steps

### 1. Install MongoDB (Required)
Choose one option:

**Option A: MongoDB Community Edition**
- Download: https://www.mongodb.com/try/download/community
- Install and start the service

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/atlas
- Create free cluster
- Update `backend/.env` with connection string

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
Should see: "Server running on port 5000" and "MongoDB Connected"

### 3. Start Frontend Server (New Terminal)
```bash
cd frontend  
npm run dev
```
Visit: http://localhost:3000

### 4. Test API Endpoints

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

**Get Deals:**
```bash
curl http://localhost:5000/api/deals
```

### 5. Expected Results
- ✅ Frontend shows galaxy-themed homepage
- ✅ Location permission prompt appears
- ✅ "No featured deals" message (until you add sample data)
- ✅ Responsive design works on different screen sizes

### 6. Add Sample Data (Optional)
After MongoDB is running, you can add test restaurants and deals via the API endpoints using the registration and deal creation routes.

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is installed and running
- Check connection string in `backend/.env`

**Frontend API Errors:**
- Verify backend is running on port 5000
- Check browser console for CORS issues

**Location not working:**
- Ensure HTTPS (localhost is okay)
- Allow location permissions in browser