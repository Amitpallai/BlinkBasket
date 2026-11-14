import connectDB from "../configs/db";
import connectCloudinary from "../configs/cloudinary";

export const connectServices = async (): Promise<void> => {
  await connectDB();
  await connectCloudinary();
};
