import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '../.env') });

async function resetAdminPassword() {
  const email = process.env.ADMIN_EMAIL || 'admin@statia.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN', failedAttempts: 0, lockUntil: null },
    create: { name: process.env.ADMIN_NAME || 'Admin', email, password: hashedPassword, role: 'ADMIN' },
  });

  console.log('Admin password reset successfully:', { id: user.id, email: user.email, role: user.role });
  await prisma.$disconnect();
}

resetAdminPassword().catch(e => { console.error(e); process.exit(1); });
