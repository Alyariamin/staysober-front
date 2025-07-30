import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { habitsAPI } from '../utils/api';

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  streak: number;
  createdAt: string;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'createdAt'>) => Promise<void>;
  toggleHabit: (id: string, date: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => Promise<void>;
  getHabitStreak: (id: string) => number;
  isHabitCompletedToday: (id: string) => Promise<boolean>;
  isHabitCompletedOnDate: (id: string, date: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completionCache, setCompletionCache] = useState<Record<string, boolean>>({});

  // Load habits from backend on mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitsAPI.getHabits();
      setHabits(data);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
      // Fallback to localStorage if backend fails
      const savedHabits = localStorage.getItem('recoveryHabits');
      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        // Remove completedDates from old localStorage data
        const cleanedHabits = parsedHabits.map((habit: any) => ({
          id: habit.id,
          name: habit.name,
          description: habit.description,
          icon: habit.icon,
          color: habit.color,
          streak: habit.streak || 0,
          createdAt: habit.createdAt
        }));
        setHabits(cleanedHabits);
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup to localStorage whenever habits change (without completedDates)
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('recoveryHabits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = async (habit: Omit<Habit, 'id' | 'streak' | 'createdAt'>) => {
    try {
      setError(null);
      const newHabit = await habitsAPI.createHabit(habit);
      setHabits(prevHabits => [newHabit, ...prevHabits]);
    } catch (err) {
      setError('Failed to create habit');
      console.error('Error creating habit:', err);
      
      // Fallback to local creation if backend fails
      const fallbackHabit: Habit = {
        id: `local_${Date.now()}`,
        ...habit,
        streak: 0,
        createdAt: new Date().toISOString()
      };
      setHabits(prevHabits => [fallbackHabit, ...prevHabits]);
      throw err;
    }
  };

  const updateHabit = async (id: string, updates: Partial<Omit<Habit, 'id' | 'createdAt'>>) => {
    try {
      setError(null);
      const updatedHabit = await habitsAPI.updateHabit(id, updates);
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === id ? updatedHabit : habit
        )
      );
    } catch (err) {
      setError('Failed to update habit');
      console.error('Error updating habit:', err);
      
      // Fallback to local update if backend fails
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        )
      );
      throw err;
    }
  };

  const toggleHabit = async (id: string, date: string) => {
    try {
      setError(null);
      const response = await habitsAPI.toggleHabit(id, date);      
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === id ? { ...habit, streak: response.streak } : habit
        )
      );
      const cacheKey = `${id}-${date}`;
      setCompletionCache(prev => ({
        ...prev,
        [cacheKey]: response.completed
      }));
      
    } catch (err) {
      setError('Failed to toggle habit');
      console.error('Error toggling habit:', err);
      
      // Fallback to local toggle if backend fails
      const cacheKey = `${id}-${date}`;
      const currentCompletion = completionCache[cacheKey] || false;
      setCompletionCache(prev => ({
        ...prev,
        [cacheKey]: !currentCompletion
      }));
      
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      setError(null);
      await habitsAPI.deleteHabit(id);
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
      
      setCompletionCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(`${id}-`)) {
            delete newCache[key];
          }
        });
        return newCache;
      });
      
    } catch (err) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', err);
      
      // Fallback to local deletion if backend fails
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
      throw err;
    }
  };

  const getHabitStreak = (id: string): number => {
    const habit = habits.find(h => h.id === id);
    return habit ? habit.streak : 0;
  };

  const isHabitCompletedOnDate = async (id: string, date: string): Promise<boolean> => {
    const cacheKey = `${id}-${date}`;
    
    // Check cache first
    if (completionCache[cacheKey] !== undefined) {
      return completionCache[cacheKey];
    }
    
    try {
      const response = await habitsAPI.isHabitCompleted(id, date);
      const isCompleted = response.completed;
      
      // Cache the result
      setCompletionCache(prev => ({
        ...prev,
        [cacheKey]: isCompleted
      }));
      
      return isCompleted;
    } catch (err) {
      console.error('Error checking habit completion:', err);
      return false;
    }
  };

  const isHabitCompletedToday = async (id: string): Promise<boolean> => {
    const today = new Date().toISOString().split('T')[0];
    return isHabitCompletedOnDate(id, today);
  };

  return (
    <HabitsContext.Provider value={{
      habits,
      addHabit,
      toggleHabit,
      deleteHabit,
      updateHabit,
      getHabitStreak,
      isHabitCompletedToday,
      isHabitCompletedOnDate,
      loading,
      error
    }}>
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};