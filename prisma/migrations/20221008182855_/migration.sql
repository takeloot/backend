-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "botPrice" INTEGER,
ADD COLUMN     "defaultPrice" INTEGER,
ADD COLUMN     "floatRange" INTEGER[],
ADD COLUMN     "hasHighDemand" BOOLEAN,
ADD COLUMN     "isUnsellable" BOOLEAN,
ADD COLUMN     "lowestPrice" INTEGER,
ADD COLUMN     "model3d" TEXT,
ADD COLUMN     "overstockDiff" INTEGER,
ADD COLUMN     "pattern" INTEGER,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "quality" TEXT,
ADD COLUMN     "rarity" TEXT;

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skinId" TEXT,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skinId" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
