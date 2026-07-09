import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const root = path.join(process.cwd(), "generated-sites");

  try {
    await fs.mkdir(root, { recursive: true });

    const dirs = await fs.readdir(root, {
      withFileTypes: true,
    });

    const sites = dirs
      .filter((d) => d.isDirectory())
      .map((d) => ({
        name: d.name,
      }));

    return NextResponse.json(sites);
  } catch {
    return NextResponse.json([]);
  }
}