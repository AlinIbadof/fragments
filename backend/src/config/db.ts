import { connect } from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Error:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;
