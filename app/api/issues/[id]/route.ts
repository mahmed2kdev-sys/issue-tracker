import { patchIssueSchema } from "@/app/ValidationSchemas";
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
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 });
  }

  const existing = await prisma.issue.findUnique({
    where: { id: issueId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  if ("assignedToUserId" in validation.data && validation.data.assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: validation.data.assignedToUserId },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      ...(validation.data.title !== undefined && {
        title: validation.data.title,
      }),
      ...(validation.data.description !== undefined && {
        description: validation.data.description,
      }),
      ...("assignedToUserId" in validation.data && {
        assignedToUserId: validation.data.assignedToUserId,
      }),
    },
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
