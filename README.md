# Simple Food Waste Map

A simple system to show nearby food surplus and shortage areas on a map.

## What it does

- Shows nearby areas with surplus food (green markers)
- Shows nearby areas with food shortages (red markers)
- Simple map interface

## How to run

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend  
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

- `GET /api/food-waste/surplus` - Get surplus food areas
- `GET /api/food-waste/shortages` - Get shortage areas

## Test API
```bash
cd backend
npm test
```

That's it! Very simple system focused only on showing food areas on a map. 