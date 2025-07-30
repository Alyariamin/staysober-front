import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userAPI } from '../utils/api';

interface SobrietyContextType {
  sobrietyDate: Date | null;
  setSobrietyDate: (date: Date | null) => void;
  daysSober: number;
  formattedTime: string;
  milestones: Array<{ days: number; achieved: boolean; message: string }>;
  resetSobriety: () => void;
  celebrateMilestone: (milestone: number) => void;
  dailyCost: number;
  setDailyCost: (cost: number) => void;
  totalMoneySaved: number;
}

const SobrietyContext = createContext<SobrietyContextType | undefined>(undefined);

interface SobrietyProviderProps {
  children: ReactNode;
}

export const SobrietyProvider: React.FC<SobrietyProviderProps> = ({ children }) => {
  const [sobrietyDate, setSobrietyDate] = useState<Date | null>(() => {
    const saved = localStorage.getItem('sobrietyDate');
    return saved ? new Date(saved) : null;
  });

  const [dailyCost, setDailyCost] = useState<number>(() => {
    const saved = localStorage.getItem('dailySubstanceCost');
    return saved ? parseFloat(saved) : 0;
  });

  // const [isLoading, setIsLoading] = useState(false);

  const [daysSober, setDaysSober] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');
  const [totalMoneySaved, setTotalMoneySaved] = useState(0);
  
  const [milestones, setMilestones] = useState([
    { days: 1, achieved: false, message: "First day sober! 🎉" },
    { days: 7, achieved: false, message: "One week milestone! 🌟" },
    { days: 30, achieved: false, message: "30 days sober! 💪" },
    { days: 90, achieved: false, message: "90 days - a major achievement! 🏆" },
    { days: 180, achieved: false, message: "6 months of sobriety! 🌈" },
    { days: 365, achieved: false, message: "1 year sober! Incredible! 🎖️" }
  ]);

  // Load initial data from backend
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profile = await userAPI.getStats();
        if (profile.start_date) {
          const date = new Date(profile.start_date);
          setSobrietyDate(date);
          localStorage.setItem('sobrietyDate', date.toISOString());
        }
        
        if (profile.saved_money !== undefined) {
          
          setDailyCost(profile.saved_money);
          localStorage.setItem('dailySubstanceCost', profile.saved_money.toString());
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
        // Continue with localStorage values if API fails
      } finally {
        // setIsLoading(false);
      }
    };
    
    loadUserProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem('dailySubstanceCost', dailyCost.toString());
  }, [dailyCost]);

  useEffect(() => {
    if (sobrietyDate) {
      localStorage.setItem('sobrietyDate', sobrietyDate.toISOString());
      
      const calculateSobriety = () => {
        const now = new Date();
        const timeDiff = now.getTime() - sobrietyDate.getTime();
        
        // Calculate days, hours, minutes, seconds
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setDaysSober(days);
        setFormattedTime(`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        
        // Calculate money saved
        const totalDays = Math.max(0, days);
        setTotalMoneySaved(totalDays * dailyCost);
        
        // Check for milestones
        setMilestones(prev => 
          prev.map(milestone => ({
            ...milestone,
            achieved: days >= milestone.days
          }))
        );
      };
      
      calculateSobriety();
      const interval = setInterval(calculateSobriety, 1000); // Update every second
      
      return () => clearInterval(interval);
    } else {
      setDaysSober(0);
      setFormattedTime('');
      setTotalMoneySaved(0);
    }
  }, [sobrietyDate, dailyCost]);

  const setSobrietyDateWithAPI = async (date: Date | null) => {
    try {
      if (date) {        
        await userAPI.updateSobrietyDate(date.toISOString().replace(/\.\d{3}Z$/, 'Z'));
        
      }
      // Update local state after successful API call
      setSobrietyDate(date);
    } catch (error) {
      console.error('Failed to update sobriety date:', error);
      // Still update local state for offline functionality
      setSobrietyDate(date);
      // You could show a toast notification here about the sync failure
    }
  };

  const setDailyCostWithAPI = async (cost: number) => {
    try {
      await userAPI.updateDailyCost(cost);
      setDailyCost(cost);
    } catch (error) {
      console.error('Failed to update daily cost:', error);
    }
  };

  const resetSobriety = async () => {
    if (window.confirm('Are you sure you want to reset your sobriety date? This action cannot be undone.')) {
      const now = new Date();
      await setSobrietyDateWithAPI(now);
    }
  };
  

  const celebrateMilestone = (milestone: number) => {
    // Implementation for celebrating milestone achievements
    // console.log(`Celebrating milestone: ${milestone} days!`);
    // This could trigger animations, notifications, etc.
  };

  return (
    <SobrietyContext.Provider 
      value={{ 
        sobrietyDate, 
        setSobrietyDate: setSobrietyDateWithAPI, 
        daysSober, 
        formattedTime,
        milestones,
        resetSobriety,
        celebrateMilestone,
        dailyCost,
        setDailyCost: setDailyCostWithAPI,
        totalMoneySaved
      }}
    >
      {children}
    </SobrietyContext.Provider>
  );
};

export const useSobriety = () => {
  const context = useContext(SobrietyContext);
  if (context === undefined) {
    throw new Error('useSobriety must be used within a SobrietyProvider');
  }
  return context;
};