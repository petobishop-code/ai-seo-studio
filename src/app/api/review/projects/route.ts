import { NextResponse } from "next/server";
import { listReviewProjects } from "@/features/review-engine/review.service";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await listReviewProjects());
}
