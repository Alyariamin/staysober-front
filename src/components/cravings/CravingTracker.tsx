import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useCravings } from "../../contexts/CravingsContext";
import CravingForm from "./CravingForm";
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const CravingTracker: React.FC = () => {
  const { getCravingStats, getRecentCravings, deleteCraving } = useCravings();
  const [showForm, setShowForm] = useState(false);
  const [editingCraving, setEditingCraving] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cravingToDelete, setcravingToDelete] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = getCravingStats();
  const recentCravings = getRecentCravings();
  const successRate =
    stats.totalCravings > 0
      ? Math.round((stats.overcomeCravings / stats.totalCravings) * 100)
      : 0;

  const handleDelete = async (id: string) => {
    setcravingToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!cravingToDelete) return;

    setDeletingId(cravingToDelete);
    try {
      await deleteCraving(cravingToDelete);
    } catch (error) {
      console.error("Error deleting habit:", error);
    } finally {
      setDeletingId(null);
      setcravingToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    setEditingCraving(id);
    setShowForm(true);
  };

  const handleFormComplete = () => {
    setShowForm(false);
    setEditingCraving(null);
  };

  const handleNewCraving = () => {
    setEditingCraving(null);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Craving Tracker
        </h2>
        <button
          onClick={handleNewCraving}
          className="flex items-center px-3 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          <Plus className="h-4 w-4 mr-1" />
          Log Craving
        </button>
      </div>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <CravingForm
            onComplete={handleFormComplete}
            editingId={editingCraving}
          />
        </motion.div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Cravings
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {stats.totalCravings}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Success Rate
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {successRate}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center mb-2">
            <TrendingDown className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Intensity
            </h3>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">
            {stats.averageIntensity}/10
          </p>
        </div>
      </div>
      {stats.commonTriggers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 mb-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Common Triggers
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.commonTriggers.map((trigger, index) => (
              <span
                key={trigger}
                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}
      {recentCravings.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            No cravings logged recently. Keep up the great work!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Recent Cravings
          </h3>
          {recentCravings.slice(0, 5).map((craving) => (
            <div
              key={craving.id}
              className={`p-4 rounded-lg border ${
                craving.overcome
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 dark:text-white">
                    {craving.trigger} - Intensity: {craving.intensity}/10
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(craving.date).toLocaleDateString()} at{" "}
                    {craving.location}
                  </p>
                  {craving.copingStrategy && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                      <strong>Coping strategy:</strong> {craving.copingStrategy}
                    </p>
                  )}
                  {craving.notes && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {craving.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {craving.overcome ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}

                  <button
                    onClick={() => handleEdit(craving.id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Edit craving"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(craving.id)}
                    className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete craving"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isDeleteDialogOpen && (
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
        >
          <DialogPanel className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 max-w-sm w-full">
            <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
              Delete Habit
            </DialogTitle>
            <Description className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete this habit? This action cannot be
              undone.
            </Description>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === cravingToDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {deletingId === cravingToDelete ? "Deleting..." : "Delete"}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      )}{" "}
    </div>
  );
};

export default CravingTracker;
