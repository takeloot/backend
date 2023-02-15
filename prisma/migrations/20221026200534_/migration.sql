/*
  Warnings:

  - You are about to drop the column `isDeativated` on the `SteamBot` table. All the data in the column will be lost.
  - You are about to drop the column `isDepositDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isSellDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isWithdrawalDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isDepositDisabled` on the `WorkStatuses` table. All the data in the column will be lost.
  - You are about to drop the column `isQiwiDisabled` on the `WorkStatuses` table. All the data in the column will be lost.
  - You are about to drop the column `isSellDisabled` on the `WorkStatuses` table. All the data in the column will be lost.
  - You are about to drop the column `isTinkoffDisabled` on the `WorkStatuses` table. All the data in the column will be lost.
  - You are about to drop the column `isWithdrawalDisabled` on the `WorkStatuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SteamBot" DROP COLUMN "isDeativated",
ADD COLUMN     "isDeactivated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDepositDisabled",
DROP COLUMN "isSellDisabled",
DROP COLUMN "isWithdrawalDisabled",
ADD COLUMN     "isDepositEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSellEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isWithdrawalEnabled" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "WorkStatuses" DROP COLUMN "isDepositDisabled",
DROP COLUMN "isQiwiDisabled",
DROP COLUMN "isSellDisabled",
DROP COLUMN "isTinkoffDisabled",
DROP COLUMN "isWithdrawalDisabled",
ADD COLUMN     "isDepositEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isQiwiEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSellEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTinkoffEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWithdrawalEnabled" BOOLEAN NOT NULL DEFAULT false;
