import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../../contexts/HabitsContext';

interface HabitFormProps {
  onComplete: () => void;
  initialHabit?: {
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  onSubmit?: (habit: {
    name: string;
    description: string;
    icon: string;
    color: string;
  }) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ 
  onComplete, 
  initialHabit = {
    name: '',
    description: '',
    icon: '💪',
    color: '#3B82F6'
  },
  onSubmit
}) => {
  const { addHabit } = useHabits();
  const [name, setName] = useState(initialHabit.name);
  const [description, setDescription] = useState(initialHabit.description);
  const [icon, setIcon] = useState(initialHabit.icon);
  const [color, setColor] = useState(initialHabit.color);

  const commonIcons = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎯', '🌱', '❤️', '🧠', '✨'];
  const commonColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (onSubmit) {
      onSubmit({
        name,
        description,
        icon,
        color
      });
    } else {
      addHabit({
        name,
        description,
        icon,
        color
      });
    }
    
    setName('');
    setDescription('');
    setIcon('💪');
    setColor('#3B82F6');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-4">
        {onSubmit ? 'Edit Habit' : 'Create New Habit'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-1">
            Habit Name
          </label>
          <input
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ocean:focus:ring-cyan-500 forest:focus:ring-green-500 sunset:focus:ring-orange-500 lavender:focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
            placeholder="e.g., Drink 8 glasses of water"
            required
          />
        </div>
        
        <div>
          <label htmlFor="habit-description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-1">
            Description (Optional)
          </label>
          <input
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ocean:focus:ring-cyan-500 forest:focus:ring-green-500 sunset:focus:ring-orange-500 lavender:focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
            placeholder="Why is this habit important to you?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-2">
            Choose an Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {commonIcons.map((iconOption) => (
              <button
                key={iconOption}
                type="button"
                onClick={() => setIcon(iconOption)}
                className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                  icon === iconOption
                    ? 'border-blue-500 dark:border-blue-400 ocean:border-cyan-500 forest:border-green-500 sunset:border-orange-500 lavender:border-purple-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                {iconOption}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ocean:text-cyan-700 forest:text-green-700 sunset:text-orange-700 lavender:text-purple-700 mb-2">
            Choose a Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {commonColors.map((colorOption) => (
              <button
                key={colorOption}
                type="button"
                onClick={() => setColor(colorOption)}
                className={`w-full h-10 rounded-lg border-2 transition-all ${
                  color === colorOption
                    ? 'border-slate-800 dark:border-white scale-110'
                    : 'border-gray-200 dark:border-slate-600 hover:scale-105'
                }`}
                style={{ backgroundColor: colorOption }}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 ocean:border-cyan-300 forest:border-green-300 sunset:border-orange-300 lavender:border-purple-300 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg"
          >
            {onSubmit ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HabitForm;