import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Adding new Post-Disaster Analysis examples...');

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'EARTHQUAKE',
      region: 'Northern Highlands',
      dateOccurred: new Date('2024-02-10'),
      whatWorked: 'Rapid deployment of sniffer dogs and thermal imaging drones located survivors in the first 24 hours.',
      whatFailed: 'Heavy machinery could not reach remote mountain villages due to landslides blocking the main access roads.',
      populationsMissed: 'Isolated indigenous communities in the upper mountain ranges.',
      tags: 'RESCUE,EARTHQUAKE,INFRASTRUCTURE'
    }
  });

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'WILDFIRE',
      region: 'Western Valley',
      dateOccurred: new Date('2023-09-05'),
      whatWorked: 'Automated reverse 911 calls alerted residents to evacuate before the fire crossed the ridge.',
      whatFailed: 'Local water reservoirs were depleted too quickly, hampering aerial firefighting efforts.',
      populationsMissed: 'Farmers who refused to evacuate without their livestock.',
      tags: 'EVACUATION,WILDFIRE,WATER'
    }
  });

  await prisma.disasterAnalysis.create({
    data: {
      disasterType: 'TSUNAMI',
      region: 'Southern Peninsula',
      dateOccurred: new Date('2021-12-26'),
      whatWorked: 'Deep-ocean sensor buoys provided a crucial 45-minute warning window for coastal towns.',
      whatFailed: 'Evacuation shelters were not stocked with enough emergency medical supplies for trauma injuries.',
      populationsMissed: 'Tourists who did not understand the local language warning sirens.',
      tags: 'WARNING_SYSTEM,TSUNAMI,SHELTER'
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
