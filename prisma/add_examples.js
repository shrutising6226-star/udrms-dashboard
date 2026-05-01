import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching agencies...');
  const who = await prisma.agency.findFirst({ where: { name: 'World Health Organization' } });
  const dwb = await prisma.agency.findFirst({ where: { name: 'Doctors Without Borders' } });
  const ndma = await prisma.agency.findFirst({ where: { name: 'National Disaster Management Authority' } });

  if (!who || !dwb || !ndma) {
      console.log('Agencies not found! Please run the main seed file first.');
      return;
  }

  console.log('Adding 3 more Activity Registry examples...');

  await prisma.activityRegistry.create({
    data: {
      agencyId: who.id,
      title: 'Epidemic Prevention Drive',
      activityType: 'MEDICAL',
      description: 'Vaccinating 5000 people against Cholera and Typhoid.',
      zone: 'North District',
      latitude: 19.16, 
      longitude: 72.86,
      budget: 150000, 
      beneficiaries: 5000,
      startDate: new Date(),
      status: 'ONGOING',
      completionPct: 30,
      supplyStage: 'DISTRIBUTED'
    }
  });

  await prisma.activityRegistry.create({
    data: {
      agencyId: dwb.id,
      title: 'Mobile Surgical Unit',
      activityType: 'MEDICAL',
      description: 'Providing trauma care for severe injuries.',
      zone: 'Coastal Sector 4',
      latitude: 19.07, 
      longitude: 72.88,
      budget: 300000, 
      beneficiaries: 500,
      startDate: new Date(),
      status: 'ONGOING',
      completionPct: 80,
      supplyStage: 'DISTRIBUTED'
    }
  });

  await prisma.activityRegistry.create({
    data: {
      agencyId: ndma.id,
      title: 'Power Grid Restoration',
      activityType: 'INFRASTRUCTURE',
      description: 'Restoring main power lines to the district hospital.',
      zone: 'North District',
      latitude: 19.14, 
      longitude: 72.87,
      budget: 800000, 
      beneficiaries: 20000,
      startDate: new Date(),
      status: 'PLANNED',
      completionPct: 0,
      supplyStage: 'PROCURED'
    }
  });

  console.log('Successfully added more examples to your database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
