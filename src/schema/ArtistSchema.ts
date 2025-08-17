import z from "zod";
import mongoose from "mongoose";

export const ArtistWriteFormSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Artist name is required"),
    bio: z.string().optional(),
    profileImageUrl: z.url().optional(),
    socialLinks: z.array(z.url()).optional(),
    userId: z.union([
      z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid institution ObjectId",
      }),
      z.instanceof(mongoose.Types.ObjectId),
    ])
  });

export const ArtistReadFormSchema = ArtistWriteFormSchema.extend({
    _id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type IArtistWriteFormSchema = z.infer<typeof ArtistWriteFormSchema>;
export type IArtistReadFormSchema = z.infer<typeof ArtistReadFormSchema>;


