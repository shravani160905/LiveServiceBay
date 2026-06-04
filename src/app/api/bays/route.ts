import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

// FETCH BAYS FROM SUPABASE
export async function GET() {
  try {
    const allBays = await prisma.bay.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(allBays);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read database bays." }, { status: 500 });
  }
}

// INSERT NEW BAY INTO SUPABASE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const count = await prisma.bay.count();
    const nextBayId = `BAY-${501 + count}`;

    const newBay = await prisma.bay.create({
      data: {
        id: nextBayId,
        name: body.name.trim()
      }
    });
    return NextResponse.json(newBay);
  } catch (error) {
    console.error("Bay Save Error:", error);
    return NextResponse.json({ error: "Failed to write bay to cloud." }, { status: 500 });
  }
}