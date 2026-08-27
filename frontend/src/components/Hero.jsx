import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { slideUp } from '../utils/constants';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-bg animate-gradient"></div>
      <div className="particle-grid"></div>
      
      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          Next-Gen <span className="text-gradient">Tech Accessories</span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Experience the future of personal technology. Premium design meets uncompromised performance.
        </motion.p>
        
        <motion.button 
          className="hero-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/products')}
        >
          Explore Collection
        </motion.button>
      </div>

      <div className="floating-icons">
        <div className="float-icon icon-1 animate-float">🎧</div>
        <div className="float-icon icon-2 animate-float-delayed">⌚</div>
        <div className="float-icon icon-3 animate-float">🔊</div>
      </div>
      
      <div className="scroll-indicator animate-bounce">
        ↓
      </div>
    </section>
  );
};

export default Hero;
