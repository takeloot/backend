-- AlterTable
ALTER TABLE "Skin" ADD COLUMN     "sellId" TEXT;

-- CreateTable
CREATE TABLE "Sell" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalItemsPrice" INTEGER NOT NULL,
    "paymentProvider" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,

    CONSTRAINT "Sell_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skin" ADD CONSTRAINT "Skin_sellId_fkey" FOREIGN KEY ("sellId") REFERENCES "Sell"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sell" ADD CONSTRAINT "Sell_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
