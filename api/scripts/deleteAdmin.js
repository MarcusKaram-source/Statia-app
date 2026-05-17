import prisma from '../lib/prisma.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.join(__dirname, '../.env') });

async function deleteAdmin() {
  try {
    const email = 'admin@statia.com';
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (!user) {
      console.log('No admin account found with email:', email);
      return;
    }
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Admin account deleted:', { id: user.id, email: user.email });
  } catch (error) {
    console.error('Error deleting admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAdmin();
