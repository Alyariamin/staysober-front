import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Award, Bookmark, RefreshCcw, TrendingUp } from 'lucide-react';
import { useSobriety } from '../contexts/SobrietyContext';
import { useHabits } from '../contexts/HabitsContext';
import { useMood } from '../contexts/MoodContext';
import SobrietyCounter from '../components/sobriety/SobrietyCounter';
import SobrietyMilestones from '../components/sobriety/SobrietyMilestones';
import MotivationalQuote from '../components/common/MotivationalQuote';
import DailySummary from '../components/journal/DailySummary';

const Dashboard: React.FC = () => {
  const { sobrietyDate, setSobrietyDate, resetSobriety } = useSobriety();
  const { habits, isHabitCompletedToday } = useHabits();
  const { getWeeklyAverage, getMoodTrend } = useMood();
  const [showDatePicker, setShowDatePicker] = useState(!sobrietyDate);
  
  const handleDateSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const dateInput = form.elements.namedItem('sobrietyDate') as HTMLInputElement;
    
    if (dateInput && dateInput.value) {
      setSobrietyDate(new Date(dateInput.value));
      setShowDatePicker(false);
    }
  };

  const completedHabitsToday = habits.filter(habit => isHabitCompletedToday(habit.id)).length;
  const weeklyMoodAverage = getWeeklyAverage();
  const moodTrend = getMoodTrend();

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
    <motion.div 
      className="container mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {showDatePicker ? (
        <motion.div 
          className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6 mb-6"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-4">
            Welcome to Your Recovery Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-300 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mb-6">
            Please set your sobriety start date to begin tracking your progress.
          </p>
          
          <form onSubmit={handleDateSubmit} className="space-y-4">
            <div>
              <label htmlFor="sobrietyDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-1">
                Sobriety Start Date
              </label>
              <input
                type="date"
                id="sobrietyDate"
                name="sobrietyDate"
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ocean:focus:ring-cyan-500 forest:focus:ring-green-500 sunset:focus:ring-orange-500 lavender:focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 ocean:hover:bg-cyan-700 forest:hover:bg-green-700 sunset:hover:bg-orange-700 lavender:hover:bg-purple-700 text-white font-medium rounded-lg transition duration-200"
            >
              Begin My Journey
            </button>
          </form>
        </motion.div>
      ) : (
        <>
          <motion.div className="grid md:grid-cols-2 gap-6 mb-6" variants={containerVariants}>
            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6"
              variants={itemVariants}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mr-2" />
                  Your Progress
                </h2>
                <button 
                  onClick={() => setShowDatePicker(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 hover:underline flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Change Date
                </button>
              </div>
              
              <SobrietyCounter />
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 ocean:border-cyan-200 forest:border-green-200 sunset:border-orange-200 lavender:border-purple-200">
                <button 
                  onClick={resetSobriety}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center"
                >
                  <RefreshCcw className="h-4 w-4 mr-1" />
                  Reset Counter
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 flex items-center mb-4">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mr-2" />
                Milestones
              </h2>
              
              <SobrietyMilestones />
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" variants={containerVariants}>
            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-md p-4"
              variants={itemVariants}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Habits Completed Today</h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">
                  {completedHabitsToday}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">/ {habits.length}</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-md p-4"
              variants={itemVariants}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Weekly Mood Average</h3>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600">
                  {weeklyMoodAverage > 0 ? weeklyMoodAverage.toFixed(1) : '--'}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">/ 10</span>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-md p-4"
              variants={itemVariants}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Mood Trend</h3>
              <div className="flex items-center">
                <TrendingUp className={`h-5 w-5 mr-2 ${
                  moodTrend === 'improving' ? 'text-green-600 dark:text-green-400' :
                  moodTrend === 'declining' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`} />
                <span className="text-sm font-medium text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 capitalize">
                  {moodTrend}
                </span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div className="grid md:grid-cols-3 gap-6" variants={containerVariants}>
            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6 md:col-span-2"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 flex items-center mb-4">
                <Bookmark className="h-5 w-5 text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 mr-2" />
                Today's Journal
              </h2>
              
              <DailySummary />
            </motion.div>
            
            <motion.div 
              className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-4">
                Daily Inspiration
              </h2>
              
              <MotivationalQuote />
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Dashboard;