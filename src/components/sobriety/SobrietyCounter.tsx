import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit3, Check, X } from 'lucide-react';
import { useSobriety } from '../../contexts/SobrietyContext';
import { format } from 'date-fns';

const SobrietyCounter: React.FC = () => {
  const { sobrietyDate, daysSober, formattedTime, dailyCost, setDailyCost, totalMoneySaved } = useSobriety();
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [tempCost, setTempCost] = useState(dailyCost.toString());
  
  if (!sobrietyDate) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 dark:text-gray-300 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">
          Set your sobriety date to start tracking your progress.
        </p>
      </div>
    );
  }

  const handleSaveCost = () => {
    const cost = parseFloat(tempCost) || 0;
    setDailyCost(cost);
    setIsEditingCost(false);
  };

  const handleCancelEdit = () => {
    setTempCost(dailyCost.toString());
    setIsEditingCost(false);
  };

  return (
    <div className="text-center py-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <h3 className="text-5xl font-bold text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mb-1">
          {daysSober}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {daysSober === 1 ? 'Day' : 'Days'} Sober
        </p>
      </motion.div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">
          {formattedTime}
        </p>
      </div>

      {/* Money Saved Section */}
      <div className="bg-green-50 dark:bg-green-900/20 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center mb-2">
          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-300">Money Saved</h4>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            ${totalMoneySaved.toFixed(2)}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">Daily cost:</span>
            {isEditingCost ? (
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 dark:text-gray-300">$</span>
                <input
                  type="number"
                  value={tempCost}
                  onChange={(e) => setTempCost(e.target.value)}
                  className="w-16 px-1 py-0.5 text-sm border border-gray-300 dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
                  step="0.01"
                  min="0"
                />
                <button
                  onClick={handleSaveCost}
                  className="p-1 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ${dailyCost.toFixed(2)}
                </span>
                <button
                  onClick={() => setIsEditingCost(true)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          
          {dailyCost === 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click the edit icon to set your daily substance cost
            </p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-lg p-4 text-left">
        <p className="text-sm text-gray-600 dark:text-gray-300 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mb-1">
          Sobriety date:
        </p>
        <p className="font-medium text-slate-800 dark:text-slate-200 ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
          {format(sobrietyDate, 'PPPP')}
        </p>
      </div>
    </div>
  );
};

export default SobrietyCounter;