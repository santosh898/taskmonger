// This is a KANBAN

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category?: string;
}

interface TimeViewProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TimeView: React.FC<TimeViewProps> = ({ tasks, setTasks }) => {
  const [nowTasks, setNowTasks] = useState<Task[]>([]);
  const [nextTasks, setNextTasks] = useState<Task[]>([]);
  const [laterTasks, setLaterTasks] = useState<Task[]>([]);
  const [uncategorizedTasks, setUncategorizedTasks] = useState<Task[]>([]);

  // Initialize tasks when tasks prop changes
  useEffect(() => {
    // Clear previous state
    setNowTasks([]);
    setNextTasks([]);
    setLaterTasks([]);
    setUncategorizedTasks([]);

    // Categorize tasks
    tasks.forEach((task) => {
      switch (task.category) {
        case "Now":
          setNowTasks((prevTasks) => [...prevTasks, task]);
          break;
        case "Next":
          setNextTasks((prevTasks) => [...prevTasks, task]);
          break;
        case "Later":
          setLaterTasks((prevTasks) => [...prevTasks, task]);
          break;
        default:
          setUncategorizedTasks((prevTasks) => [...prevTasks, task]);
          break;
      }
    });
  }, [tasks]);

  // Handle drag end
  const handleDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same list
    if (source.droppableId === destination.droppableId) {
      switch (source.droppableId) {
        case "now":
          setNowTasks((prevTasks) => reorderTasks(prevTasks, source.index, destination.index));
          break;
        case "next":
          setNextTasks((prevTasks) => reorderTasks(prevTasks, source.index, destination.index));
          break;
        case "later":
          setLaterTasks((prevTasks) => reorderTasks(prevTasks, source.index, destination.index));
          break;
        case "uncategorized":
          setUncategorizedTasks((prevTasks) => reorderTasks(prevTasks, source.index, destination.index));
          break;
        default:
          break;
      }
    } else {
      // If dropped in a different list
      const updatedTasks = [...tasks];
      const task = updatedTasks.find((task) => task.id === draggableId);
      if (task) {
        task.category = destination.droppableId;
        setTasks(updatedTasks);
      }
    }
  };

  // Reorder tasks within the same list
  const reorderTasks = (list: Task[], startIndex: number, endIndex: number): Task[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex justify-between">

        {/* UNCATEGORIZED */}
      <Droppable droppableId="now">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1">
              <h2>No Category</h2>
              {uncategorizedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* NOW */}
        <Droppable droppableId="now">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1">
              <h2>Now</h2>
              {nowTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* NEXT */}
        <Droppable droppableId="next">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1">
              <h2>Next</h2>
              {nextTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

          {/* LATER */}
        <Droppable droppableId="later">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1">
              <h2>Later</h2>
              {laterTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default TimeView;
