import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const workStatuses = await prisma.workStatuses.upsert({
    where: {
      pk: 1,
    },
    create: {
      isDepositDisabled: false,
      isWithdrawalDisabled: false,
      isSellDisabled: false,
      isMaintenance: false,
      isSteamProblems: false,
      isFuckup: false,
      isQiwiDisabled: false,
      isTinkoffDisabled: false,
    },
    update: {
      isDepositDisabled: false,
      isWithdrawalDisabled: false,
      isSellDisabled: false,
      isMaintenance: false,
      isSteamProblems: false,
      isFuckup: false,
      isQiwiDisabled: false,
      isTinkoffDisabled: false,
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
