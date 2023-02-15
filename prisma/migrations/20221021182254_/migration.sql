-- DropForeignKey
ALTER TABLE "Sell" DROP CONSTRAINT "Sell_steamBotId_fkey";

-- AlterTable
ALTER TABLE "Sell" ALTER COLUMN "steamBotId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_steamBotId_fkey" FOREIGN KEY ("steamBotId") REFERENCES "SteamBot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
