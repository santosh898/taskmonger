interface Task {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    category?: string;
  }

const FocusView = (tasks:Task[], setTasks: any) => {
    return (
        <p>Focus View </p>
    )
}

export default FocusView;