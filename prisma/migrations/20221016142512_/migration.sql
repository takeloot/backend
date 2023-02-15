/*
  Warnings:

  - You are about to drop the column `color` on the `Skin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Skin" DROP COLUMN "color",
ADD COLUMN     "rarityColor" TEXT;
