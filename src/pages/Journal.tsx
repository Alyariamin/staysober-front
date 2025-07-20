import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { useJournal } from "../contexts/JournalContext";
import JournalEntryCard from "../components/journal/JournalEntryCard";
import JournalEntryForm from "../components/journal/JournalEntryForm";

const Journal: React.FC = () => {
  const { entries } = useJournal();
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState<string | null>(null);

  const toggleEntryForm = () => {
    setShowEntryForm(!showEntryForm);
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = entry.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesMood = filterMood ? entry.mood === filterMood : true;
    return matchesSearch && matchesMood;
  });

  const moodOptions = ["Great", "Good", "Neutral", "Difficult", "Struggling"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Your Journal
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white w-full"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
            <select
              value={filterMood || ""}
              onChange={(e) => setFilterMood(e.target.value || null)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white appearance-none w-full"
            >
              <option value="">All moods</option>
              {moodOptions.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={toggleEntryForm}
            className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Entry
          </button>
        </div>
      </div>

      {showEntryForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <JournalEntryForm onComplete={() => setShowEntryForm(false)} />
        </motion.div>
      )}

      {filteredEntries.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredEntries.map((entry) => (
            <motion.div key={entry.id} variants={itemVariants}>
              <JournalEntryCard entry={entry} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            {searchTerm || filterMood
              ? "No entries match your search criteria."
              : "You haven't created any journal entries yet."}
          </p>

          {!showEntryForm && (
            <button
              onClick={toggleEntryForm}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Create Your First Entry
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Journal;
