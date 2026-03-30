import { NextRequest, NextResponse } from "next/server";
import { generateLessonDraft } from "@/lib/draft";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const draft = await generateLessonDraft(payload);
    return NextResponse.json(draft);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate lesson draft.",
      },
      { status: 400 },
    );
  }
}
