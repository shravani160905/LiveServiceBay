import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "users.json");

const readUsersFile = () => {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const writeUsersFile = (data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

// ⚙️ PUT: Edit staff profile parameters
export async function PUT(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const targetEmpId = params.id;
    const { name, role, email } = await request.json();

    const currentUsers = readUsersFile();
    const targetIndex = currentUsers.findIndex((u: any) => u.id === targetEmpId);

    if (targetIndex === -1) {
      return NextResponse.json({ error: "Employee profile not found." }, { status: 404 });
    }

    if (name !== undefined) currentUsers[targetIndex].name = name;
    if (role !== undefined) currentUsers[targetIndex].role = role;
    if (email !== undefined) currentUsers[targetIndex].email = email;

    writeUsersFile(currentUsers);
    return NextResponse.json({ success: true, data: currentUsers[targetIndex] });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error updating employee." }, { status: 500 });
  }
}

// ❌ DELETE: Remove a staff member completely from data records
export async function DELETE(request: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const targetEmpId = params.id;

    const currentUsers = readUsersFile();
    const filteredUsers = currentUsers.filter((u: any) => u.id !== targetEmpId);

    if (currentUsers.length === filteredUsers.length) {
      return NextResponse.json({ error: "Employee profile not found." }, { status: 404 });
    }

    writeUsersFile(filteredUsers);
    return NextResponse.json({ success: true, message: "Profile scrubbed from master index." });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error deleting employee." }, { status: 500 });
  }
}