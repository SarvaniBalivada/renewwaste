module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { name, email, message } = req.body;
      console.log('Feedback received:', { name, email, message });
      res.status(201).json({ message: 'Feedback submitted successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
