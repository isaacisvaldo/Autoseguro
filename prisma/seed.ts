
import { PrismaClient } from '@prisma/client';
import { accessLevels } from './seeds/accessLevels';

const prisma = new PrismaClient();
async function main() {

  await prisma.accessLevel.deleteMany(); 
  await prisma.accessLevel.deleteMany(); 
  await prisma.accessLevel.createMany({ data: accessLevels })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
