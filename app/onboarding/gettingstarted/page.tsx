"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { goalDisintegrator } from "@/app/actions/goal";
import { useState } from "react";

interface FormData {
  goalData: string;
}


export default function Home() {
  const [smallerGoals, setSmallerGoals] = useState();

  const form = useForm<FormData>({
    defaultValues: {
      goalData: '',
    },
  });
  const router = useRouter();

  const onSubmit = async (goalData: FormData) => {
    //send to openAI and fetch results
    let goalbreakdown;
     if (goalData.goalData) 
      goalDisintegrator(goalData.goalData).then((output)=>{
        setSmallerGoals(output)
    })

    console.log("goalData:", goalData)
    //navigate to next page
    // router.push("/onboarding/goalbreakdown");
  };
  return (
    <div className="flex flex-col gap-4 p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="goalData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is that one goal you are working on?</FormLabel>
                <FormControl className="w-full">
                  <Textarea
                    placeholder="in as much detail as you can"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">go</Button>
        </form>
      </Form>
      {
        smallerGoals && smallerGoals.message.content
      }
    </div>
  );
}
