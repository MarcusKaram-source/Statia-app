import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin';
  const userPassword = process.env.DEFAULT_USER_PASSWORD || 'password';

  if (adminPassword === 'admin' || userPassword === 'password') {
    console.warn('[WARN] Seeding with default weak passwords. Set DEFAULT_ADMIN_PASSWORD and DEFAULT_USER_PASSWORD in .env before running in production.');
  }

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  await prisma.user.upsert({
    where: { email: 'admin@statia.com' },
    update: { password: adminHash, role: 'ADMIN', failedAttempts: 0, lockUntil: null },
    create: { name: 'Admin', email: 'admin@statia.com', password: adminHash, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'user@statia.com' },
    update: { password: userHash },
    create: { name: 'Demo User', email: 'user@statia.com', password: userHash, role: 'USER' },
  });

  const count = await prisma.project.count();
  if (count === 0) {
    await prisma.project.createMany({
      data: [
        { name: "Azure Crown Residences", nameAr: "أبراج العزيز الملكية", location: "New Cairo, Egypt", locationAr: "القاهرة الجديدة", type: "Apartment", status: "Under Construction", priceEGP: 4500000, priceSAR: 285000, priceAED: 360000, rooms: 3, baths: 2, area: 180, badge: "New Launch", rating: 4.9, description: "Iconic tower offering premium living with panoramic city views and world-class amenities.", amenities: ["Pool", "Gym", "Concierge", "Parking"], img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80" },
        { name: "The Monarch Villas", nameAr: "فيلات الملك", location: "Sheikh Zayed, Egypt", locationAr: "الشيخ زايد", type: "Villa", status: "Ready to Move", priceEGP: 18000000, priceSAR: 1140000, priceAED: 1440000, rooms: 5, baths: 4, area: 540, badge: "Exclusive", rating: 5.0, description: "Regal private villas set within manicured gardens. The pinnacle of suburban luxury.", amenities: ["Private Pool", "Smart Home", "Garden", "Security"], img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=700&q=80" },
        { name: "Riviera Grand", nameAr: "ريفيرا جراند", location: "North Coast, Egypt", locationAr: "الساحل الشمالي", type: "Chalet", status: "Under Construction", priceEGP: 6200000, priceSAR: 393000, priceAED: 496000, rooms: 2, baths: 2, area: 120, badge: "Sea View", rating: 4.8, description: "Mediterranean-inspired chalets with direct beach access and resort-style facilities.", amenities: ["Beach Access", "Pool", "Restaurant", "Marina"], img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=700&q=80" },
        { name: "Capital Heights", nameAr: "العاصمة هايتس", location: "New Capital, Egypt", locationAr: "العاصمة الإدارية", type: "Penthouse", status: "Ready to Move", priceEGP: 12000000, priceSAR: 760000, priceAED: 960000, rooms: 4, baths: 3, area: 320, badge: "Prime Location", rating: 4.7, description: "Sky-high penthouses in Egypt's future capital.", amenities: ["Rooftop Terrace", "Concierge", "Smart Home", "Gym"], img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80" },
        { name: "Saffron Towers", nameAr: "أبراج الزعفران", location: "Heliopolis, Egypt", locationAr: "مصر الجديدة", type: "Apartment", status: "Under Construction", priceEGP: 3200000, priceSAR: 202000, priceAED: 256000, rooms: 2, baths: 1, area: 110, badge: "Hot Deal", rating: 4.6, description: "Contemporary urban living in the heart of historic Heliopolis.", amenities: ["Gym", "Co-working", "Café", "Parking"], img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=700&q=80" },
        { name: "Palm Serenity Estate", nameAr: "إستيت النخيل", location: "October City, Egypt", locationAr: "مدينة أكتوبر", type: "Villa", status: "Ready to Move", priceEGP: 9500000, priceSAR: 602000, priceAED: 760000, rooms: 4, baths: 3, area: 380, badge: "Garden Villa", rating: 4.8, description: "Serene villa community surrounded by lush greenery.", amenities: ["Private Garden", "Pool", "Club House", "Security"], img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=700&q=80" },
      ],
    });
    console.log('Seeded 6 properties.');
  } else {
    console.log(`Skipped property seed — ${count} already exist.`);
  }

  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
