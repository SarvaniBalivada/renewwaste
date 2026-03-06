import React, { useState } from 'react';
import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import './ItemCard.css';
import API_BASE_URL from '../config';

function ItemCard({ item }) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');

  const handleBuyNow = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAddress('');
  };

  const handleConfirmOrder = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('Please login to place an order');
        return;
      }

      const orderData = {
        userId: userId,
        itemId: item._id, // Ensure this matches the item ID in MongoDB
        deliveryAddress: address.trim(),
        paymentMethod: 'COD'
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('Order placed successfully! You will receive it within 2-3 business days.');
        handleClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="item-card">
      <div className="item-image">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl}
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/placeholder.png';
            }}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div className="no-image-placeholder">
            <span>📷 No image available</span>
          </div>
        )}
      </div>
      <div className="item-details">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p className="price">₹{item.price}</p>
        <Button 
          variant="contained" 
          sx={{
            backgroundColor: '#1976d2',
            width: '100%',
            '&:hover': {
              backgroundColor: '#1565c0'
            }
          }}
          onClick={handleBuyNow}
        >
          BUY NOW
        </Button>
      </div>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 2, padding: 2 }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Delivery Address
        </Typography>
        <DialogContent>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '8px',
              marginBottom: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleClose}
              sx={{ color: '#666' }}
            >
              CANCEL
            </Button>
            <Button 
              onClick={handleConfirmOrder}
              variant="contained" 
              disabled={!address.trim()}
              sx={{
                backgroundColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2'
                }
              }}
            >
              CONFIRM ORDER
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ItemCard;