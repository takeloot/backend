/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `SteamMarketItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SteamMarketItem_name_key" ON "SteamMarketItem"("name");
