import connect from "@/lib/db";
import Users from "@/lib/models/user";
import categories from "@/lib/models/category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const body = await request.json();
    const { title } = body;

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "💢 Invalid category ID" },
        { status: 500 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "💢 Invalid user ID" },
        { status: 500 }
      );
    }

    await connect();

    const Categeory = await categories.findOneAndUpdate(
      { _id: categoryId, user: userId },
      { title: title },
      { new: true }
    );

    if (!Categeory) {
      return NextResponse.json(
        { error: "💢 Category not found or does not belong to user!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "✅ Successfully updated category", Categeory },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "💢 Error while updating category\n" + error.message },
      { status: 400 }
    );
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "💢 Invalid category ID" },
        { status: 500 }
      );
    }

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "💢 Invalid user ID" },
        { status: 500 }
      );
    }

    await connect();

    const Category = await categories.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!Category) {
      return NextResponse.json(
        { error: "💢 Category not found or does not belong to user!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "✅ Successfully deleted category",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "💢 Error while deleting category\n" + error.message },
      { status: 400 }
    );
  }
};
