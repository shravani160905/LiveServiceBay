import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

export async function PUT(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const targetJobId = params.id;
    const body = await request.json();

    const existingRecord = await prisma.job.findUnique({
      where: { id: targetJobId },
    });

    if (!existingRecord) {
      return NextResponse.json({ error: "Job card not found." }, { status: 404 });
    }

    // Determine the exact status mapping
    let computedStatus = body.status || existingRecord.status;
    if (body.bay && body.bay !== "Unassigned" && computedStatus === "Awaiting Inspection") {
      computedStatus = "In Progress";
    }

    const updatedJob = await prisma.job.update({
      where: { id: targetJobId },
      data: {
        status: computedStatus,
        assignedBay: body.bay !== undefined ? body.bay : existingRecord.assignedBay,
        assignedTech: body.technician !== undefined ? body.technician : existingRecord.assignedTech,
        completedAt: computedStatus === "Completed" ? new Date() : existingRecord.completedAt
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        ...updatedJob,
        bay: updatedJob.assignedBay,
        technician: updatedJob.assignedTech
      } 
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}