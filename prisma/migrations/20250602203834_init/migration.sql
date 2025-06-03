/*
  Warnings:

  - The values [LAWYER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'COMMON_USER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'COMMON_USER';
COMMIT;

-- DropTable
DROP TABLE "Stock";

-- CreateTable
CREATE TABLE "StockSymbol" (
    "id" SERIAL NOT NULL,
    "isin" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT,
    "industry" TEXT,
    "series" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockSymbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricalData1D" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "openPrice" DOUBLE PRECISION,
    "closePrice" DOUBLE PRECISION,
    "highPrice" DOUBLE PRECISION,
    "lowPrice" DOUBLE PRECISION,
    "volume" BIGINT,
    "openInterest" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricalData1D_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockSymbol_isin_key" ON "StockSymbol"("isin");

-- CreateIndex
CREATE UNIQUE INDEX "StockSymbol_symbol_key" ON "StockSymbol"("symbol");

-- CreateIndex
CREATE INDEX "HistoricalData1D_symbol_idx" ON "HistoricalData1D"("symbol");

-- CreateIndex
CREATE INDEX "HistoricalData1D_date_idx" ON "HistoricalData1D"("date");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalData1D_symbol_date_key" ON "HistoricalData1D"("symbol", "date");

-- AddForeignKey
ALTER TABLE "HistoricalData1D" ADD CONSTRAINT "HistoricalData1D_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockSymbol"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
