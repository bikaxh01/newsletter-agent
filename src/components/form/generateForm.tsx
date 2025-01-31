"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import EmailDialog from "../EmailDialog";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
  tone: z.string().min(2, {
    message: "Tone is required",
  }),
  audience: z.string().min(2, {
    message: "Please select Audience",
  }),
});
function GenerateForm({
  previewResponse,
  loading,
  setLoading,
  newsLetter,
}: any) {
  const [readyToSend, setReadyToSend] = useState(false);
  const [subject, setSubject] = useState("");
  const [emails, setEmails] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    try {
      setLoading(true);
      const response = await axios.post("/api/generate-newsletter", values);
      setReadyToSend(response.data.readyToSend);
      setSubject(response.data.subject);
      previewResponse(response.data.data);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    if (!emails) return;

    const emailsArray = emails.split(",");
    const finalEmails = emailsArray.map(email => email.trim());
   
    const res = await axios.post("api/send-email", {
      emails: finalEmails,
      newsLetter: newsLetter,
      subject: subject,
    });

    console.log(res.data);
  }
  return (
    <Card className=" h-screen p-5">
      <CardHeader>
        <CardTitle>Generate New-letter</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <FormControl>
                  <Input placeholder="Artificial intelligence" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Informative yet approachable"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Input placeholder="Young Adults" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className=" w-full">
            Submit
          </Button>
        </form>
      </Form>

      {readyToSend && (
        <div className=" w-full  pt-4 ">
          <EmailDialog handleSubmitClick={sendEmail} setEmails={setEmails} />
        </div>
      )}
    </Card>
  );
}

export default GenerateForm;
