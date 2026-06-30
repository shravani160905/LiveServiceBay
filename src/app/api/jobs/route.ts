import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";

export async function GET() {
  try {
    const activeJobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedJobs = activeJobs.map(job => ({
      ...job,
      bay: job.assignedBay,
      technician: job.assignedTech
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to fetch cloud database logs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const lastJob = await prisma.job.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });

    let nextJobId = "JOB-101";
    if (lastJob && lastJob.id.startsWith("JOB-")) {
      const lastNum = parseInt(lastJob.id.split("-")[1], 10);
      nextJobId = `JOB-${lastNum + 1}`;
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
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to write record to Supabase." }, { status: 500 });
  }
}