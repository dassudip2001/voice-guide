import { IWritePost, PostStatus } from "@/schema/postSchema";
import mongoose, { models,Schema } from "mongoose";

const PostSchema = new mongoose.Schema<IWritePost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: false },
    category: { type: String, required: true },
    status: { type: String, enum: PostStatus, default: PostStatus.draft },
    imageUrl: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

  },
  {
    timestamps: true,
  }
);

const Post = models?.Post || mongoose.model<IWritePost>("Post", PostSchema);
export default Post;
