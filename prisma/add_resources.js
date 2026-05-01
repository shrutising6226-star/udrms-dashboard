import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching agencies...');
  const redCross = await prisma.agency.findFirst({ where: { name: 'Red Cross Relief' } });
  const waterAid = await prisma.agency.findFirst({ where: { name: 'WaterAid Global' } });
  const unicef = await prisma.agency.findFirst({ where: { name: 'UNICEF' } });
  const ndma = await prisma.agency.findFirst({ where: { name: 'National Disaster Management Authority' } });
  const who = await prisma.agency.findFirst({ where: { name: 'World Health Organization' } });

  if (!redCross || !waterAid || !unicef) {
      console.log('Agencies not found! Please run the main seed file first.');
      return;
  }

  console.log('Adding Active Ground Needs (Requests)...');
  await prisma.resourceNeed.create({
    data: {
      agencyId: redCross.id,
      resourceName: 'O-Negative Blood Bags',
      category: 'MEDICAL',
      quantity: 50,
      unit: 'bags',
      location: 'Central Hospital Sector 1',
      urgency: 'CRITICAL'
    }
  });

  await prisma.resourceNeed.create({
    data: {
      agencyId: waterAid.id,
      resourceName: 'Water Purification Tablets',
      category: 'WATER',
      quantity: 10000,
      unit: 'tablets',
      location: 'Inland Sector 2',
      urgency: 'HIGH'
    }
  });

  await prisma.resourceNeed.create({
    data: {
      agencyId: ndma.id,
      resourceName: 'Heavy Duty Tarpaulins',
      category: 'SHELTER',
      quantity: 500,
      unit: 'rolls',
      location: 'Coastal Sector 4',
      urgency: 'MEDIUM'
    }
  });

  console.log('Adding Available Inventory (Supplies)...');
  await prisma.resourceInventory.create({
    data: {
      agencyId: who.id,
      resourceName: 'Cholera Vaccines',
      category: 'MEDICAL',
      quantity: 5000,
      unit: 'vials',
      location: 'WHO Regional Hub'
    }
  });

  await prisma.resourceInventory.create({
    data: {
      agencyId: unicef.id,
      resourceName: 'High-Energy Biscuits',
      category: 'FOOD',
      quantity: 2000,
      unit: 'cartons',
      location: 'North District Warehouse'
    }
  });

  await prisma.resourceInventory.create({
    data: {
      agencyId: redCross.id,
      resourceName: 'First Aid Kits',
      category: 'MEDICAL',
      quantity: 300,
      unit: 'kits',
      location: 'Coastal Sector 4'
    }
  });

  console.log('Successfully added more Resource Marketplace examples!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
