import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.workStatuses.upsert({
    where: {
      pk: 1,
    },
    create: {
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      isSellEnabled: true,
      isMaintenance: false,
      isSteamProblems: false,
      isFuckup: false,
      isQiwiEnabled: true,
      isTinkoffEnabled: true,
    },
    update: {
      isDepositEnabled: true,
      isWithdrawalEnabled: true,
      isSellEnabled: true,
      isMaintenance: false,
      isSteamProblems: false,
      isFuckup: false,
      isQiwiEnabled: true,
      isTinkoffEnabled: true,
    },
  });
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
