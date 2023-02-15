-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDepositDisabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSellDisabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWithdrawDisabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Ban" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "amnestyDate" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkStatuses" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDepositDisabled" BOOLEAN NOT NULL DEFAULT false,
    "isWithdrawDisabled" BOOLEAN NOT NULL DEFAULT false,
    "isSellDisabled" BOOLEAN NOT NULL DEFAULT false,
    "isMaintenance" BOOLEAN NOT NULL DEFAULT false,
    "isSteamProblems" BOOLEAN NOT NULL DEFAULT false,
    "isFuckup" BOOLEAN NOT NULL DEFAULT false,
    "isQiwiDisabled" BOOLEAN NOT NULL DEFAULT false,
    "isTinkoffDisabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkStatuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ban" ADD CONSTRAINT "Ban_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
