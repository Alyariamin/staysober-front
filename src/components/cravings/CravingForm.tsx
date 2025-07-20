import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCravings } from '../../contexts/CravingsContext';

interface CravingFormProps {
  onComplete: () => void;
  editingId?: string | null;
}

const CravingForm: React.FC<CravingFormProps> = ({ onComplete, editingId }) => {
  const { addCraving, updateCraving, cravings } = useCravings();
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [location, setLocation] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(10);
  const [overcome, setOvercome] = useState(false);

  const commonTriggers = ['Stress', 'Boredom', 'Social pressure', 'Anxiety', 'Depression', 'Celebration', 'Habit', 'Physical pain'];
  const commonStrategies = ['Deep breathing', 'Called support person', 'Exercise', 'Meditation', 'Distraction', 'Left the situation', 'Journaling', 'Listened to music'];

  // Load existing craving data if editing
  useEffect(() => {
    if (editingId) {
      const existingCraving = cravings.find(c => c.id === editingId);
      if (existingCraving) {
        setIntensity(existingCraving.intensity);
        setTrigger(existingCraving.trigger);
        setLocation(existingCraving.location);
        setCopingStrategy(existingCraving.copingStrategy);
        setNotes(existingCraving.notes);
        setDuration(existingCraving.duration);
        setOvercome(existingCraving.overcome);
      }
    }
  }, [editingId, cravings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trigger.trim()) return;
    
    const cravingData = {
      intensity,
      trigger,
      location,
      copingStrategy,
      notes,
      duration,
      overcome
    };

    if (editingId) {
      updateCraving(editingId, cravingData);
    } else {
      addCraving({
        ...cravingData,
        date: new Date().toISOString()
      });
    }
    
    onComplete();
  };

  const getIntensityColor = (value: number) => {
    if (value <= 3) return 'bg-green-500';
    if (value <= 6) return 'bg-yellow-500';
    if (value <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getIntensityLabel = (value: number) => {
    if (value <= 2) return 'Very Low';
    if (value <= 4) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'High';
    return 'Very High';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
        {editingId ? 'Edit Craving' : 'Log a Craving'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Intensity (1-10)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 w-8">Low</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, 
                      #10B981 0%, #10B981 20%, 
                      #F59E0B 20%, #F59E0B 40%, 
                      #F97316 40%, #F97316 60%, 
                      #EF4444 60%, #EF4444 80%, 
                      #DC2626 80%, #DC2626 100%)`
                  }}
                />
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
                  style={{ 
                    left: `calc(${((intensity - 1) / 9) * 100}% - 10px)`,
                    backgroundColor: intensity <= 3 ? '#10B981' : 
                                   intensity <= 6 ? '#F59E0B' : 
                                   intensity <= 8 ? '#F97316' : '#EF4444'
                  }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                intensity <= 3 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                intensity <= 6 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                intensity <= 8 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
              }`}>
                {getIntensityLabel(intensity)}
              </span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm font-medium">
                {intensity}/10
              </span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="trigger" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            What triggered this craving?
          </label>
          <input
            id="trigger"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="e.g., Stress, Social situation, Boredom"
            required
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {commonTriggers.map((commonTrigger) => (
              <button
                key={commonTrigger}
                type="button"
                onClick={() => setTrigger(commonTrigger)}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                {commonTrigger}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Where were you?
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="e.g., Home, Work, Bar, Friend's house"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            How long did it last? (minutes)
          </label>
          <input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            min="1"
          />
        </div>

        <div>
          <label htmlFor="copingStrategy" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            What did you do to cope?
          </label>
          <input
            id="copingStrategy"
            value={copingStrategy}
            onChange={(e) => setCopingStrategy(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="How did you handle this craving?"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {commonStrategies.map((strategy) => (
              <button
                key={strategy}
                type="button"
                onClick={() => setCopingStrategy(strategy)}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                {strategy}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="overcome"
            type="checkbox"
            checked={overcome}
            onChange={(e) => setOvercome(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="overcome" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
            I successfully overcame this craving
          </label>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Additional notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            placeholder="Any additional thoughts or observations..."
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
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg"
          >
            {editingId ? 'Update Craving' : 'Log Craving'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CravingForm;