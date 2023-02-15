/*
  Warnings:

  - You are about to drop the column `tradeURL` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Bot` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tradeURL",
ADD COLUMN     "tradeUrl" TEXT;

-- DropTable
DROP TABLE "Bot";

-- CreateTable
CREATE TABLE "SteamBot" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accountName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "proxy" TEXT,
    "sharedSecret" TEXT NOT NULL,
    "identitySecret" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL,
    "tradeUrl" TEXT NOT NULL,
    "cookies" TEXT[],

    CONSTRAINT "SteamBot_pkey" PRIMARY KEY ("id")
);
