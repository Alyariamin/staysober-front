import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';
import { useSobriety } from '../../contexts/SobrietyContext';

const SobrietyMilestones: React.FC = () => {
  const { milestones, daysSober, celebrateMilestone } = useSobriety();

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  // Find the next milestone
  const nextMilestone = milestones.find(m => !m.achieved);
  const daysToNextMilestone = nextMilestone ? nextMilestone.days - daysSober : 0;
  
  return (
    <div>
      {nextMilestone && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Milestone</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-lg font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">{nextMilestone.days} days</span>
            <span className="text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">{daysToNextMilestone} days to go</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700 ocean:bg-cyan-200 forest:bg-green-200 sunset:bg-orange-200 lavender:bg-purple-200 rounded-full h-2.5 mt-2">
            <motion.div 
              className="bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(daysSober / nextMilestone.days) * 100}%` 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    
      <motion.ul 
        className="space-y-3 max-h-[300px] overflow-y-auto pr-2"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {milestones.map((milestone) => (
          <motion.li 
            key={milestone.days}
            variants={itemVariants}
            className={`flex items-center p-3 rounded-lg ${
              milestone.achieved 
                ? 'bg-green-50 dark:bg-green-900/20 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50' 
                : 'bg-gray-50 dark:bg-slate-700/30 ocean:bg-cyan-50/30 forest:bg-green-50/30 sunset:bg-orange-50/30 lavender:bg-purple-50/30'
            }`}
            onClick={() => {
              if (milestone.achieved) {
                celebrateMilestone(milestone.days);
              }
            }}
          >
            <div className="mr-3">
              {milestone.achieved ? (
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                milestone.achieved 
                  ? 'text-green-800 dark:text-green-300 ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800' 
                  : 'text-gray-700 dark:text-gray-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700'
              }`}>
                {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
              </p>
            </div>
            {milestone.achieved && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="text-lg"
              >
                🎉
              </motion.div>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export default SobrietyMilestones;