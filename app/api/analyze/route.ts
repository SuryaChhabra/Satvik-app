import { NextResponse } from "next/server";
import { analyzeQuestions } from "@/lib/ai/analyze";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  questions: { id: string; text: string; channel?: string; user_stage?: string }[];
  forceMock?: boolean;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body?.questions?.length) {
      return NextResponse.json({ error: "No questions provided." }, { status: 400 });
    }
    if (body.questions.length > 100) {
      return NextResponse.json({ error: "Please send fewer than 100 questions per run." }, { status: 400 });
    }
    const data = await analyzeQuestions({ questions: body.questions, forceMock: body.forceMock });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
  }
}
