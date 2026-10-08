"use client";

import { ErrorMessage, Spinner } from "@/app/components";
import { registerSchema } from "@/app/ValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Callout, Card, Flex, Heading, Text, TextField } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RegisterLoading from "./loading";

type RegisterFormData = z.infer<typeof registerSchema>;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const raw = searchParams.get("callbackUrl");
  const callbackUrl = raw?.startsWith("/") ? raw : "/";
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.status === 409) {
      setError("Email already registered.");
      return;
    }
    if (!res.ok) {
      try {
        const body = await res.json();
        let mapped = false;
        for (const field of ["name", "email", "password"] as const) {
          const msg = body?.[field]?._errors?.[0];
          if (msg) {
            setFieldError(field, { message: msg });
            mapped = true;
          }
        }
        if (!mapped) setError("Something went wrong. Please try again.");
      } catch {
        setError("Something went wrong. Please try again.");
      }
      return;
    }
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl,
      redirect: false,
    });
    if (result?.error) setError("Something went wrong. Please try again.");
    else {
      router.push(callbackUrl);
      router.refresh();
    }
  });

  return (
    <Flex justify="center">
      <Card className="w-full max-w-md p-6">
        <Heading mb="4">Register</Heading>
        {error && (
          <Box mb="3">
            <Callout.Root color="red">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          </Box>
        )}
        <form className="space-y-3" onSubmit={onSubmit}>
          <TextField.Root placeholder="Name" {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
          <TextField.Root placeholder="Email" type="email" {...register("email")} />
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
          <TextField.Root placeholder="Password" type="password" {...register("password")} />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
          <Button className="w-full" disabled={isSubmitting}>
            Register
            {isSubmitting && <Spinner />}
          </Button>
        </form>
        <Flex direction="column" gap="3" mt="4">
          <Button
            variant="soft"
            color="gray"
            className="w-full"
            disabled={isSubmitting}
            onClick={() => signIn("google", { callbackUrl })}
          >
            <GoogleIcon /> Sign up with Google
          </Button>
          <Text size="2">
            Already have an account? <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>Log in</Link>
          </Text>
        </Flex>
      </Card>
    </Flex>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterForm />
    </Suspense>
  );
}
