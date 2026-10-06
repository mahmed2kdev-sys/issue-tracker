import { NextRequest , NextResponse} from "next/server";
import {prisma} from "@/prisma/client";
import { issueSchema } from "../../ValidationSchemas";
import { auth } from "@/app/auth/authOptions";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = issueSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json({ error: validation.error.message}, { status: 400 });
    }

    const newIssue = await prisma.issue.create({
        data: {title: body.title, description: body.description }
    });
    return NextResponse.json(newIssue, {status: 201})

}