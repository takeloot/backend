-- CreateTable
CREATE TABLE "Skin" (
    "id" TEXT NOT NULL,
    "appId" INTEGER NOT NULL,
    "assetId" INTEGER NOT NULL,
    "name" TEXT,
    "inspect" TEXT,
    "float" TEXT,
    "steamId" TEXT NOT NULL,
    "steamImg" TEXT NOT NULL,
    "steamName" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
