/*
  Warnings:

  - A unique constraint covering the columns `[accountName]` on the table `SteamBot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SteamBot_accountName_key" ON "SteamBot"("accountName");
