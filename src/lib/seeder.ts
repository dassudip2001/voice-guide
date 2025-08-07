import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "./db";
import { RoleEnum } from "@/schema/userSchema";

async function seeder() {
  try {
    await connectToDatabase();
    const email = process.env.ADMIN_EMAIL || "admin@art.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const exestingUser = await User.findOne({ email });
    if (exestingUser) {
      console.log("Admin user already exists.");
      return process.exit(0);
    }

    const hasPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: "Super Admin",
      email,
      password: hasPassword,
      role: RoleEnum.superadmin,
    });
    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seeder();