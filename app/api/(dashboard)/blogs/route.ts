import connect from "@/lib/db";
import Users from "@/lib/models/user";
import categories from "@/lib/models/category";
import blogs from "@/lib/models/blog";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "💢 Invalid user ID" },
        { status: 500 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "💢 Invalid category ID" },
        { status: 500 }
      );
    }

    await connect();

    const user = await Users.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "💢 User not found" }, { status: 404 });
    }

    const category = await categories.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { error: "💢 Category not found" },
        { status: 404 }
      );
    }

    // TODO: Make a filter logic
    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    const blog = await blogs.find(filter);

    return NextResponse.json({ blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "💢 Error while fetching blogs\n" + error.message },
      { status: 400 }
    );
  }
};
