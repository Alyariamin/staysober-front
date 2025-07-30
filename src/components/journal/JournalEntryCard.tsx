import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { Edit, Trash2 } from 'lucide-react';
import { useJournal } from '../../contexts/JournalContext';
import JournalEntryForm from './JournalEntryForm';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  triggers: string;
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  isRTL?: boolean;
  onLanguageToggle?: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, isRTL = false, onLanguageToggle }) => {
  const { deleteEntry } = useJournal();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Date formatting with Persian support
  const formattedDate = entry.date ? 
    format(parseISO(entry.date), isRTL ? 'd MMMM yyyy' : 'MMMM d, yyyy', isRTL ? { locale: faIR } : undefined) : 
    isRTL ? 'تاریخ نامعلوم' : 'Unknown date';
  
  const formattedTime = entry.date ? 
    format(parseISO(entry.date), isRTL ? 'h:mm a' : 'h:mm a') : 
    isRTL ? 'زمان نامعلوم' : 'Unknown time';

  // Mood translations
  const moodTranslations: Record<string, string> = {
    'Great': isRTL ? 'عالی' : 'Great',
    'Good': isRTL ? 'خوب' : 'Good',
    'Neutral': isRTL ? 'معمولی' : 'Neutral',
    'Difficult': isRTL ? 'سخت' : 'Difficult',
    'Struggling': isRTL ? 'در تقلا' : 'Struggling'
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Great':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'Good':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Neutral':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      case 'Difficult':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Struggling':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    deleteEntry(entry.id);
    setIsDeleting(false);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <JournalEntryForm 
          onComplete={() => setIsEditing(false)}
          editingEntry={entry}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-5">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-start mb-3`}>
          <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{formattedDate}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${getMoodColor(entry.mood)}`}>
            {moodTranslations[entry.mood] || entry.mood}
          </div>
        </div>
        
        <div 
          className={`prose dark:prose-invert max-w-none cursor-pointer ${isExpanded ? '' : 'line-clamp-3'} ${isRTL ? 'text-right' : 'text-left'}`}
          onClick={toggleExpand}
        >
          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {entry.content}
          </p>
        </div>
        
        {entry.triggers && (
          <div className={`mt-3 pt-3 border-t border-gray-100 dark:border-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              {isRTL ? 'محرک:' : 'Trigger:'}
            </h4>
            <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs">
              {entry.triggers}
            </span>
          </div>
        )}
        
        {isDeleting ? (
          <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              {isRTL ? 'آیا مطمئنید که می‌خواهید این یادداشت را حذف کنید؟' : 'Are you sure you want to delete this entry?'}
            </p>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
              >
                {isRTL ? 'حذف' : 'Delete'}
              </button>
              <button 
                onClick={cancelDelete}
                className="flex-1 py-1.5 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded"
              >
                {isRTL ? 'انصراف' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex ${isRTL ? 'flex-row-reverse' : ''} justify-between`}>
            {onLanguageToggle && (
              <button 
                onClick={onLanguageToggle}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                title={isRTL ? 'Switch to English' : 'تبدیل به فارسی'}
              >
                {isRTL ? 'EN' : 'فا'}
              </button>
            )}
            
            <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} gap-4`}>
              <button 
                onClick={handleEdit}
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                title={isRTL ? 'ویرایش یادداشت' : 'Edit entry'}
              >
                <Edit className="h-4 w-4" />
              </button>
              
              <button 
                onClick={handleDelete}
                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title={isRTL ? 'حذف یادداشت' : 'Delete entry'}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JournalEntryCard;