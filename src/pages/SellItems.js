import React, { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import API_BASE_URL from '../config';

function SellItems() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: null,
    imageUrl: '',
    listingType: 'sell',
    wasteCategory: '',
    quantity: ''
  });

  const [openPopup, setOpenPopup] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          
          const response = await fetch('https://api.imgbb.com/1/upload?key=a70cab1997d85fa756fa4bfbc83877b3', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();
          if (data.data.url) {
            setFormData(prev => ({
              ...prev,
              imageUrl: data.data.url
            }));
          }
        } catch (error) {
          setError('Failed to upload image. Please try again.');
          console.error('Upload error:', error);
        }
      }
    };

    input.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields before submission
      if (!formData.title || !formData.description || !formData.wasteCategory) {
        setError('Please fill in all required fields');
        return;
      }

      // If listing type is 'sell', validate price
      if (formData.listingType === 'sell' && !formData.price) {
        setError('Please enter a price for selling items');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add this to include cookies
        body: JSON.stringify({
          ...formData,
          // Set price to 0 for non-sell listings
          price: formData.listingType !== 'sell' ? 0 : formData.price
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to list item');
      }

      setOpenPopup(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        image: null,
        imageUrl: '',
        listingType: 'sell',
        wasteCategory: '',
        quantity: ''
      });
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to list item. Please try again.');
    }
  };

  return (
    <div className="sell-items">
      <h1>List Your Items</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="sell-form">
        <div className="form-group">
          <label>Listing Type</label>
          <select
            name="listingType"
            value={formData.listingType}
            onChange={handleChange}
            required
          >
            <option value="sell">Sell</option>
            <option value="donate">Donate (Free)</option>
            <option value="exchange">Exchange</option>
          </select>
        </div>

        <div className="form-group">
          <label>Waste Category</label>
          <select
            name="wasteCategory"
            value={formData.wasteCategory}
            onChange={handleChange}
            required
          >
            <option value="">Select Waste Type</option>
            <option value="industrial">Industrial Waste</option>
            <option value="organic">Organic/Compostable</option>
            <option value="recyclable">Recyclable Materials</option>
          </select>
        </div>

        {formData.listingType === 'sell' && (
          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Quantity (kg/units)</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <button 
            type="button" 
            onClick={handleImageUpload}
            className="upload-button"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Upload Image
          </button>
          {formData.imageUrl && (
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              style={{ maxWidth: '200px', marginTop: '10px' }}
            />
          )}
        </div>
        <button type="submit" className="submit-button">List Item</button>
      </form>

      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Success!</DialogTitle>
        <DialogContent>
          Your item has been listed successfully in the marketplace.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div className="sustainability-info" style={{
        backgroundColor: '#e8f5e9',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ color: '#2e7d32' }}>🌱 Make a Difference!</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>♻️ Exchange or donate items to support local communities</li>
          <li>🏭 Help reduce industrial waste through proper recycling</li>
          <li>🌿 Turn organic waste into valuable compost</li>
        </ul>
      </div>
    </div>
  );
}

export default SellItems;