# PG Agent

A professional platform for real estate agents to manage and list Paying Guest (PG) accommodations.

## 🏠 Core Features

### For Agents
- **PG Listings Management**: Add, edit, and manage PG properties
- **Location-based Search**: Help clients find PGs in specific areas
- **Interactive Dashboard**: Monitor all your listings in one place
- **Google Maps Integration**: Pinpoint exact PG locations

### For Clients
- **Find Nearby PGs**: Search for PGs in desired locations
- **Detailed Listings**: View comprehensive PG information
- **Contact Agents**: Direct communication with property agents

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js
- **UI Library**: Shadcn UI + Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Geospatial Indexing
- **Authentication**: JWT
- **Geocoding**: Google Maps Geocoding API

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas or local MongoDB
- Google Cloud Platform account (for Maps API)

### Setup
1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update .env with your credentials
   npm start

2. **Frontend**
   ```bash
cd client
npm install
cp .env.example .env
# Update .env with your API keys
npm start
