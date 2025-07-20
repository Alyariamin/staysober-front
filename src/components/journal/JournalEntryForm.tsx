import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJournal } from '../../contexts/JournalContext';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  triggers: string;
}

interface JournalEntryFormProps {
  onComplete: () => void;
  editingEntry?: JournalEntry;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onComplete, editingEntry }) => {
  const { addEntry, updateEntry } = useJournal();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [triggers, setTriggers] = useState('');

  const moodOptions = ['Great', 'Good', 'Neutral', 'Difficult', 'Struggling'];

  // Load existing entry data if editing
  useEffect(() => {
    if (editingEntry) {
      setContent(editingEntry.content);
      setMood(editingEntry.mood);
      setTriggers(editingEntry.triggers);
    }
  }, [editingEntry]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    const entryData = {
      content,
      mood,
      triggers
    };

    if (editingEntry) {
      updateEntry(editingEntry.id, entryData);
    } else {
      addEntry(entryData);
    }
    
    setContent('');
    setMood('Neutral');
    setTriggers('');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            How are you feeling today?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="Write about your day, thoughts, feelings, challenges, or victories..."
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              How would you describe your mood?
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              {moodOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="triggers" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Any trigger today? (optional)
            </label>
            <input
              id="triggers"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              placeholder="Describe what triggered you today"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            {editingEntry ? 'Update Entry' : 'Save Entry'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default JournalEntryForm;