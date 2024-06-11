import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category?: string;
}

interface KanbanProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
}

const Column: React.FC<ColumnProps> = ({ id, title, tasks }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className="w-1/4 p-4 bg-gray-100 rounded">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {tasks.map((task, index) => (
        <DraggableItem key={task.id} task={task} />
      ))}
    </div>
  );
};

interface DraggableItemProps {
  task: Task;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    marginBottom: '1rem', // Add some space between tasks
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} />
    </div>
  );
};

const Kanban: React.FC<KanbanProps> = ({ tasks, setTasks }) => {
  const [nowTasks, setNowTasks] = useState<Task[]>([]);
  const [nextTasks, setNextTasks] = useState<Task[]>([]);
  const [laterTasks, setLaterTasks] = useState<Task[]>([]);
  const [uncategorizedTasks, setUncategorizedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const categorizedTasks = {
      now: [] as Task[],
      next: [] as Task[],
      later: [] as Task[],
      uncategorized: [] as Task[],
    };

    tasks.forEach((task) => {
      switch (task.category) {
        case 'Now':
          categorizedTasks.now.push(task);
          break;
        case 'Next':
          categorizedTasks.next.push(task);
          break;
        case 'Later':
          categorizedTasks.later.push(task);
          break;
        default:
          categorizedTasks.uncategorized.push(task);
          break;
      }
    });

    setNowTasks(categorizedTasks.now);
    setNextTasks(categorizedTasks.next);
    setLaterTasks(categorizedTasks.later);
    setUncategorizedTasks(categorizedTasks.uncategorized);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const updatedTasks = [...tasks];
    const task = updatedTasks.find((task) => task.id === active.id);

    if (task) {
      task.category = over.id as string;
      setTasks(updatedTasks);
    }
  };

  const columns = [
    { id: 'uncategorized', title: 'No Category', tasks: uncategorizedTasks },
    { id: 'now', title: 'Now', tasks: nowTasks },
    { id: 'next', title: 'Next', tasks: nextTasks },
    { id: 'later', title: 'Later', tasks: laterTasks },
  ];

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4">
        {columns.map((column) => (
          <Column key={column.id} id={column.id} title={column.title} tasks={column.tasks} />
        ))}
      </div>
    </DndContext>
  );
};

export default Kanban;
