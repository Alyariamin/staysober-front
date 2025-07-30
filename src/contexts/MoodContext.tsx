import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { moodAPI } from '../utils/api';

interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-10 scale
  notes: string;
  activities: string[]; // Array of activities
  energy: number; // 1-10 scale
  anxiety: number; // 1-10 scale
  sleep: number; // 1-10 scale
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => Promise<void>;
  updateMoodEntry: (id: string, entry: Partial<Omit<MoodEntry, 'id'>>) => Promise<void>;
  deleteMoodEntry: (id: string) => Promise<void>;
  getTodaysMood: () => MoodEntry | undefined;
  getWeeklyAverage: () => number;
  getMoodTrend: () => 'improving' | 'declining' | 'stable';
  getMoodForDate: (date: string) => MoodEntry | undefined;
  hasMoodForDate: (date: string) => boolean;
  loading: boolean;
  error: string | null;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mood entries from backend on mount
  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await moodAPI.getMoodEntries();
      setMoodEntries(data);
    } catch (err) {
      setError('Failed to load mood entries');
      console.error('Error loading mood entries:', err);
      // Fallback to localStorage if backend fails
      const savedMoods = localStorage.getItem('moodEntries');
      if (savedMoods) {
        const parsedMoods = JSON.parse(savedMoods);
        // Ensure activities is always an array
        const cleanedMoods = parsedMoods.map((mood: any) => ({
          ...mood,
          activities: Array.isArray(mood.activities) 
            ? mood.activities 
            : mood.activity 
            ? [mood.activity] 
            : []
        }));
        setMoodEntries(cleanedMoods);
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup to localStorage whenever mood entries change
  useEffect(() => {
    if (moodEntries.length > 0) {
      localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    }
  }, [moodEntries]);

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    const entryDate = entry.date.split('T')[0]; 
    const existingEntry = getMoodForDate(entryDate);
    if (existingEntry) {
      throw new Error('A mood entry already exists for this date. Please edit the existing entry instead.');
    }
    try {
      setError(null);
      const newEntry = await moodAPI.createMoodEntry(entry);
      setMoodEntries(prevEntries => [newEntry, ...prevEntries]);
    } catch (err) {
      setError('Failed to create mood entry');
      console.error('Error creating mood entry:', err);
      
      // Fallback to local creation if backend fails
      const fallbackEntry: MoodEntry = {
        id: `local_${Date.now()}`,
        ...entry,
        date: new Date().toISOString()
      };
      setMoodEntries(prevEntries => [fallbackEntry, ...prevEntries]);
      throw err;
    }
  };

  const updateMoodEntry = async (id: string, updates: Partial<Omit<MoodEntry, 'id'>>) => {
    try {
      setError(null);
      const updatedEntry = await moodAPI.updateMoodEntry(id, updates);
      setMoodEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === id ? updatedEntry : entry
        )
      );
    } catch (err) {
      setError('Failed to update mood entry');
      console.error('Error updating mood entry:', err);
      
      // Fallback to local update if backend fails
      setMoodEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
      throw err;
    }
  };

  const deleteMoodEntry = async (id: string) => {
    try {
      setError(null);
      await moodAPI.deleteMoodEntry(id);
      setMoodEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (err) {
      setError('Failed to delete mood entry');
      console.error('Error deleting mood entry:', err);
      
      // Fallback to local deletion if backend fails
      setMoodEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
      throw err;
    }
  };

  const getTodaysMood = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find(entry => entry.date.startsWith(today));
  };

  const getWeeklyAverage = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = moodEntries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );
    
    if (recentEntries.length === 0) return 0;
    
    const sum = recentEntries.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / recentEntries.length) * 10) / 10;
  };

  const getMoodTrend = (): 'improving' | 'declining' | 'stable' => {
    if (moodEntries.length < 3) return 'stable';
    
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((acc, entry) => acc + entry.mood, 0) / recent.length;
    const olderAvg = older.reduce((acc, entry) => acc + entry.mood, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  };

  const getMoodForDate = (date: string): MoodEntry | undefined => {
    const targetDate = date.split('T')[0]; // Get YYYY-MM-DD part
    return moodEntries.find(entry => {
      const entryDate = entry.date.split('T')[0];
      return entryDate === targetDate;
    });
  };

  const hasMoodForDate = (date: string): boolean => {
    return getMoodForDate(date) !== undefined;
  };

  return (
    <MoodContext.Provider value={{
      moodEntries,
      addMoodEntry,
      updateMoodEntry,
      deleteMoodEntry,
      getTodaysMood,
      getWeeklyAverage,
      getMoodTrend,
      getMoodForDate,
      hasMoodForDate,
      loading,
      error
    }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};