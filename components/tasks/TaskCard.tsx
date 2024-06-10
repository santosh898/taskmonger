import React from "react";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category?: string;
}

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-2">
      <h3 className="text-lg font-semibold">{task.name}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs mt-2">
        {task.completed ? "Completed" : "Incomplete"}
      </p>
    </div>
  );
};

export default TaskCard;
