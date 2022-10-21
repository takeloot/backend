-- AlterTable
ALTER TABLE "Skin" ALTER COLUMN "color" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Sticker" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "skinId" TEXT,

    CONSTRAINT "Sticker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sticker" ADD CONSTRAINT "Sticker_skinId_fkey" FOREIGN KEY ("skinId") REFERENCES "Skin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
