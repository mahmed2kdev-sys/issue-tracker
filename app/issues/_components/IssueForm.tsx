"use client";

import { ErrorMessage, Spinner } from "@/app/components";
import { issueSchema } from "@/app/ValidationSchemas";
import type { Issue } from "@/generated/prisma/client";
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
type IssueFormData = z.infer<typeof issueSchema>;

export default function IssueForm({ issue }: { issue?: Issue }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title ?? "",
      description: issue?.description ?? "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError("");
      if (issue) {
        await axios.patch(`/api/issues/${issue.id}`, data);
      } else {
        await axios.post("/api/issues", data);
      }
      router.push("/issues");
      router.refresh();
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
        {issue ? "Update Issue" : "Submit New Issue"}
        {isSubmitting && <Spinner />}
      </Button>
    </form>
  );
}
