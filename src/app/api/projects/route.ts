import { NextRequest, NextResponse } from "next/server";
import { createProject } from "@/core/project/project.service";
import { getProjects } from "@/core/project/project.store";

export async function GET() {
  return NextResponse.json(getProjects());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const project = createProject({
    name: body.name,
    domain: body.domain,
    repository: body.repository,
    mainKeyword: body.mainKeyword,
    industry: body.industry,
  });

  return NextResponse.json(project);
}