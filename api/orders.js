const mongoose = require('mongoose');

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://saisairam075_db_user:sarvani9418@cluster0.m7i3acf.mongodb.net/';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(mongoose => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  status: { type: String, default: 'placed' },
  orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    
    if (req.method === 'POST') {
      const { deliveryAddress, itemId } = req.body;
      
      if (!deliveryAddress) {
        return res.status(400).json({ 
          success: false,
          error: 'Please provide your complete delivery address'
        });
      }
      
      const newOrder = new Order({
        userId: 'anonymous',
        itemId: itemId || 'temp-id',
        deliveryAddress,
        status: 'placed'
      });
      
      const savedOrder = await newOrder.save();
      res.status(201).json({ 
        success: true,
        message: 'Thank you! Your order has been placed successfully.',
        order: savedOrder 
      });
    } else if (req.method === 'GET') {
      const orders = await Order.find().sort({ orderDate: -1 });
      res.status(200).json(orders);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Sorry, we could not place your order. Please try again.'
    });
  }
};
