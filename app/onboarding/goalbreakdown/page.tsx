"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const tasks = [
  { 1: "task1" },
  { 2: "task2" },
  { 3: "tasks3" },
  { 4: "tasks4" },
];

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <p>Here is a breakdown of your goal</p>
      {tasks.map((_task, _index) => {
        const key = Object.keys(_task)[0];
        const value = _task[key];
        return <p>{`Task ${key}: ${value}`}</p>;
      })}
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="more" placeholder="add more" />
        <Button variant="secondary">add more</Button>
        {/* on add append to tasks, tasks will render; tasks also need to be movable */}
      </div>
      <Button
        variant={"default"}
        onClick={() => {
          router.push("/gametime");
        }}
      >
        Go
      </Button>
    </div>
  );
}
