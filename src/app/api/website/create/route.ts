import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { createWebsite } from "@/lib/website-template";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mainKeyword = String(body.mainKeyword || "").trim();

    if (!mainKeyword) {
      return NextResponse.json(
        { success: false, message: "대표키워드가 필요합니다." },
        { status: 400 }
      );
    }

    const website = createWebsite({ mainKeyword });
    const root = path.join(process.cwd(), "generated-sites", mainKeyword);

    await fs.mkdir(root, { recursive: true });
    await fs.mkdir(path.join(root, "images"), { recursive: true });

    for (const file of website.files) {
      await fs.writeFile(path.join(root, file.name), file.content, "utf-8");
    }

    return NextResponse.json({
      success: true,
      folder: root,
      files: website.files.map((file) => file.name),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "사이트 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}