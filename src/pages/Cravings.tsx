import React from 'react';
import { motion } from 'framer-motion';
import CravingTracker from '../components/cravings/CravingTracker';

const Cravings: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-6">
        Craving Management
      </h1>
      
      <motion.div 
        className="grid grid-cols-1 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 ocean:bg-cyan-50/50 forest:bg-green-50/50 sunset:bg-orange-50/50 lavender:bg-purple-50/50 rounded-xl shadow-lg p-6"
        >
          <CravingTracker />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Cravings;