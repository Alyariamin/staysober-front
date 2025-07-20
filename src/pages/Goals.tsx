import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Target } from 'lucide-react';
import { useGoals } from '../contexts/GoalsContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';

const Goals: React.FC = () => {
  const { goals } = useGoals();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return !goal.completed;
    if (activeFilter === 'completed') return goal.completed;
    return true;
  });
  
  const toggleGoalForm = () => {
    setShowGoalForm(!showGoalForm);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Recovery Goals</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-slate-600">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'active' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setActiveFilter('completed')}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter === 'completed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600'
              }`}
            >
              Completed
            </button>
          </div>
          
          <button 
            onClick={toggleGoalForm}
            className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Goal
          </button>
        </div>
      </div>

      {showGoalForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <GoalForm onComplete={() => setShowGoalForm(false)} />
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 text-center">
          <div className="mb-4">
            <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Set Your Recovery Goals</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
            Setting achievable goals is an important part of your recovery journey. Start by creating your first goal.
          </p>
          
          {!showGoalForm && (
            <button 
              onClick={toggleGoalForm}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              <Plus className="h-4 w-4 mr-1 inline-block" />
              Create Your First Goal
            </button>
          )}
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">
            No {activeFilter === 'active' ? 'active' : 'completed'} goals found.
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredGoals.map(goal => (
            <motion.div key={goal.id} variants={itemVariants}>
              <GoalCard goal={goal} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Goals;