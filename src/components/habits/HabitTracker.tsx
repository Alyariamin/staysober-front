  import React, { useState, useEffect } from "react";
  import { motion } from "framer-motion";
  import {
    Plus,
    CheckCircle,
    Circle,
    Flame,
    Calendar,
    Trash2,
    Edit2,
  } from "lucide-react";
  import { useHabits } from "../../contexts/HabitsContext";
  import { Dialog } from "@headlessui/react";
  import HabitForm from "./HabitForm";

  const HabitTracker: React.FC = () => {
    const {
      habits,
      toggleHabit,
      isHabitCompletedToday,
      deleteHabit,
      updateHabit,
    } = useHabits();
    const [showForm, setShowForm] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

    const [editingHabit, setEditingHabit] = useState<null | {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
    }>(null);
    const [completionStatus, setCompletionStatus] = useState<
      Record<string, boolean>
    >({});
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
      const loadCompletionStatus = async () => {
        const status: Record<string, boolean> = {};
        for (const habit of habits) {
          status[habit.id] = await isHabitCompletedToday(habit.id);
        }
        setCompletionStatus(status);
      };

      loadCompletionStatus();
    }, [habits, isHabitCompletedToday]);

    const handleToggleHabit = async (id: string) => {
      try {
        await toggleHabit(id, today);
        setCompletionStatus((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      } catch (error) {
        console.error("Error toggling habit:", error);
      }
    };

    const handleDeleteHabit = async (id: string) => {
      setHabitToDelete(id);
      setIsDeleteDialogOpen(true);
    };
    const confirmDelete = async () => {
      if (!habitToDelete) return;

      setDeletingId(habitToDelete);
      try {
        await deleteHabit(habitToDelete);
      } catch (error) {
        console.error("Error deleting habit:", error);
      } finally {
        setDeletingId(null);
        setHabitToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    };
    const handleEditHabit = (habit: {
      id: string;
      name: string;
      description: string;
      icon: string;
      color: string;
    }) => {
      setEditingHabit(habit);
    };

    const handleUpdateHabit = async (updatedHabit: {
      name: string;
      description: string;
      icon: string;
      color: string;
    }) => {
      if (editingHabit) {
        try {
          await updateHabit(editingHabit.id, updatedHabit);
          setEditingHabit(null);
        } catch (error) {
          console.error("Error updating habit:", error);
        }
      }
    };

    const getStreakColor = (streak: number) => {
      if (streak >= 30) return "text-purple-600 dark:text-purple-400";
      if (streak >= 14) return "text-blue-600 dark:text-blue-400";
      if (streak >= 7) return "text-green-600 dark:text-green-400";
      if (streak >= 3) return "text-yellow-600 dark:text-yellow-400";
      return "text-gray-600 dark:text-gray-400";
    };

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
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
      exit: {
        opacity: 0,
        x: -50,
        transition: { duration: 0.2 },
      },
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white ocean:text-cyan-800 forest:text-green-800 sunset:text-orange-800 lavender:text-purple-800">
            Daily Habits
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-3 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 ocean:hover:bg-cyan-700 forest:hover:bg-green-700 sunset:hover:bg-orange-700 lavender:hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </button>
        </div>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <HabitForm
              onComplete={() => {
                setShowForm(false);
              }}
            />
          </motion.div>
        )}
        {editingHabit && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <HabitForm
              initialHabit={{
                name: editingHabit.name,
                description: editingHabit.description,
                icon: editingHabit.icon,
                color: editingHabit.color,
              }}
              onComplete={() => {
                setEditingHabit(null);
              }}
              onSubmit={handleUpdateHabit}
            />
          </motion.div>
        )}
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No habits tracked yet. Start building positive routines!
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 ocean:bg-cyan-600 forest:bg-green-600 sunset:bg-orange-600 lavender:bg-purple-600 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg"
              >
                Create Your First Habit
              </button>
            )}
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {habits.map((habit) => {
              const isCompleted = completionStatus[habit.id] || false;

              return (
                <motion.div
                  key={habit.id}
                  variants={itemVariants}
                  layout
                  style={{
                    backgroundColor: `${habit.color}20`,
                    borderColor: habit.color,
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isCompleted ? "bg-opacity-30" : "bg-opacity-20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className="flex-shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <Circle className="h-6 w-6 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400" />
                        )}
                      </button>

                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <div>
                          <h3
                            className={`font-medium ${
                              isCompleted
                                ? "text-green-800 dark:text-green-300 line-through"
                                : "text-slate-800 dark:text-white"
                            }`}
                          >
                            {habit.name}
                          </h3>
                          {habit.description && (
                            <p
                              className={`text-sm ${
                                isCompleted
                                  ? "text-green-700 dark:text-green-300"
                                  : "text-gray-600 dark:text-gray-300"
                              }`}
                            >
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {habit.streak > 0 && (
                        <div className="flex items-center space-x-1">
                          <Flame
                            className={`h-4 w-4 ${getStreakColor(habit.streak)}`}
                          />
                          <span
                            className={`text-sm font-medium ${getStreakColor(
                              habit.streak
                            )}`}
                          >
                            {habit.streak}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        aria-label="Edit habit"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        disabled={deletingId === habit.id}
                        className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        aria-label="Delete habit"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
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
                  disabled={deletingId === habitToDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
                >
                  {deletingId === habitToDelete ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Dialog.Panel>
          </Dialog>
        )}{" "}
      </div>
    );
  };

  export default HabitTracker;
