import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMood } from "../../contexts/MoodContext";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  notes: string;
  activities: string[];
  energy: number;
  anxiety: number;
  sleep: number;
  createdAt: string;
}

interface MoodFormProps {
  onComplete: () => void;
  editingEntry?: MoodEntry;
  selectedDate?: string; // Optional date for creating entry on specific date
}

const MoodForm: React.FC<MoodFormProps> = ({ onComplete, editingEntry, selectedDate }) => {
  const { addMoodEntry, updateMoodEntry } = useMood();
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [notes, setNotes] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState("");

  const commonActivities = [
    "Exercise",
    "Meditation",
    "Reading",
    "Socializing",
    "Work",
    "Therapy",
    "Music",
    "Nature",
  ];

  // Load existing entry data if editing
  React.useEffect(() => {
    if (editingEntry) {
      setMood(editingEntry.mood);
      setEnergy(editingEntry.energy);
      setAnxiety(editingEntry.anxiety);
      setSleep(editingEntry.sleep);
      setNotes(editingEntry.notes);
      setActivities(editingEntry.activities);
    }
  }, [editingEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entryDate = selectedDate || new Date().toISOString();
    const entryData = {date: editingEntry ? editingEntry.date : entryDate,mood,energy,
      anxiety,
      sleep,
      notes,
      activities,
    };
    if (editingEntry) {
      updateMoodEntry(editingEntry.id, entryData);
    } else {
      try {
        addMoodEntry(entryData);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to add mood entry');
        return;
      }
    }
    onComplete();
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const addCustomActivity = () => {
    if (customActivity.trim() && !activities.includes(customActivity.trim())) {
      setActivities(prev => [...prev, customActivity.trim()]);
      setCustomActivity("");
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(prev => prev.filter(a => a !== activity));
  };

  const getMoodEmoji = (value: number) => {
    if (value >= 9) return "😄";
    if (value >= 7) return "😊";
    if (value >= 5) return "😐";
    if (value >= 3) return "😔";
    return "😢";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800 mb-4">
        {editingEntry ? 'Edit Mood Entry' : 'How are you feeling today?'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Overall Mood {getMoodEmoji(mood)}
          </label>

          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Very Low
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Very High
              </span>
            </div>

            <div className="relative mb-4">
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 via-blue-200 to-green-200 dark:from-red-800 dark:via-yellow-800 dark:via-blue-800 dark:to-green-800 rounded-lg appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, 
                    #fecaca 0%, #fecaca 20%, 
                    #fde68a 20%, #fde68a 40%, 
                    #bfdbfe 40%, #bfdbfe 60%, 
                    #86efac 60%, #86efac 80%, 
                    #34d399 80%, #34d399 100%)`,
                }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white dark:bg-slate-800 border-3 border-gray-400 dark:border-gray-300 rounded-full shadow-lg pointer-events-none transition-all duration-200"
                style={{
                  left: `calc(${((mood - 1) / 9) * 100}% - 12px)`,
                  borderColor:
                    mood <= 3
                      ? "#ef4444"
                      : mood <= 6
                      ? "#f59e0b"
                      : mood <= 8
                      ? "#3b82f6"
                      : "#10b981",
                }}
              />
            </div>

            <div className="flex items-center justify-center">
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  mood <= 3
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    : mood <= 6
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    : mood <= 8
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                    : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                }`}
              >
                {mood}/10 - {getMoodEmoji(mood)}{" "}
                {mood <= 2
                  ? "Very Low"
                  : mood <= 4
                  ? "Low"
                  : mood <= 6
                  ? "Moderate"
                  : mood <= 8
                  ? "Good"
                  : "Excellent"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Energy Level ⚡
            </label>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Low
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 dark:from-red-600 dark:via-yellow-600 dark:to-green-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #f87171 0%, #f87171 25%, 
                      #facc15 25%, #facc15 50%, 
                      #4ade80 50%, #4ade80 75%, 
                      #22c55e 75%, #22c55e 100%)`,
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  High
                </span>
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    energy <= 3
                      ? "text-red-600 dark:text-red-400"
                      : energy <= 6
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {energy}/10
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Anxiety Level 😰
            </label>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Low
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={anxiety}
                  onChange={(e) => setAnxiety(Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 dark:from-green-600 dark:via-yellow-600 dark:to-red-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #22c55e 0%, #22c55e 25%, 
                      #4ade80 25%, #4ade80 50%, 
                      #facc15 50%, #facc15 75%, 
                      #f87171 75%, #f87171 100%)`,
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  High
                </span>
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    anxiety <= 3
                      ? "text-green-600 dark:text-green-400"
                      : anxiety <= 6
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {anxiety}/10
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Sleep Quality 😴
            </label>
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Poor
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="flex-1 h-3 bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 dark:from-red-600 dark:via-yellow-600 dark:to-blue-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      #f87171 0%, #f87171 25%, 
                      #facc15 25%, #facc15 50%, 
                      #4ade80 50%, #4ade80 75%, 
                      #22c55e 75%, #22c55e 100%)`,
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Great
                </span>
              </div>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    sleep <= 3
                      ? "text-red-600 dark:text-red-400"
                      : sleep <= 6
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {sleep}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Activities Today
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {commonActivities.map((activityOption) => (
              <button
                key={activityOption}
                type="button"
                onClick={() => toggleActivity(activityOption)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activities.includes(activityOption)
                    ? "bg-blue-600 dark:bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                }`}
              >
                {activityOption}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customActivity}
              onChange={(e) => setCustomActivity(e.target.value)}
              placeholder="Add custom activity..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-700 dark:text-white text-sm"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomActivity())}
            />
            <button
              type="button"
              onClick={addCustomActivity}
              className="px-3 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 text-sm"
            >
              Add
            </button>
          </div>
          
          {activities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <span
                  key={activity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                >
                  {activity}
                  <button
                    type="button"
                    onClick={() => removeActivity(activity)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="mood-notes"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Notes (Optional)
          </label>
          <textarea
            id="mood-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-slate-700 dark:text-white"
            placeholder="How are you feeling? What's on your mind?"
          />
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
            {editingEntry ? 'Update Mood' : 'Save Mood'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoodForm;
