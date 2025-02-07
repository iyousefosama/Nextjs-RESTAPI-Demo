// * Mongodb connect function
import connect from "@/lib/db";
// * Users model(Schema) for mongodb 
import Users from "@/lib/models/user";
import {NextResponse} from "next/server";

// * Mongoose ObjectId type for typescript
const ObjectId = require("mongoose").Types.ObjectId;

export async function GET() {
    try {
        await connect(); // Executes connect function
        const users = await Users.find(); // Get all data users

        return NextResponse.json(users, {status: 200}); // Send json response with all found users
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
        /**
         * User data should contain:
         * * String email
         * * String username
         * * String password
         */
        const body = await request.json(); // Get the request body in json format
        await connect(); // Executes connect function
        const newUser = await new Users(body).save(); // Creates a new db User with the body and saves it

        // Send a response with created user data and a success message
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
        const body = await request.json(); // Get request body as json
        const {userId, newUsername} = body; // Get userId & newUsername values from the json body

        await connect(); // Executes the connect function

        // If userID & newUsername not found in body return response error message
        if (!userId || !newUsername) {
            return NextResponse.json(
                {error: "💢 Missing required fields"},
                {status: 400}
            );
        }

        // Checks if userId is a valid mongodb ObjectId
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 400});
        }

        // Finds the user by id and updates it's username
        const user = await Users.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true} // returns the new data
        );

        // If the user were not found returns error message response
        if (!user) {
            return NextResponse.json({error: "💢 User not found!"}, {status: 404})
        }

        // If everything is fine return success response message
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
        const {searchParams} = new URL(request.url); // Get the searchParams from the request url
        const userId = searchParams.get("userId"); // Get the "userId" from searchParams

        // If user not found returns error message response
        if (!userId) {
            return NextResponse.json(
                {error: "💢 userId is required!"},
                {status: 400}
            );
        }

        // Check if userId is a valid ObjectId
        if (!ObjectId.isValid(userId)) {
            return NextResponse.json({error: "💢 Invalid user ID"}, {status: 400});
        }

        await connect(); // Executes connect function

        // Finds the user and deletes it
        const user = await Users.findOneAndDelete({_id: new ObjectId(userId)});
        
        // If user not found returns response error message
        if (!user) {
            return NextResponse.json({error: "💢 User not found!"}, {status: 404});
        }

        // success message
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
