import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const { MONGODB_URL } = process.env;

        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }

        mongoose.connection.on("connected", () => {
            console.log("Database is connected");
        });

        await mongoose.connect(MONGODB_URL);

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("DB Connection Error:", error.message);
        } else {
            console.error("Unknown DB Connection Error");
        }
        process.exit(1); // optional: stop app if DB fails
    }
};

export default connectDB;