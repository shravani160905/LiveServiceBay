import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

// FETCH USERS FROM SUPABASE
export async function GET() {
  try {
    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read database personnel." }, { status: 500 });
  }
}

// INSERT NEW STAFF INTO SUPABASE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate an incremental custom ID string
    const count = await prisma.user.count();
    const nextEmpId = `EMP-${201 + count}`;

    const newUser = await prisma.user.create({
      data: {
        id: nextEmpId,
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        role: body.role
      }
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Staff Save Error:", error);
    return NextResponse.json({ error: "Failed to write user to cloud." }, { status: 500 });
  }
}