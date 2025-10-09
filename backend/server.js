require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');           // Add this
const jwt = require('jsonwebtoken');        // Add this

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
app.use(express.static(path.join(__dirname, '../public')));

// Handle manifest.json specifically
app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/manifest.json'));
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to WasteLoop API' });
});

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/wasteloop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Item Schema
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  imageUrl: { type: String, required: true },
  listingType: String,
  wasteCategory: { type: String, required: true },
  quantity: { type: Number, required: true },
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', itemSchema);

// Item Routes
app.post('/api/items', async (req, res) => {
  try {
    const { title, description, category, price, listingType, wasteCategory, quantity, imageUrl } = req.body;
    console.log('Received item data:', req.body);

    // Validate required fields
    if (!title || !wasteCategory || !quantity || !imageUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = new Item({
      title,
      description,
      category,
      price: listingType === 'sell' ? Number(price) : 0, // Ensure price is a number
      imageUrl,
      listingType,
      wasteCategory,
      quantity: Number(quantity) // Ensure quantity is a number
    });

    const savedItem = await item.save();
    console.log('Item saved to database:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET route to fetch all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    console.log('Sending items to frontend:', items); // Debug log
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Authentication routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,  // Updated this line
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

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
      process.env.JWT_SECRET,  // Updated this line
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// After Item Schema, add Order Schema
// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  deliveryAddress: { type: String, required: true },  // Changed to simple string
  status: { type: String, default: 'placed' },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Order Routes
app.post('/api/orders', async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    
    const { deliveryAddress } = req.body;
    
    // Simple validation with user-friendly message
    if (!deliveryAddress) {
      return res.status(400).json({ 
        success: false,
        error: 'Please provide your complete delivery address including:\n' +
              '- House/Flat No., Street Name\n' +
              '- Area/Locality\n' +
              '- City\n' +
              '- State\n' +
              '- PIN Code\n' +
              '- Contact Number'
      });
    }

    const order = new Order({
      userId: 'anonymous',
      itemId: req.body.itemId || 'temp-id',
      deliveryAddress,
      status: 'placed'
    });

    const savedOrder = await order.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Thank you! Your order has been placed successfully.\n' +
               'Delivery Address: ' + deliveryAddress,
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

// Add this at the end, before app.listen
// Error handling middleware should be last
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!'
  });
});

// GET route to fetch all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});