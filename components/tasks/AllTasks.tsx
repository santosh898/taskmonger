import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category?: string;
}

const AllTasks: React.FC = ({tasks, setTasks}: any) => {
  const [input, setInput] = useState<string>("");

  // Load tasks from local storage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task to the task list
  const addTask = (task: Task) => {
    setTasks((tasks: any) => [...tasks, task]);
  };

  // Update the completion status of a task
  const updateTaskCompletion = (taskId: string, completed: boolean) => {
    const updatedTasks = tasks.map((task :any) =>
      task.id === taskId ? { ...task, completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mission Requirements</h1>
      <div className="mb-4">
        {tasks.map((task :any) => (
          <div key={task.id} className="flex items-center mb-2 p-2 bg-white shadow rounded">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={(checked) => updateTaskCompletion(task.id, checked as boolean)}
              className="mr-2"
            />
            <label
              htmlFor={`task-${task.id}`}
              className={task.completed ? "line-through" : ""}
            >
              {task.name}
            </label>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) {
            addTask({
              id: String(tasks.length),
              name: input,
              description: "",
              completed: false,
            });
            setInput(""); // Clear the input after adding the task
          }
        }}
        className="flex items-center mb-4"
      >
        <label htmlFor="name" className="mr-2">Task</label>
        <Input
          type="text"
          id="name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="mr-2"
        />
        <Button type="submit">Add</Button>
      </form>
      <Button onClick={() => setTasks([])} variant="secondary">
        Clear
      </Button>
    </div>
  );
};

export default AllTasks;
