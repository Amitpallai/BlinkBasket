import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async (): Promise<void> => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
            api_key: process.env.CLOUDINARY_API_KEY as string,
            api_secret: process.env.CLOUDINARY_API_SECRET as string,
        });

        console.log("Cloudinary is connected");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error connecting to Cloudinary:", error.message);
        } else {
            console.error("Unknown error connecting to Cloudinary");
        }
        throw new Error("Cloudinary configuration failed");
    }
};

export default connectCloudinary;