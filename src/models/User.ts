import { IWriteUser, RoleEnum } from "@/schema/userSchema";
import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema<IWriteUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: RoleEnum,
      default: RoleEnum.user,
    },
  },
  {
    timestamps: true,
  }
);

const User = models?.User || mongoose.model<IWriteUser>("User", UserSchema);
export default User;