/*
  Warnings:

  - A unique constraint covering the columns `[pk]` on the table `WorkStatuses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkStatuses" ADD COLUMN     "pk" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WorkStatuses_pk_key" ON "WorkStatuses"("pk");
