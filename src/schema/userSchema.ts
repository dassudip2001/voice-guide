import { z } from "zod";


export enum RoleEnum {
  superadmin = "superadmin",
  admin = "admin",
  user = "user",
  editor = "editor",
  deleter = "deleter",
  creator="creator",
  viewer = "viewer",
}

export const UserWriteFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z
    .enum(RoleEnum, "Role must be either 'admin' or 'user'")
    .default(RoleEnum.user),
});

export const UserReadFormSchema = UserWriteFormSchema.extend({
  _id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IWriteUser = z.infer<typeof UserWriteFormSchema>;
export type IReadUser = z.infer<typeof UserReadFormSchema>;