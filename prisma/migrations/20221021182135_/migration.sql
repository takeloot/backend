/*
  Warnings:

  - A unique constraint covering the columns `[steamBotId]` on the table `Sell` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `steamBotId` to the `Sell` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SellStatus" AS ENUM ('WAITING_SUPPORT_ACCEPT', 'ACCEPTED_BY_SUPPORT', 'WAITING_USER_TRADE_CONFIRMATION', 'TRADE_ACCEPTED_BY_USER', 'TRADE_TIMEOUT_EXCEEDED', 'PAY_REQUEST_TO_MERCHANT', 'PAY_ACCEPTED_BY_MERCHANT', 'COMPLETED');

-- AlterTable
ALTER TABLE "Sell" ADD COLUMN     "status" "SellStatus" NOT NULL DEFAULT 'WAITING_SUPPORT_ACCEPT',
ADD COLUMN     "steamBotId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SteamBot" ADD COLUMN     "isDeativated" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Sell_steamBotId_key" ON "Sell"("steamBotId");

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_steamBotId_fkey" FOREIGN KEY ("steamBotId") REFERENCES "SteamBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
