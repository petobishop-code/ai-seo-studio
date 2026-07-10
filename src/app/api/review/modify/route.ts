import { NextRequest, NextResponse } from "next/server";
import { createReviewRevision } from "@/features/review-engine/review.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const siteName = String(body.siteName || "").trim();
    const instruction = String(body.instruction || "").trim();

    if (!siteName || !instruction) {
      return NextResponse.json(
        { error: "사이트명과 수정 요청이 필요합니다." },
        { status: 400 }
      );
    }

    const result = await createReviewRevision(siteName, instruction);

    return NextResponse.json({
      siteName: result.siteName,
      previewUrl: `/api/review/preview?siteName=${encodeURIComponent(result.siteName)}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI 수정에 실패했습니다." },
      { status: 500 }
    );
  }
}
