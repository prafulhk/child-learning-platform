import { connectDatabase } from "../config/database.js";
import { UserModel } from "../modules/auth/models/user.model.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: pnpm --dir apps/api admin:promote <email>");
  process.exit(1);
}

async function promoteAdmin(): Promise<void> {
  await connectDatabase();

  const user = await UserModel.findOneAndUpdate(
    { email },
    { $set: { role: "ADMIN" } },
    { new: true },
  );

  if (!user) {
    console.error(`No user found for ${email}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Admin role assigned to ${user.email}`);
}

promoteAdmin()
  .catch((error) => {
    console.error("Failed to promote user to admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    process.exit();
  });
