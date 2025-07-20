import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Meh,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useMood } from "../../contexts/MoodContext";
import MoodForm from "./MoodForm";
import { format, parseISO } from "date-fns";
import { Dialog } from "@headlessui/react";

const MoodTracker: React.FC = () => {
  const {
    moodEntries,
    getTodaysMood,
    getWeeklyAverage,
    getMoodTrend,
    deleteMoodEntry,
    hasMoodForDate,
  } = useMood();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [moodToDelete, setMoodToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const todaysMood = getTodaysMood();
  const weeklyAverage = getWeeklyAverage();
  const trend = getMoodTrend();
  const hasTodaysMood = hasMoodForDate(new Date().toISOString().split("T")[0]);

  const handleAddMood = () => {
    setShowForm(true);
    if (hasTodaysMood) {
      // If today's mood exists, edit it instead
      if (todaysMood) {
        setEditingEntry(todaysMood);
      }
    } else {
      // Create new mood for today
      setSelectedDate(new Date().toISOString());
    }
    setShowForm(true);
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setMoodToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!moodToDelete) return;

    setDeletingId(moodToDelete);
    try {
      await deleteMoodEntry(moodToDelete);
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setDeletingId(null);
      setMoodToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFormComplete = () => {
    setShowForm(false);
    setEditingEntry(null);
    setSelectedDate("");
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 7)
      return <Smile className="h-6 w-6 text-green-600 dark:text-green-400" />;
    if (mood >= 4)
      return <Meh className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />;
    return <Frown className="h-6 w-6 text-red-600 dark:text-red-400" />;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return (
          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "declining":
        return (
          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      default:
        return <Minus className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
    if (mood >= 6)
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    if (mood >= 4)
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
          Mood Tracker
        </h2>
        <button
          // onClick={() => setShowForm(true)}
          onClick={handleAddMood}
          className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition duration-200 ${
            hasTodaysMood
              ? "bg-orange-600 hover:bg-orange-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          <Plus className="h-4 w-4" />
          {hasTodaysMood ? "Edit Today's Mood" : "Add Today's Mood"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 ocean:border-cyan-200 forest:border-green-200 sunset:border-orange-200 lavender:border-purple-200"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Today's Mood
          </h3>
          {todaysMood ? (
            <div className="flex items-center space-x-2">
              {getMoodIcon(todaysMood.mood)}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${getMoodColor(
                  todaysMood.mood
                )}`}
              >
                {todaysMood.mood}/10
              </span>
              <button
                onClick={() => handleEdit(todaysMood)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-2"
              >
                Edit
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddMood}
              className="text-blue-600 dark:text-blue-400 ocean:text-cyan-600 forest:text-green-600 sunset:text-orange-600 lavender:text-purple-600 hover:underline text-sm"
            >
              Track your mood
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 ocean:border-cyan-200 forest:border-green-200 sunset:border-orange-200 lavender:border-purple-200"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Weekly Average
          </h3>
          <div className="flex items-center space-x-2">
            {weeklyAverage > 0 ? (
              <>
                {getMoodIcon(weeklyAverage)}
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${getMoodColor(
                    weeklyAverage
                  )}`}
                >
                  {weeklyAverage}/10
                </span>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                No data yet
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 ocean:bg-cyan-50 forest:bg-green-50 sunset:bg-orange-50 lavender:bg-purple-50 rounded-xl p-4 border border-gray-200 dark:border-slate-700 ocean:border-cyan-200 forest:border-green-200 sunset:border-orange-200 lavender:border-purple-200"
        >
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Trend
          </h3>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className="text-sm font-medium text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 capitalize">
              {trend}
            </span>
          </div>
        </motion.div>
      </div>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <MoodForm
            onComplete={handleFormComplete}
            editingEntry={editingEntry}
            selectedDate={selectedDate}
          />
        </motion.div>
      )}
      {/* Recent Mood Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
          Recent Entries
        </h3>

        {moodEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodEntries.slice(0, 6).map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">
                      {format(parseISO(entry.date), "MMM d, yyyy")}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(parseISO(entry.date), "h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getMoodIcon(entry.mood)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodColor(
                        entry.mood
                      )}`}
                    >
                      {entry.mood}/10
                    </span>
                  </div>
                </div>

                {entry.activities && entry.activities.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Activities:{" "}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.activities.map((activity, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {entry.notes}
                  </p>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
                  <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>Energy: {entry.energy}/10</span>
                    <span>Sleep: {entry.sleep}/10</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      title="Edit entry"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !showForm ? (
          <div className="text-center py-8">
            <Smile className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No mood entries yet. Start tracking your mood to identify
              patterns.
            </p>
            <button
              onClick={handleAddMood}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg"
            >
              Track Mood
            </button>
          </div>
        ) : null}
      </div>
      {isDeleteDialogOpen && (
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
        >
          <Dialog.Panel className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Delete Habit
            </Dialog.Title>
            <Dialog.Description className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete this habit? This action cannot be
              undone.
            </Dialog.Description>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === moodToDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {deletingId === moodToDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      )}{" "}
    </div>
  );
};

export default MoodTracker;
