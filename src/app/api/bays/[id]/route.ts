import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "bays.json");

const readBaysFile = () => {
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    return [];
  }
};

const writeBaysFile = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

// 🌟 STRICTLY A NAMED EXPORT - NO DEFAULT EXPORTS ALLOWED BY NEXT.JS HERE
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> | any }
) {
  try {
    const resolvedParams = await context.params;
    const targetBayId = resolvedParams.id;

    const currentBays = readBaysFile();
    const targetIndex = currentBays.findIndex((b: any) => b.id === targetBayId);

    if (targetIndex === -1) {
      return NextResponse.json({ error: "Station index not found." }, { status: 404 });
    }

    currentBays.splice(targetIndex, 1);
    writeBaysFile(currentBays);

    return NextResponse.json({ success: true, message: "Station completely scrubbed." });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error overwriting data file." }, { status: 500 });
  }
}