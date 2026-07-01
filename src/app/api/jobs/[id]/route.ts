import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";

// ──────────────────────────────────────────────────────────────
// 1. GET HANDLER — Polling Loop Tracker
// ──────────────────────────────────────────────────────────────
export async function GET(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const targetJobId = params.id;

    const jobRecord = await prisma.job.findUnique({
      where: { id: targetJobId },
      select: {
        id: true,
        status: true,
        vehicleNumber: true,
        ocrWarning: true, 
      },
    });

    if (!jobRecord) {
      return NextResponse.json({ error: "Job card not found." }, { status: 404 });
    }

    return NextResponse.json(jobRecord);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ──────────────────────────────────────────────────────────────
// 2. PUT HANDLER — Saves Allocations AND Vehicle Field Edits!
// ──────────────────────────────────────────────────────────────
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

    // Update the record inside your Supabase PostgreSQL instance
    const updatedJob = await prisma.job.update({
      where: { id: targetJobId },
      data: {
        // 💡 FIXED: Include the incoming vehicle intake form inputs!
        customerName: body.customerName !== undefined ? body.customerName : existingRecord.customerName,
        phoneNumber: body.phoneNumber !== undefined ? body.phoneNumber : existingRecord.phoneNumber,
        customerEmail: body.customerEmail !== undefined ? body.customerEmail : existingRecord.customerEmail,
        vehicleNumber: body.vehicleNumber !== undefined ? body.vehicleNumber : existingRecord.vehicleNumber,
        brandModel: body.brandModel !== undefined ? body.brandModel : existingRecord.brandModel,
        manufactureYear: body.manufactureYear !== undefined ? body.manufactureYear : existingRecord.manufactureYear,
        
        // Workshop Allocation States
        status: computedStatus,
        assignedBay: body.bay !== undefined ? body.bay : existingRecord.assignedBay,
        assignedTech: body.technician !== undefined ? body.technician : existingRecord.assignedTech,
        completedAt: computedStatus === "Completed" ? new Date() : existingRecord.completedAt,
        startedAt: computedStatus === "In Progress" && !existingRecord.startedAt ? new Date() : existingRecord.startedAt,
        ocrWarning: body.ocrWarning !== undefined ? body.ocrWarning : existingRecord.ocrWarning
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

// ──────────────────────────────────────────────────────────────
// 3. DELETE HANDLER
// ──────────────────────────────────────────────────────────────
export async function DELETE(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}