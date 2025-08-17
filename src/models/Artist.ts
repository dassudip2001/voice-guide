import { IArtistWriteFormSchema } from "@/schema/ArtistSchema";
import mongoose, { models,Schema } from "mongoose";

const ArtistSchema = new mongoose.Schema<IArtistWriteFormSchema>(
  {
    name: { type: String, required: true },
    bio: { type: String, required: false },
    profileImageUrl: { type: String, required: false },
    socialLinks: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Artist = models?.Artist || mongoose.model<IArtistWriteFormSchema>("Artist", ArtistSchema);
export default Artist;