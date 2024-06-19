import connect from "@/lib/db";
import Users from "@/lib/models/user";
import {NextResponse} from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export async function GET() {
    try {
        await connect();
        const users = await Users.find();

        return NextResponse.json(users, {status: 200});
    } catch (error: any) {
        return NextResponse.json(
            {error: "💢 Error while fetching users: " + error.message},
            {
                status: 500,
            }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connect();
        const newUser = await new Users(body).save();

        return NextResponse.json(
            {
                user: newUser,
                message: "✅ User created successfully",
            },
            {status: 200}
        );
    } catch (error: any) {
        return NextResponse.json(
            {error: "💢 Error while creating user: " + error.message},
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const {userId, newUsername} = body;

        await connect();

        if (!userId || !newUsername) {
            return NextResponse.json(
                {error: "💢 Missing required fields"},
                {status: 400}
            );
        }

        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 400});
        }

        const user = await Users.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        );

        if (!user) {
            return NextResponse.json({error: "💢 User not found!"}, {status: 404})
        }

        return NextResponse.json(
            {message: "✅ Successfully updated user"},
            {status: 200}
        );
    } catch (error: any) {
        return NextResponse.json(
            {error: "💢 Error while updating user: " + error.message},
            {status: 500}
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                {error: "💢 userId is required!"},
                {status: 400}
            );
        }

        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 400});
        }

        await connect();

        const user = await Users.findOneAndDelete({_id: new ObjectId(userId)});
        if (!user) {
            return NextResponse.json({error: "💢 User not found!"}, {status: 404});
        }

        return NextResponse.json(
            {message: "✅ Successfully deleted user", user: user},
            {status: 200}
        );
    } catch (error: any) {
        return NextResponse.json(
            {error: "💢 Error while deleting user: " + error.message},
            {status: 500}
        );
    }
}
