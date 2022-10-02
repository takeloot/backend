/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inventoryId]` on the table `Skin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_userId_key" ON "Inventory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Skin_inventoryId_key" ON "Skin"("inventoryId");
