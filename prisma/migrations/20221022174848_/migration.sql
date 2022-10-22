-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CREATOR', 'ADMIN', 'SUPPORT', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
