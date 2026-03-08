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

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

module.exports = async function handler(req, res) {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const items = await Item.find().sort({ createdAt: -1 });
      res.status(200).json(items);
    } else if (req.method === 'POST') {
      const { title, description, category, price, listingType, wasteCategory, quantity, imageUrl } = req.body;
      
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
      res.status(201).json(savedItem);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
