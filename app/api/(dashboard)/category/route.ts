import connect from "@/lib/db";
import Users from "@/lib/models/user";
import categories from "@/lib/models/category";
import {NextResponse} from "next/server";
import {Types} from "mongoose";

export const GET = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 500})
        }

        await connect();

        const user = await Users.findById(userId);

        if (!user) {
            return NextResponse.json({error: "💢 User not found"}, {status: 404})
        }

        const category = await categories.find({user: new Types.ObjectId(userId)})

        return NextResponse.json({category}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: "💢 Error while fetching categories\n" + error.message}, {status: 400})
    }
}

export const POST = async (request: Request) => {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        const {title} = await request.json();

        if (!userId || !Types.ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 500})
        }

        await connect();

        const user = await Users.findById(userId);

        if (!user) {
            return NextResponse.json({error: "💢 User not found"}, {status: 404})
        }

        const category = await new categories({
            user: new Types.ObjectId(userId),
            title: title
        })

        await category.save();

        return NextResponse.json({ message: "✅ Created a new category for user", category }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({error: "💢 Error while posting category" + error.message}, {status: 400})
    }
}