-- DropForeignKey
ALTER TABLE "Skin" DROP CONSTRAINT "Skin_inventoryId_fkey";

-- AlterTable
ALTER TABLE "Skin" ALTER COLUMN "inventoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
