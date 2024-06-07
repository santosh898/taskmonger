"use client"
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

  const kaplayCtx = useRef<KaboomCtx>(null);

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

      {tasks.map((task) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => {
              updateTaskCompletion(task.id, e.target.checked);
            }}
          />
          {task.name}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask({
            id: String(tasks.length),
            name: input,
            description: "",
            completed: false,
          });
        }}
      >
        <label htmlFor="name">Task Name</label>
        <input
          type="text"
          id="name"
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <button>Add</button>
      </form>
      <button onClick={() => setTasks([])}>Clear</button>
    </>
  );
}
