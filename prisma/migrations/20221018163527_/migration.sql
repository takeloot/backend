/*
  Warnings:

  - You are about to drop the column `isWithdrawDisabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isWithdrawDisabled` on the `WorkStatuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "isWithdrawDisabled",
ADD COLUMN     "isWithdrawalDisabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "WorkStatuses" DROP COLUMN "isWithdrawDisabled",
ADD COLUMN     "isWithdrawalDisabled" BOOLEAN NOT NULL DEFAULT false;
