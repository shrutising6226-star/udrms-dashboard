import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.disasterAnalysis.deleteMany();
  await prisma.resourceNeed.deleteMany();
  await prisma.resourceInventory.deleteMany();
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

  const agencyUNICEF = await prisma.agency.create({
    data: { name: 'UNICEF', type: 'NGO' }
  });

  const agencyWHO = await prisma.agency.create({
    data: { name: 'World Health Organization', type: 'NGO' }
  });

  const agencyFEMA = await prisma.agency.create({
    data: { name: 'Federal Emergency Management Agency', type: 'GOVT' }
  });

  const agencyDoctorsWithoutBorders = await prisma.agency.create({
    data: { name: 'Doctors Without Borders', type: 'NGO' }
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
      status: 'ONGOING',
      completionPct: 60,
      supplyStage: 'IN_TRANSIT'
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

  const activity3 = await prisma.activityRegistry.create({
    data: {
      agencyId: agencyUNICEF.id,
      title: 'Child Nutrition Program',
      activityType: 'FOOD',
      description: 'Distribution of high-protein biscuits and milk powder.',
      zone: 'Inland Sector 2',
      latitude: 19.1000,
      longitude: 72.9000,
      budget: 120000,
      beneficiaries: 5000,
      startDate: new Date(),
      status: 'ONGOING'
    }
  });

  const activity4 = await prisma.activityRegistry.create({
    data: {
      agencyId: agencyFEMA.id,
      title: 'Temporary Housing Setup',
      activityType: 'SHELTER',
      description: 'Erecting 500 temporary tents for displaced families.',
      zone: 'North District',
      latitude: 19.1500,
      longitude: 72.8500,
      budget: 250000,
      beneficiaries: 2000,
      startDate: new Date(),
      status: 'ONGOING'
    }
  });

  const activity5 = await prisma.activityRegistry.create({
    data: {
      agencyId: agencyNDMA.id,
      title: 'Road Clearance and Repair',
      activityType: 'INFRASTRUCTURE',
      description: 'Clearing debris from the main highway connecting Sector 4.',
      zone: 'Coastal Sector 4',
      latitude: 19.0800,
      longitude: 72.8800,
      budget: 450000,
      beneficiaries: 10000,
      startDate: new Date(),
      status: 'PLANNED'
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

  console.log('Seeding Disaster Analysis Lessons Learned...');
  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'FLOOD',
      region: 'Coastal Sector 4',
      dateOccurred: new Date('2023-08-15'),
      whatWorked: 'Pre-positioning of medical supplies in high ground areas prevented spoilage and allowed rapid deployment.',
      whatFailed: 'Communication networks went down, delaying coordination between NGOs by 48 hours.',
      populationsMissed: 'Elderly residents in low-lying informal settlements.',
      tags: 'MEDICAL,FLOOD,LOGISTICS'
    }
  });

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'CYCLONE',
      region: 'Eastern Seaboard',
      dateOccurred: new Date('2022-11-10'),
      whatWorked: 'Early warning systems via SMS successfully evacuated 80% of the coastal zone.',
      whatFailed: 'Medical camps were set up too close to the shoreline and had to be relocated due to storm surges.',
      populationsMissed: 'Migrant workers not registered in local databases.',
      tags: 'MEDICAL,CYCLONE,EVACUATION'
    }
  });

  console.log('Seeding Resource Marketplace...');
  await prisma.resourceInventory.create({
    data: {
      agencyId: agencyWHO.id,
      resourceName: 'Vaccines (Cholera/Typhoid)',
      category: 'MEDICAL',
      quantity: 2000,
      unit: 'vials',
      location: 'Central Hub'
    }
  });

  await prisma.resourceInventory.create({
    data: {
      agencyId: agencyRedCross.id,
      resourceName: 'Thermal Blankets',
      category: 'SHELTER',
      quantity: 500,
      unit: 'pieces',
      location: 'Coastal Sector 4'
    }
  });

  await prisma.resourceNeed.create({
    data: {
      agencyId: agencyNDMA.id,
      resourceName: 'Thermal Blankets',
      category: 'SHELTER',
      quantity: 200,
      unit: 'pieces',
      location: 'Coastal Sector 4',
      urgency: 'HIGH'
    }
  });

  await prisma.resourceNeed.create({
    data: {
      agencyId: agencyWaterAid.id,
      resourceName: 'Water Purification Tablets',
      category: 'WATER',
      quantity: 10000,
      unit: 'tablets',
      location: 'Inland Sector 2',
      urgency: 'CRITICAL'
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
