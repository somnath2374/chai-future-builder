
# EduChain Backend - Express + MongoDB

This is the Express.js backend with MongoDB for the EduChain project, designed to work alongside Supabase for dual storage.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file with:
   ```
   MONGODB_URI=mongodb://localhost:27017/educhain
   JWT_SECRET=your_jwt_secret_here_change_in_production
   SUPABASE_URL=https://lqhybljvkomdydaxlenb.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaHlibGp2a29tZHlkYXhsZW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNDM4NjUsImV4cCI6MjA1OTkxOTg2NX0.wRQbNjoQAcNF_lPWQ_Sby--TAFFQIZyc7MI8wZ7Mq_A
   PORT=3001
   ```

3. **Install MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Make sure MongoDB is running on `mongodb://localhost:27017`

4. **Run the Backend**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Wallet
- `GET /api/wallet` - Get user wallet
- `POST /api/wallet/roundup` - Add round-up transaction
- `POST /api/wallet/deposit` - Add deposit

### EduScore
- `GET /api/edu-score` - Get user's education score
- `POST /api/edu-score/complete-lesson` - Complete a lesson

### Sync
- `POST /api/sync/from-supabase` - Sync data from Supabase to MongoDB
- `GET /api/sync/status` - Get sync status

### Health
- `GET /api/health` - Health check

## Database Models

### User
- email, password, fullName
- supabaseId (for linking)

### Wallet
- userId, balance, roundupTotal, rewardsEarned
- supabaseUserId (for linking)

### Transaction
- walletId, userId, type, amount, status, description
- supabaseWalletId (for linking)

### EduScore
- userId, score, completedLessons
- supabaseUserId (for linking)

## Dual Storage Architecture

This backend is designed to work alongside your existing Supabase setup:

1. **Primary Storage**: Can be either Supabase or MongoDB
2. **Sync**: Automatic synchronization between both systems
3. **Fallback**: If one system fails, the other can take over
4. **Consistency**: Data is kept consistent across both platforms

## For Project Evaluation

This demonstrates:
- ✅ **M**ongoDB - Database storage
- ✅ **E**xpress - Web framework
- ✅ **R**eact - Frontend (existing)
- ✅ **N**ode.js - Backend runtime

The system maintains all your existing Supabase functionality while adding MongoDB + Express for redundancy and to meet MERN stack requirements.
