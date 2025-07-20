import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Calendar, CheckCircle, Circle, Trash2 } from "lucide-react";
import { useGoals } from "../../contexts/GoalsContext";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string | null;
  completed: boolean;
  createdAt: string;
}

interface GoalCardProps {
  goal: Goal;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const { completeGoal, deleteGoal } = useGoals();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleComplete = () => {
    if (!goal.completed) {
      completeGoal(goal.id);
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = () => {
    deleteGoal(goal.id);
    setIsDeleting(false);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

const createdDate = goal.createdAt ? format(new Date(goal.createdAt), 'MMMM d, yyyy') : '';

  return (
    <motion.div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
        goal.completed
          ? "border-l-4 border-green-500 dark:border-green-600"
          : ""
      }`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                goal.completed
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-800 dark:text-white"
              }`}
            >
              {goal.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Created on {createdDate}
            </p>
          </div>

          <div onClick={handleToggleComplete} className="cursor-pointer">
            {goal.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            {goal.description}
          </p>
        )}

        {goal.targetDate && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Calendar className="h-4 w-4 mr-1.5" />
            Target: {format(new Date(goal.targetDate), "MMMM d, yyyy")}
          </div>
        )}
        {isDeleting ? (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">
              Are you sure you want to delete this goal?
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDelete}
                className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-1.5 border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
            <button
              onClick={handleDelete}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalCard;
