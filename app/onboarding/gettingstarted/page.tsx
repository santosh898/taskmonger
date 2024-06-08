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

export default function Home() {
  const form = useForm();
  const router = useRouter();
  const onSubmit = () => {
    //navigate to next page
    router.push("/onboarding/goalbreakdown");
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
            name="goal-heading"
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
    </div>
  );
}
