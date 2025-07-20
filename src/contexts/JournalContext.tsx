import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { journalAPI } from "../utils/api";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  triggers: string;
}

interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, "id" | "date">) => Promise<void>;
  updateEntry: (
    id: string,
    entry: Partial<Omit<JournalEntry, "id">>
  ) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntry: (id: string) => JournalEntry | undefined;
  loading: boolean;
  error: string | null;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

interface JournalProviderProps {
  children: ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({
  children,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entries from backend on mount
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await journalAPI.getEntries();
      console.log(data);
      setEntries(data);
    } catch (err) {
      setError("Failed to load journal entries");
      console.error("Error loading entries:", err);
      // Fallback to localStorage if backend fails
      const savedEntries = localStorage.getItem("journalEntries");
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem("journalEntries", JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = async (entry: Omit<JournalEntry, "id" | "date">) => {
    try {
      setError(null);
      console.log("helo");
      console.log(entry);
      const newEntry = await journalAPI.createEntry(entry);
      setEntries((prevEntries) => [newEntry, ...prevEntries]);
    } catch (err) {
      setError("Failed to create journal entry");
      console.error("Error creating entry:", err);

      // Fallback to local creation if backend fails
      // When creating fallback entries, ensure date is valid
      const fallbackEntry: JournalEntry = {
        id: `local_${crypto.randomUUID()}`,
        date: new Date().toISOString(), // Ensure this is a valid ISO string
        ...entry,
      };
      setEntries((prevEntries) => [fallbackEntry, ...prevEntries]);
      throw err;
    }
  };

  const updateEntry = async (
    id: string,
    updates: Partial<Omit<JournalEntry, "id">>
  ) => {
    try {
      setError(null);
      const updatedEntry = await journalAPI.updateEntry(id, updates);
      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === id ? updatedEntry : entry))
      );
    } catch (err) {
      setError("Failed to update journal entry");
      console.error("Error updating entry:", err);

      // Fallback to local update if backend fails
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setError(null);
      await journalAPI.deleteEntry(id);
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } catch (err) {
      setError("Failed to delete journal entry");
      console.error("Error deleting entry:", err);

      // Fallback to local deletion if backend fails
      setEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
      throw err;
    }
  };

  const getEntry = (id: string) => {
    return entries.find((entry) => entry.id === id);
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        getEntry,
        loading,
        error,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
};
