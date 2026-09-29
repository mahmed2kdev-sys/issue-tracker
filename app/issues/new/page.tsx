"use client";

import { ErrorMessage, Spinner } from "@/app/components";
import { CreateIssueSchema } from "@/app/ValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, TextField } from "@radix-ui/themes";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// ponytail: single shared schema, no duplicate inline rules
type IssueForm = z.infer<typeof CreateIssueSchema>;

function NewIssuePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueForm>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch {
      // ponytail: generic catch, field-map when API returns fieldErrors
      setError("An unexpected error occurred.");
    }
  });

  return (
    <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
      {error && (
        <Callout.Root color="red">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <TextField.Root placeholder="Title" {...register("title")} />
      <ErrorMessage>{errors.title?.message}</ErrorMessage>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <MDEditor
            value={field.value}
            onChange={(v) => field.onChange(v ?? "")}
            preview="edit"
            height={300}
          />
        )}
      />
      <ErrorMessage>{errors.description?.message}</ErrorMessage>
      <Button disabled={isSubmitting}>
        Submit New Issue
        {isSubmitting && <Spinner />}
      </Button>
    </form>
  );
}

export default NewIssuePage;
