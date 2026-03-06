import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import './CardStyles.css';

const UpcycleIdeas = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const ideas = [
    {
      title: "Glass Bottle Lamp",
      difficulty: "Easy",
      category: "glass",
      materials: ["Glass Bottle", "LED Lights", "Cork"],
      steps: [
        "Clean the bottle thoroughly",
        "Insert LED string lights",
        "Seal with cork"
      ]
    },
    {
      title: "Cardboard Organizer",
      difficulty: "Easy",
      category: "paper",
      materials: ["Cardboard Box", "Paint", "Scissors"],
      steps: [
        "Cut cardboard to size",
        "Create compartments",
        "Paint and decorate"
      ]
    },
    {
      title: "Tin Can Planters",
      difficulty: "Easy",
      category: "metal",
      materials: ["Clean Tin Cans", "Paint", "Hammer", "Nail", "Potting Soil"],
      steps: [
        "Clean and remove labels",
        "Create drainage holes",
        "Paint and decorate",
        "Add soil and plants"
      ]
    },
    {
      title: "Pallet Coffee Table",
      difficulty: "Medium",
      category: "wood",
      materials: ["Wooden Pallet", "Sandpaper", "Wood Stain", "Wheels", "Screws"],
      steps: [
        "Sand the pallet smooth",
        "Apply wood stain",
        "Attach wheels",
        "Let dry completely"
      ]
    },
    {
      title: "T-shirt Tote Bag",
      difficulty: "Easy",
      category: "textile",
      materials: ["Old T-shirt", "Scissors", "Ruler"],
      steps: [
        "Cut off shirt sleeves",
        "Cut wider neck opening",
        "Cut strips at bottom",
        "Tie strips to create bottom"
      ]
    },
    {
      title: "Wine Cork Board",
      difficulty: "Easy",
      category: "glass",
      materials: ["Wine Corks", "Picture Frame", "Hot Glue Gun", "Ribbon"],
      steps: [
        "Remove frame backing",
        "Arrange corks in pattern",
        "Glue corks together",
        "Add hanging ribbon"
      ]
    },
    {
      title: "Mason Jar Soap Dispenser",
      difficulty: "Easy",
      category: "glass",
      materials: ["Mason Jar", "Soap Pump", "Drill", "Paint (optional)"],
      steps: [
        "Drill hole in lid",
        "Insert pump mechanism",
        "Paint jar if desired",
        "Fill with soap"
      ]
    },
    {
      title: "Newspaper Plant Pots",
      difficulty: "Easy",
      category: "paper",
      materials: ["Newspaper", "Small Can", "Soil", "Seeds"],
      steps: [
        "Fold newspaper strips",
        "Form around can",
        "Remove can carefully",
        "Fill with soil"
      ]
    },
    {
      title: "CD Wall Art",
      difficulty: "Medium",
      category: "electronic",
      materials: ["Old CDs", "Strong Adhesive", "Canvas", "Pattern Template"],
      steps: [
        "Design pattern layout",
        "Break CDs if needed",
        "Arrange pieces on canvas",
        "Glue securely"
      ]
    },
    {
      title: "Denim Pencil Holder",
      difficulty: "Easy",
      category: "textile",
      materials: ["Old Jeans", "Can", "Scissors", "Glue"],
      steps: [
        "Cut denim to size",
        "Wrap around can",
        "Glue edges secure",
        "Add pocket details"
      ]
    }
  ];

  // Filter ideas based on selected category and difficulty
  const filteredIdeas = ideas.filter(idea => {
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || idea.difficulty.toLowerCase() === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(ideas.map(idea => idea.category))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  // Dynamic emoji mapping based on materials
  const getEmojiFromMaterials = (materials) => {
    const materialString = materials.join(' ').toLowerCase();
    
    if (materialString.includes('bottle') || materialString.includes('jar') || materialString.includes('wine') || materialString.includes('cork')) {
      return '🍷';
    } else if (materialString.includes('cardboard') || materialString.includes('newspaper') || materialString.includes('paper')) {
      return '📰';
    } else if (materialString.includes('can') || materialString.includes('tin') || materialString.includes('metal')) {
      return '🥫';
    } else if (materialString.includes('pallet') || materialString.includes('wood')) {
      return '🪵';
    } else if (materialString.includes('t-shirt') || materialString.includes('jeans') || materialString.includes('denim') || materialString.includes('cloth')) {
      return '👕';
    } else if (materialString.includes('cd') || materialString.includes('electronic')) {
      return '💿';
    } else if (materialString.includes('plastic')) {
      return '♻️';
    } else if (materialString.includes('glass')) {
      return '🫙';
    } else {
      return '♻️';
    }
  };

  // Green gradient backgrounds - formal and environmental
  const getGradientByCategory = (category) => {
    const gradients = {
      glass: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
      paper: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
      metal: 'linear-gradient(135deg, #1b5e20 0%, #43a047 100%)',
      wood: 'linear-gradient(135deg, #33691e 0%, #689f38 100%)',
      textile: 'linear-gradient(135deg, #1b5e20 0%, #558b2f 100%)',
      electronic: 'linear-gradient(135deg, #2e7d32 0%, #81c784 100%)',
      plastic: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)'
    };
    return gradients[category] || 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)';
  };

  const getDifficultyClass = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return 'difficulty-easy';
    }
  };

  return (
    <div className="page-background">
      <div className="page-header">
        <h1>♻️ DIY Upcycling Ideas</h1>
        <p>Transform waste into wonderful creations with these step-by-step guides</p>
      </div>

      <div className="content-wrapper">
        {/* Filter Section */}
        <div className="filter-section">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1b5e20', alignSelf: 'center', marginRight: '8px' }}>Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-button ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontWeight: '600', color: '#1b5e20', alignSelf: 'center', marginRight: '8px' }}>Difficulty:</span>
            {difficulties.map(diff => (
              <button
                key={diff}
                className={`filter-button ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(diff)}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#558b2f', marginBottom: '24px' }}>
          Showing {filteredIdeas.length} of {ideas.length} ideas
        </Typography>

        <div className="card-grid-container">
          {filteredIdeas.map((idea, index) => (
            <div className="unified-card idea-card" key={index}>
              <div className="card-image-container" style={{ 
                height: '120px', 
                background: getGradientByCategory(idea.category),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '3rem' }}>
                  {getEmojiFromMaterials(idea.materials)}
                </span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{idea.title}</h3>
                <div>
                  <span className={`difficulty-badge ${getDifficultyClass(idea.difficulty)}`}>
                    {idea.difficulty}
                  </span>
                  <span className="category-badge">
                    {idea.category}
                  </span>
                </div>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1, marginTop: 2, color: '#1b5e20' }}>
                  Materials:
                </Typography>
                <ul className="materials-list">
                  {idea.materials.map((material, idx) => (
                    <li key={idx}>{material}</li>
                  ))}
                </ul>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 1, marginTop: 2, color: '#1b5e20' }}>
                  Steps:
                </Typography>
                <ol className="steps-list">
                  {idea.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#558b2f' }}>
              No ideas match your filters. Try different categories or difficulty levels.
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default UpcycleIdeas;
