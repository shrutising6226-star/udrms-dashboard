import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.disasterAnalysis.deleteMany();
  await prisma.fundDisbursement.deleteMany();
  await prisma.activityRegistry.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding UDRMS agencies...');
  const agencyNDMA = await prisma.agency.create({
    data: { name: 'National Disaster Management Authority', type: 'GOVT' }
  });
  
  const agencyRedCross = await prisma.agency.create({
    data: { name: 'Red Cross Relief', type: 'NGO' }
  });

  const agencyWaterAid = await prisma.agency.create({
    data: { name: 'WaterAid Global', type: 'NGO' }
  });

  console.log('Seeding UDRMS users...');
  const pass = await bcrypt.hash('password123', 10);
  
  await prisma.user.create({
    data: {
      name: 'Nodal Officer',
      email: 'admin@udrms.gov',
      passwordHash: pass,
      role: 'NODAL_AUTHORITY',
      agencyName: agencyNDMA.name,
    }
  });

  console.log('Seeding Activity Registry...');
  // Red Cross is building a medical camp
  const activity1 = await prisma.activityRegistry.create({
    data: {
      agencyId: agencyRedCross.id,
      title: 'Emergency Medical Camp - Sector 4',
      activityType: 'MEDICAL',
      description: 'Deploying 5 doctors and basic meds.',
      zone: 'Coastal Sector 4',
      latitude: 19.0760,
      longitude: 72.8777,
      budget: 50000,
      beneficiaries: 1200,
      startDate: new Date(),
      status: 'ONGOING'
    }
  });

  // WaterAid is also trying to build a medical camp nearby (creating an overlap/duplication!)
  const activity2 = await prisma.activityRegistry.create({
    data: {
      agencyId: agencyWaterAid.id,
      title: 'Water & Health Checkups - Sector 4',
      activityType: 'MEDICAL',
      description: 'Providing clean water and health screening.',
      zone: 'Coastal Sector 4',
      latitude: 19.0765, // Very close!
      longitude: 72.8780,
      budget: 35000,
      beneficiaries: 800,
      startDate: new Date(),
      status: 'PLANNED',
      isDuplicated: true,
      duplicateNotes: 'Flagged: Red Cross Relief is already conducting MEDICAL activities in this 5km radius.'
    }
  });

  console.log('Seeding Geo-tagged Funds...');
  await prisma.fundDisbursement.create({
    data: {
      activityId: activity1.id,
      agencyId: agencyNDMA.id,
      amount: 25000,
      disbursedDate: new Date(),
      status: 'COMPLETED',
      purpose: 'Initial setup grant',
      latitude: 19.0760,
      longitude: 72.8777
    }
  });

  console.log('UDRMS DB Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
