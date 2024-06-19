import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
    const mongoConnection = mongoose.connection.readyState;

    if (mongoConnection === 1) {
        // * MongoDb is already connected.
        return;
    }

    if (mongoConnection === 2) {
        console.log("🔄 [MONGO]: Connecting...");
        return;
    }

    try {
        await mongoose.connect(MONGO_URI!);
        console.log("✅ [MONGO]: Connected!");
    } catch (error) {
        throw new Error("❌ [MONGO]: Failed to connect to MongoDB\n" + error);
    }
};

export default connect;