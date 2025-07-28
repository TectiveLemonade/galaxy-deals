# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Galaxy Deals is a location-based restaurant deals marketplace website that connects local diners with restaurant promotions in their area. The application features a galaxy-themed design with colors including black, pink, purple, and blue.

## Technology Stack

### Frontend
- **Next.js 15** with TypeScript and App Router
- **Tailwind CSS** with custom galaxy theme colors
- Location: `frontend/`
- Port: 3000 (default Next.js)

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- Location: `backend/`
- Port: 5000

## Common Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server on port 3000
npm run build        # Build for production
npm run start        # Start production server
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server with nodemon on port 5000
npm start            # Start production server
```

## Architecture

### Database Models
- **User**: User profiles, authentication, preferences, location, favorite deals
- **Restaurant**: Restaurant profiles, location (GeoJSON), hours, cuisine types, ratings
- **Deal**: Restaurant deals with types (percentage, fixed-amount, BOGO, free-item), validity periods
- **Category**: Deal categories with icons and colors
- **Redemption**: Deal redemption tracking with unique codes

### API Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user profile
- `GET /api/deals` - Get deals with location/filter support
- `GET /api/deals/:id` - Get deal details
- `GET /api/restaurants` - Get restaurants with location filtering
- `GET /api/restaurants/:id` - Get restaurant details with deals

### Key Features
- **Location-based search**: Uses MongoDB's 2dsphere indexing for geospatial queries
- **User roles**: 'user', 'restaurant', 'admin' with different permissions
- **Deal analytics**: View counts, redemption tracking, conversion rates
- **Responsive design**: Mobile-first approach with galaxy theme

### Frontend Components Structure
- Homepage: Hero section, featured deals grid, how-it-works section
- Galaxy theme: Custom Tailwind colors and gradients
- Location services: Browser geolocation API integration

## Environment Setup

### Backend Environment Variables (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-deals
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Database Connection
MongoDB connection string points to local instance. Ensure MongoDB is running before starting the backend server.