import z from "zod";
import mongoose from "mongoose";
export enum PostStatus {
    draft = "draft",
    published = "published",
    deleted = "deleted",
}

export const PostWriteFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    status: z.enum(PostStatus, "Status must be either 'draft' or 'published'").default(PostStatus.draft),
    imageUrl: z.url("Valid image URL required").optional(),
   userId: z.union([
       z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
         message: "Invalid institution ObjectId",
       }),
       z.instanceof(mongoose.Types.ObjectId),
     ]),
});

export const PostReadFormSchema = PostWriteFormSchema.extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type IWritePost = z.infer<typeof PostWriteFormSchema>;
export type IReadPost = z.infer<typeof PostReadFormSchema>;
