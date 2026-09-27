"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { Button, Callout, Text, TextField } from "@radix-ui/themes";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface IssueForm {
  title: string;
  description: string;
}

function NewIssuePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
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
      <TextField.Root
        placeholder="Title"
        {...register("title", { required: "Title is required." })}
      />
      {errors.title && (
        <Text color="red" size="2" as="p" className="block pb-2">
          {errors.title.message}
        </Text>
      )}
      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required." }}
        render={({ field }) => (
          <MDEditor
            value={field.value}
            onChange={(v) => field.onChange(v ?? "")}
            preview="edit"
            height={300}
          />
        )}
      />
      {errors.description && (
        <Text color="red" size="2" as="p" className="block pb-2">
          {errors.description.message}
        </Text>
      )}
      <Button>Submit New Issue</Button>
    </form>
  );
}

export default NewIssuePage;
