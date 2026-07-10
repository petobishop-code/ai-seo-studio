import { NextRequest, NextResponse } from "next/server";
import { getReviewHtml } from "@/features/review-engine/review.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const siteName = request.nextUrl.searchParams.get("siteName");

  if (!siteName) {
    return new NextResponse(
      "<!doctype html><html><body><p>사이트를 선택해주세요.</p></body></html>",
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const html = await getReviewHtml(siteName);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new NextResponse(
      "<!doctype html><html><body><p>AI 수정 미리보기를 먼저 생성해주세요.</p></body></html>",
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
