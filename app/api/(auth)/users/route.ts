import connect from "@/lib/db";
import Users from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connect();
    const users = await Users.find();
    
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error while fetching users: " + error.message, { status: 500 });
  }
}
