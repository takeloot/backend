-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "hasScreenshot" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "isStatTrak" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preview" TEXT,
ADD COLUMN     "screenshot" TEXT;
