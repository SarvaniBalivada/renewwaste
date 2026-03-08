require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Serve static files from the React app's public directory
app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  dotfiles: 'ignore'
}));

// Handle manifest.json specifically
app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manifest.json'));
});

app.get('/%PUBLIC_URL%/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manifest.json'));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

// Basic route for testing
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saisairam075_db_user:sarvani9418@cluster0.m7i3acf.mongodb.net/';
console.log('Connecting to MongoDB...');

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'wasteloop-secret-key-2024';

// ==================== MONGOOSE MODELS ====================

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// Item Schema
const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    listingType: { type: String, default: 'sell' },
    wasteCategory: { type: String, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', itemSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    itemId: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: { type: String, default: 'placed' },
    orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ==================== ITEMS API ====================

// POST - Create new item
app.post('/api/items', async (req, res) => {
  try {
    const { title, description, category, price, listingType, wasteCategory, quantity, imageUrl } = req.body;
    console.log('Received item data:', req.body);

    if (!title || !wasteCategory || !quantity || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newItem = new Item({
      title,
      description: description || '',
      category: category || '',
      price: listingType === 'sell' ? Number(price) : 0,
      imageUrl,
      listingType: listingType || 'sell',
      wasteCategory,
      quantity: Number(quantity)
    });

    const savedItem = await newItem.save();
    console.log('Item saved to database:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Fetch all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    console.log('Sending items to frontend:', items);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ==================== AUTH API ====================

// POST - Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = new User({
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// POST - Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// ==================== ORDERS API ====================

// POST - Create order
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    
    const { deliveryAddress } = req.body;
    
    if (!deliveryAddress) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide your complete delivery address'
      });
    }

    const newOrder = new Order({
      userId: 'anonymous',
      itemId: req.body.itemId || 'temp-id',
      deliveryAddress,
      status: 'placed'
    });

    const savedOrder = await newOrder.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Thank you! Your order has been placed successfully.',
      order: savedOrder 
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Sorry, we could not place your order. Please try again.'
    });
  }
});

// GET - Fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ==================== FEEDBACK API ====================

app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Feedback received:', { name, email, message });
  res.status(201).json({ message: 'Feedback submitted successfully' });
});

// Catch-all route for React (SPA) - must be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
