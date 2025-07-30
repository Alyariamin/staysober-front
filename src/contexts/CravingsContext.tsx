import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cravingsAPI } from '../utils/api'; // Assuming you have an API service for cravings

interface CravingEntry {
  id: string;
  date: string;
  intensity: number; // 1-10 scale
  trigger: string;
  location: string;
  copingStrategy: string;
  notes: string;
  duration: number; // in minutes
  overcome: boolean;
}

interface CravingsContextType {
  cravings: CravingEntry[];
  addCraving: (craving: Omit<CravingEntry, 'id'>) => Promise<void>;
  updateCraving: (id: string, craving: Partial<Omit<CravingEntry, 'id'>>) => Promise<void>;
  deleteCraving: (id: string) => Promise<void>;
  getRecentCravings: () => CravingEntry[];
  getCravingStats: () => {
    totalCravings: number;
    overcomeCravings: number;
    averageIntensity: number;
    commonTriggers: string[];
  };
  loading: boolean;
  error: string | null;
}

const CravingsContext = createContext<CravingsContextType | undefined>(undefined);

interface CravingsProviderProps {
  children: ReactNode;
}

export const CravingsProvider: React.FC<CravingsProviderProps> = ({ children }) => {
  const [cravings, setCravings] = useState<CravingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load cravings from backend on mount
  useEffect(() => {
    loadCravings();
  }, []);

  const loadCravings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cravingsAPI.getCravings();
      setCravings(data);
    } catch (err) {
      setError('Failed to load cravings');
      console.error('Error loading cravings:', err);
      // Fallback to localStorage if backend fails
      const savedCravings = localStorage.getItem('cravingEntries');
      if (savedCravings) {
        setCravings(JSON.parse(savedCravings));
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup to localStorage whenever cravings change
  useEffect(() => {
    if (cravings.length > 0) {
      localStorage.setItem('cravingEntries', JSON.stringify(cravings));
    }
  }, [cravings]);

  const addCraving = async (craving: Omit<CravingEntry, 'id'>) => {
    try {
      setError(null);
      const newCraving = await cravingsAPI.createCraving(craving);
      setCravings(prevCravings => [newCraving, ...prevCravings]);
    } catch (err) {
      setError('Failed to create craving entry');
      console.error('Error creating craving:', err);
      
      // Fallback to local creation if backend fails
      const fallbackCraving: CravingEntry = {
        id: `local_${Date.now()}`,
        ...craving,
        date: new Date().toISOString()
      };
      setCravings(prevCravings => [fallbackCraving, ...prevCravings]);
      throw err;
    }
  };

  const updateCraving = async (id: string, updates: Partial<Omit<CravingEntry, 'id'>>) => {
    try {
      setError(null);
      const updatedCraving = await cravingsAPI.updateCraving(id, updates);
      setCravings(prevCravings => 
        prevCravings.map(craving => 
          craving.id === id ? updatedCraving : craving
        )
      );
    } catch (err) {
      setError('Failed to update craving');
      console.error('Error updating craving:', err);
      
      // Fallback to local update if backend fails
      setCravings(prevCravings => 
        prevCravings.map(craving => 
          craving.id === id ? { ...craving, ...updates } : craving
        )
      );
      throw err;
    }
  };

  const deleteCraving = async (id: string) => {
    try {
      setError(null);
      await cravingsAPI.deleteCraving(id);
      setCravings(prevCravings => prevCravings.filter(craving => craving.id !== id));
    } catch (err) {
      setError('Failed to delete craving');
      console.error('Error deleting craving:', err);
      
      // Fallback to local deletion if backend fails
      setCravings(prevCravings => prevCravings.filter(craving => craving.id !== id));
      throw err;
    }
  };

  const getRecentCravings = (): CravingEntry[] => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return cravings.filter(craving => 
      new Date(craving.date) >= oneWeekAgo
    );
  };

  const getCravingStats = () => {
    const totalCravings = cravings.length;
    const overcomeCravings = cravings.filter(c => c.overcome).length;
    const averageIntensity = totalCravings > 0 
      ? cravings.reduce((sum, c) => sum + c.intensity, 0) / totalCravings 
      : 0;
    
    const triggerCounts = cravings.reduce((acc, craving) => {
      acc[craving.trigger] = (acc[craving.trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const commonTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger);

    return {
      totalCravings,
      overcomeCravings,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      commonTriggers
    };
  };

  return (
    <CravingsContext.Provider value={{
      cravings,
      addCraving,
      updateCraving,
      deleteCraving,
      getRecentCravings,
      getCravingStats,
      loading,
      error
    }}>
      {children}
    </CravingsContext.Provider>
  );
};

export const useCravings = () => {
  const context = useContext(CravingsContext);
  if (context === undefined) {
    throw new Error('useCravings must be used within a CravingsProvider');
  }
  return context;
};