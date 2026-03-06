import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Select, MenuItem, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './CardStyles.css';
import API_BASE_URL from '../config';

function Marketplace() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/items`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !category || item.wasteCategory === category;
    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = async (item) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item._id,
          deliveryAddress,
          paymentMethod: 'COD'
        })
      });

      if (response.ok) {
        alert('Order placed successfully! You will receive it within 2-3 business days.');
        setOpenDialog(false);
        setDeliveryAddress('');
        setSelectedItem(null);
      } else {
        throw new Error('Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleOpenBuyDialog = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const getBadgeClass = (type) => {
    switch(type) {
      case 'sell': return 'badge-sell';
      case 'donate': return 'badge-donate';
      case 'exchange': return 'badge-exchange';
      default: return 'badge-sell';
    }
  };

  // Dynamic emoji based on waste category - green theme
  const getEmojiByCategory = (wasteCategory) => {
    if (!wasteCategory) return '♻️';
    const cat = wasteCategory.toLowerCase();
    if (cat.includes('plastic')) return '♻️';
    if (cat.includes('paper') || cat.includes('cardboard')) return '📄';
    if (cat.includes('glass')) return '🫙';
    if (cat.includes('metal')) return '🥫';
    if (cat.includes('organic') || cat.includes('food')) return '🍂';
    if (cat.includes('electronic') || cat.includes('e-waste')) return '📱';
    if (cat.includes('textile') || cat.includes('clothing')) return '👕';
    if (cat.includes('industrial')) return '🏭';
    if (cat.includes('recyclable')) return '♻️';
    return '♻️';
  };

  // Green gradient backgrounds - environmental theme
  const getGradientByCategory = (wasteCategory) => {
    if (!wasteCategory) return 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)';
    const cat = wasteCategory.toLowerCase();
    if (cat.includes('plastic')) return 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)';
    if (cat.includes('paper') || cat.includes('cardboard')) return 'linear-gradient(135deg, #33691e 0%, #689f38 100%)';
    if (cat.includes('glass')) return 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)';
    if (cat.includes('metal')) return 'linear-gradient(135deg, #1b5e20 0%, #43a047 100%)';
    if (cat.includes('organic') || cat.includes('food')) return 'linear-gradient(135deg, #33691e 0%, #7cb342 100%)';
    if (cat.includes('electronic') || cat.includes('e-waste')) return 'linear-gradient(135deg, #2e7d32 0%, #81c784 100%)';
    if (cat.includes('textile') || cat.includes('clothing')) return 'linear-gradient(135deg, #1b5e20 0%, #558b2f 100%)';
    if (cat.includes('industrial')) return 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)';
    if (cat.includes('recyclable')) return 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)';
    return 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)';
  };

  return (
    <div className="page-background">
      <div className="page-header">
        <h1>🌿 Marketplace</h1>
        <p>Browse and purchase recycled materials from the community</p>
      </div>

      <div className="content-wrapper">
        {/* Search and Filter */}
        <div className="filter-section">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="plastic">Plastic</option>
            <option value="paper">Paper</option>
            <option value="glass">Glass</option>
            <option value="metal">Metal</option>
            <option value="organic">Organic</option>
            <option value="electronic">Electronic</option>
            <option value="textile">Textile</option>
            <option value="industrial">Industrial</option>
            <option value="recyclable">Recyclable</option>
          </select>
        </div>

        {/* Results count */}
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#558b2f', marginBottom: '24px' }}>
          Showing {filteredItems.length} items
        </Typography>

        <div className="card-grid-container">
          {filteredItems.map(item => (
            <div className="unified-card" key={item._id}>
              <div className="card-image-container">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-image.png';
                    }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: getGradientByCategory(item.wasteCategory),
                    color: 'white',
                    fontSize: '3rem'
                  }}>
                    <span>{getEmojiByCategory(item.wasteCategory)}</span>
                  </div>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
                
                {item.wasteCategory && (
                  <span className="category-badge">
                    {item.wasteCategory}
                  </span>
                )}
                
                <div className="card-meta">
                  <span className={`card-price ${item.price === 0 ? 'free' : ''}`}>
                    {item.price === 0 ? 'FREE' : `₹${item.price}`}
                  </span>
                  <span className={`card-badge ${getBadgeClass(item.listingType)}`}>
                    {item.listingType}
                  </span>
                </div>
                <button 
                  className="card-button"
                  onClick={() => handleOpenBuyDialog(item)}
                >
                  {item.listingType === 'sell' ? 'BUY NOW' : item.listingType === 'donate' ? 'CLAIM' : 'EXCHANGE'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#558b2f' }}>
              No items found. Try adjusting your search.
            </Typography>
          </Box>
        )}

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: { borderRadius: 2, padding: 2, minWidth: 400 }
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#1b5e20' }}>
            Delivery Address
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Enter your delivery address"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              sx={{ marginTop: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: '#558b2f' }}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleBuyNow(selectedItem)}
              variant="contained" 
              sx={{ 
                backgroundColor: '#2e7d32',
                '&:hover': { backgroundColor: '#1b5e20' }
              }}
              disabled={!deliveryAddress.trim()}
            >
              Confirm Order
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Marketplace;
