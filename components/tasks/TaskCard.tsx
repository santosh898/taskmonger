import React from 'react';

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
    <div className="p-4 bg-white rounded shadow">
      <h3>{task.name}</h3>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;