# RenewWaste

A full-stack web application for waste management and upcycling marketplace. Users can buy/sell recyclable items, place orders, and get upcycling ideas.

## Features

- User authentication (signup/login)
- Marketplace for buying/selling waste items
- Order placement with delivery address
- Upcycling ideas section
- Feedback system
- Responsive design with Material-UI

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Material-UI (MUI)
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd renewwaste
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

4. Set up environment variables:

Create `.env` file in the backend directory:
```
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=mongodb://127.0.0.1:27017/wasteloop
PORT=5000
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start both frontend (port 3000) and backend (port 5000) concurrently.

### Production Build
```bash
npm run build
```

### Start Backend Only
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Place new order

### Feedback
- `POST /api/feedback` - Submit feedback

## Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `build` folder to Netlify

### Backend (Heroku)
1. Ensure Procfile is present in backend directory
2. Set environment variables in Heroku
3. Deploy the backend folder

## Project Structure

```
renewwaste/
├── backend/                 # Express server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React context
│   └── App.js
├── public/                 # Static assets
├── build/                  # Production build
└── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
