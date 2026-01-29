import { prisma } from "./prisma";
import { config } from "./config";
import { hash_password } from "./utils/password";

async function main() {
  const email = config.seed_admin_email;
  const password = config.seed_admin_password;

  const exists = await prisma.admin.findUnique({ where: { email } });
  if (exists) {
    console.log("Admin already exists:", email);
    return;
  }

  const password_hash = await hash_password(password);
  await prisma.admin.create({ data: { email, password_hash } });
  console.log("Seeded admin:", email, "password:", password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
