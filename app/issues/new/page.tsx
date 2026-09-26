"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button, TextField } from "@radix-ui/themes";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function NewIssuePage() {
  const [description, setDescription] = useState("");

  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Title" />
      <MDEditor
        value={description}
        onChange={(v) => setDescription(v ?? "")}
        height={300}
      />
      <Button>Submit New Issue</Button>
    </div>
  );
}

export default NewIssuePage;
