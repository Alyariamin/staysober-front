import React, { useState } from 'react';
import { useJournal } from '../../contexts/JournalContext';
import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';
import JournalEntryForm from './JournalEntryForm';

const DailySummary: React.FC = () => {
  const { entries } = useJournal();
  const [showEntryForm, setShowEntryForm] = useState(false);
  
  // Check if there's an entry for today
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  const todayEntry = entries.find(entry => {
    const entryDate = new Date(entry.date);
    return format(entryDate, 'yyyy-MM-dd') === todayStr;
  });
  
  if (showEntryForm) {
    return (
      <JournalEntryForm 
        onComplete={() => setShowEntryForm(false)} 
        editingEntry={todayEntry}
      />
    );
  }
  
  if (todayEntry) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap line-clamp-6">
            {todayEntry.content}
          </p>
        </div>
        
        {todayEntry.triggers && (
          <div className="mt-3 pt-3">
            <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Today's trigger:</h4>
            <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs">
              {todayEntry.triggers}
            </span>
          </div>
        )}
        
        <button 
          onClick={() => setShowEntryForm(true)}
          className="absolute top-0 right-0 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          aria-label="Edit journal entry"
        >
          <Edit className="h-4 w-4" />
        </button>
      </motion.div>
    );
  }
  
  return (
    <div className="text-center py-6">
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        You haven't journaled today yet. Taking a few minutes to reflect can be very valuable for your recovery journey.
      </p>
      
      <button 
        onClick={() => setShowEntryForm(true)}
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
      >
        Write Today's Entry
      </button>
    </div>
  );
};

export default DailySummary;