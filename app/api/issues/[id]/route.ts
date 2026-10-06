import { issueSchema } from "@/app/ValidationSchemas";
import { auth } from "@/app/auth/authOptions";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue id" }, { status: 400 });
  }

  const body = await request.json();
  const validation = issueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 });
  }

  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: { title: body.title, description: body.description },
  });
  return NextResponse.json(updatedIssue);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const issueId = parseInt(id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid issue id" }, { status: 400 });
  }

  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  await prisma.issue.delete({
    where: { id: issueId },
  });
  return NextResponse.json({});
}
