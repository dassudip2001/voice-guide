import z from "zod";
import mongoose from "mongoose";
export const CategoryWriteFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  // mongoose will handle userId as an ObjectId, so we can use string here
  userId: z.union([
    z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid institution ObjectId",
    }),
    z.instanceof(mongoose.Types.ObjectId),
  ]),
});

export const CategoryReadFormSchema = CategoryWriteFormSchema.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IWriteCategory = z.infer<typeof CategoryWriteFormSchema>;
export type IReadCategory = z.infer<typeof CategoryReadFormSchema>;
