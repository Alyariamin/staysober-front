import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { goalsAPI } from "../utils/api";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string | null;
  completed: boolean;
  createdAt: string;
}

interface GoalsContextType {
  goals: Goal[];
  addGoal: (
    goal: Omit<Goal, "id" | "completed" | "createdAt">
  ) => Promise<void>;
  updateGoal: (
    id: string,
    goal: Partial<Omit<Goal, "id" | "createdAt">>
  ) => Promise<void>;
  completeGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getGoal: (id: string) => Goal | undefined;
  loading: boolean;
  error: string | null;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

interface GoalsProviderProps {
  children: ReactNode;
}

export const GoalsProvider: React.FC<GoalsProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals from backend on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await goalsAPI.getGoals();
      setGoals(data);
    } catch (err) {
      setError("Failed to load goals");
      console.error("Error loading goals:", err);
      // Fallback to localStorage if backend fails
      const savedGoals = localStorage.getItem("recoveryGoals");
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup to localStorage whenever goals change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("recoveryGoals", JSON.stringify(goals));
    }
  }, [goals]);

  const addGoal = async (
    goal: Omit<Goal, "id" | "completed" | "createdAt">
  ) => {
    try {
      setError(null);
      const newGoal = await goalsAPI.createGoal(goal);
      setGoals((prevGoals) => [newGoal, ...prevGoals]);
    } catch (err) {
      setError("Failed to create goal");
      console.error("Error creating goal:", err);

      // Fallback to local creation if backend fails
      const fallbackGoal: Goal = {
        id: `local_${Date.now()}`,
        ...goal,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setGoals((prevGoals) => [fallbackGoal, ...prevGoals]);
      throw err;
    }
  };

  const updateGoal = async (
    id: string,
    updates: Partial<Omit<Goal, "id" | "createdAt">>
  ) => {
    try {
      setError(null);
      const updatedGoal = await goalsAPI.updateGoal(id, updates);
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
    } catch (err) {
      setError("Failed to update goal");
      console.error("Error updating goal:", err);

      // Fallback to local update if backend fails
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === id ? { ...goal, ...updates } : goal
        )
      );
      throw err;
    }
  };

  const completeGoal = async (id: string) => {
    try {
      setError(null);
      const updatedGoal = await goalsAPI.updateGoal(id, { completed: true });
      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === id ? updatedGoal : goal))
      );
    } catch (err) {
      setError("Failed to complete goal");
      console.error("Error completing goal:", err);

      // Fallback to local update if backend fails
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === id ? { ...goal, completed: true } : goal
        )
      );
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setError(null);
      await goalsAPI.deleteGoal(id);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
    } catch (err) {
      setError("Failed to delete goal");
      console.error("Error deleting goal:", err);

      // Fallback to local deletion if backend fails
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== id));
      throw err;
    }
  };

  const getGoal = (id: string) => {
    return goals.find((goal) => goal.id === id);
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        completeGoal,
        deleteGoal,
        getGoal,
        loading,
        error,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider");
  }
  return context;
};
