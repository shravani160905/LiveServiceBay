import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

// 🌐 1. FETCH ALL VEHICLE RECORDS FROM SUPABASE
export async function GET() {
  try {
    const activeJobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Directly maps our new flat database fields to the keys your frontend expects
    const formattedJobs = activeJobs.map(job => ({
      ...job,
      bay: job.assignedBay,
      technician: job.assignedTech
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cloud database logs." }, { status: 500 });
  }
}

// 🚗 2. INSERT A NEW VEHICLE CHECK-IN RECORD
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate an incremental-style custom ID prefix for your presentation dashboard
    // 🎯 SMART ID GENERATOR: Scans for the highest active serial to prevent overlaps
    const lastJob = await prisma.job.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });

    let nextJobId = "JOB-101";
    if (lastJob && lastJob.id.startsWith("JOB-")) {
      const lastNum = parseInt(lastJob.id.split("-")[1], 10);
      nextJobId = `JOB-${lastNum + 1}`; // Safely increments to JOB-104!
    }

    const newJob = await prisma.job.create({
      data: {
        id: nextJobId,
        customerName: body.customerName,
        phoneNumber: body.phoneNumber,
        customerEmail: body.customerEmail,
        vehicleNumber: body.vehicleNumber.trim().toUpperCase(),
        brandModel: body.brandModel,
        manufactureYear: body.manufactureYear || "2022",
        status: "Awaiting Inspection",
        color: "#94a3b8"
      }
    });

    return NextResponse.json({ success: true, data: newJob });
  } catch (error) {
    console.error("DB Insert Error:", error);
    return NextResponse.json({ error: "Failed to write record to Supabase." }, { status: 500 });
  }
}