// API Configuration - uses Vercel env variable or defaults to local
// For Vercel deployment, set REACT_APP_API_URL in Vercel dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');
export default API_BASE_URL;