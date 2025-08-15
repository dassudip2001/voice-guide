import { IWriteCategory } from "@/schema/categorySchema";
import mongoose, { models, Schema } from "mongoose";

const CategorySchema = new mongoose.Schema<IWriteCategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Category =
  models?.Category ||
  mongoose.model<IWriteCategory>("Category", CategorySchema);
export default Category;
