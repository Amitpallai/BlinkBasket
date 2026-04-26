import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const { MONGODB_URL } = process.env;

        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        mongoose.connection.on("connected", () => {
            console.log("✓ Database is connected");
        });

        mongoose.connection.on("error", (error) => {
            console.error("✗ Database connection error:", error);
        });

        await mongoose.connect(MONGODB_URL);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("✗ DB Connection Error:", error.message);
        } else {
            console.error("✗ Unknown DB Connection Error");
        }
        // Don't exit process - serverless functions need to stay alive
        // The connection will retry on next request
    }
};

export default connectDB;