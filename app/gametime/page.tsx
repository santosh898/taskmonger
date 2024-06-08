"use client";
import { useEffect, useRef, useState } from "react";
import kaplay, { KaboomCtx } from "kaplay";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const kaplayCtx = useRef<KaboomCtx | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const k = kaplay({
        // if you don't want to import to the global namespace
        global: false,
        // if you don't want kaboom to create a canvas and insert under document.body
        canvas: canvasRef.current,
        width: 800,
        height: 400,
      });

      kaplayCtx.current = k;

      k.loadSprite("bean", "/sprites/bean.png");
      k.loadSprite("coin", "/sprites/coin.png");
      k.loadSprite("spike", "/sprites/spike.png");
      k.loadSprite("grass", "/sprites/grass.png");
      k.loadSprite("ghosty", "/sprites/ghosty.png");
      k.loadSprite("portal", "/sprites/portal.png");
      k.loadSound("score", "/sounds/score.mp3");
      k.loadSound("portal", "/sounds/portal.mp3");

      k.setGravity(2400);
    }
  }, []);

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((tasks) => [...tasks, task]);
  };

  const replaceStringAt = function (
    str: string,
    index: number,
    replacement: string
  ) {
    return (
      str.substring(0, index) +
      replacement +
      str.substring(index + replacement.length)
    );
  };

  useEffect(() => {
    const k = kaplayCtx.current!;
    k.scene("game", () => {
      let tasksString = [...Array(7)].map(() => " ").join("");

      tasks.forEach((_, index) => {
        tasksString = replaceStringAt(tasksString, index * 2 + 1, "^");
      });
      const levelString = "@" + tasksString + ">";
      const level = k.addLevel([levelString, "========="], {
        tileWidth: 64,
        tileHeight: 64,
        pos: k.vec2(100, 200),
        tiles: {
          "@": () => [
            k.sprite("bean"),
            k.area(),
            k.body(),
            k.anchor("bot"),
            k.state("move", ["move", "idle", "jump"]),
            "player",
          ],
          "=": () => [
            k.sprite("grass"),
            k.area(),
            k.body({ isStatic: true }),
            k.anchor("bot"),
          ],
          $: () => [k.sprite("coin"), k.area(), k.anchor("bot"), "coin"],
          "^": ({ x }: any) => {
            const taskIndex = Math.floor((x - 1) / 2);
            return [
              k.sprite("spike"),
              k.area(),
              k.anchor("bot"),
              "danger",
              { task: tasks[taskIndex], taskIndex },
            ];
          },
          ">": () => [k.sprite("portal"), k.area(), k.anchor("bot"), "portal"],
        },
      });

      const player = level.get("player")[0];

      player.onCollide(
        "danger",
        ({ task }: { task: Task; taskIndex: number }) => {
          if (task.completed) {
            player.enterState("jump");
          } else {
            // const previousTask = level
            //   .get("danger")
            //   .find((t) => t.taskIndex === taskIndex - 1);
            // if (previousTask) {
            //   console.log(previousTask);
            //   player.pos = level.tile2Pos(previousTask.pos.x + 64, 0);
            // } else {
            player.pos = level.tile2Pos(0, 0);
            // }
            player.enterState("idle");
            k.play("score");
          }
        }
      );

      player.onCollide("portal", () => {
        k.play("portal");
        k.go("win", { score: tasks.length });
      });

      const SPEED = 256;

      player.onStateUpdate("move", () => {
        if (tasks.length === 0) {
          player.enterState("idle");
        } else {
          player.move(SPEED, 0);
        }
      });

      player.onStateEnter("jump", async () => {
        if (player.isGrounded()) {
          player.move(128, 0);
          player.jump();
        }
        await k.wait(0.05);
        player.enterState("move");
      });
    });

    k.scene("win", ({ score }: any) => {
      k.add([
        k.text(`You Finished ${score} tasks!!!`, {
          width: k.width(),
        }),
        k.pos(12),
      ]);

      k.onKeyPress(() => setTasks([]));
    });
    k.go("game");
  }, [tasks]);

  const updateTaskCompletion = (taskId: string, completed: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = completed;
      setTasks([...tasks]);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} width="100%" height={400}></canvas>

      <div className="flex flex-col items-start gap-2 p-4">
        <h2 className="text-2xl font-bold">Tasks</h2>
        {tasks.map((task) => (
          <label key={task.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => {
                updateTaskCompletion(task.id, e.target.checked);
              }}
              className="h-4 w-4 rounded border-gray-300"
            />
            <p className={`text-md ${task.completed ? "line-through" : ""}`}>
              {task.name}
            </p>
          </label>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask({
            id: String(tasks.length),
            name: input,
            description: "",
            completed: false,
          });
          setInput("");
        }}
        className="flex flex-col gap-2 p-4 bg-white items-start"
      >
        <label htmlFor="name">Add Task</label>
        <input
          type="text"
          id="name"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Task Name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className="w-[50%] p-2 border border-gray-300 rounded-md"
        />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add
        </button>
      </form>
      <button onClick={() => setTasks([])}>Clear</button>
    </>
  );
}
