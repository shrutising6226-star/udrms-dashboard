import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding new Post-Disaster Analysis examples (Food/Water focus)...');

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'DROUGHT',
      region: 'Central Plains',
      dateOccurred: new Date('2023-04-12'),
      whatWorked: 'Mobile food distribution kitchens reached 90% of rural villages, providing two hot meals a day.',
      whatFailed: 'Local crop failure caused sudden inflation; cash-handouts were useless because local markets had no food to sell.',
      populationsMissed: 'Nomadic herding communities who constantly moved looking for water.',
      tags: 'FOOD,WATER,DROUGHT'
    }
  });

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'FAMINE',
      region: 'Eastern Desert',
      dateOccurred: new Date('2022-08-20'),
      whatWorked: 'Airdropping high-energy nutrition biscuits saved thousands of severely malnourished children in inaccessible areas.',
      whatFailed: 'Initial food distribution points were set up too far apart, causing stampedes and unequal distribution of rations.',
      populationsMissed: 'Elderly citizens unable to travel long distances to the food drops.',
      tags: 'FOOD,FAMINE,LOGISTICS'
    }
  });

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'URBAN_CRISIS',
      region: 'Metro District',
      dateOccurred: new Date('2021-03-15'),
      whatWorked: 'Partnering with local restaurants and cloud kitchens to cook and distribute mass meals at temporary shelters.',
      whatFailed: 'Lack of clean drinking water led to outbreaks of waterborne diseases in the food and shelter camps.',
      populationsMissed: 'Unregistered migrant workers without access to government relief cards.',
      tags: 'SHELTER,FOOD,WATER'
    }
  });

  console.log('Successfully added more Disaster Analysis examples!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
