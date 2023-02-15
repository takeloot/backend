/*
  Warnings:

  - You are about to drop the column `floatRange` on the `Skin` table. All the data in the column will be lost.
  - The `float` column on the `Skin` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Skin" DROP COLUMN "floatRange",
ADD COLUMN     "floatMax" INTEGER,
ADD COLUMN     "floatMin" INTEGER,
DROP COLUMN "float",
ADD COLUMN     "float" INTEGER;
