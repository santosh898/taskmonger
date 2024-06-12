"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function goalDisintegrator(userGoal: any) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that will help the user break down their goal into smaller achievable tasks\
            based on their self claimed skill level, the goals are usually multi week level goals, you need to break\
            it down in appropriate steps that will allow them to gradually hit the target. If the goal is not realistic,\
            mention the same and give them a smaller subset of the goal that is very achievable in their set time frame \
            your output to the user will be a week on week plan and maybe even call out important days in a JSON \
            like caveat:if there is a caveat(goal unrealistic maybe), yourGoal:their goal, task1:{taskname: detailed task, \
            timeToComplete: time (# of pomodoros), task requirements:}, task2:... }",
      },
      {
        role: "user",
        content: userGoal,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  // console.log("output from AI:", completion.choices[0]);
  return completion.choices[0]
}
