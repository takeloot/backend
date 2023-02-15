-- CreateTable
CREATE TABLE "SteamMarketItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "SteamMarketItem_pkey" PRIMARY KEY ("id")
);
