-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COMMON_USER');

-- CreateTable
CREATE TABLE "StockSymbol" (
    "id" SERIAL NOT NULL,
    "isin" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT,
    "industry" TEXT,
    "series" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "photoURL" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "name" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "firebaseCreatedAt" TIMESTAMP(3) NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "phoneNumber" TEXT,
    "postgresCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'COMMON_USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMA_Results" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "sma_period" INTEGER NOT NULL,
    "threshold_pct" DOUBLE PRECISION NOT NULL,
    "close_price" DOUBLE PRECISION NOT NULL,
    "sma_value" DOUBLE PRECISION NOT NULL,
    "deviation_pct" DOUBLE PRECISION NOT NULL,
    "date_generated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SMA_Results_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE INDEX "sma_period_deviation_pct_idx" ON "SMA_Results"("sma_period", "deviation_pct");

-- CreateIndex
CREATE INDEX "sma_period_idx" ON "SMA_Results"("sma_period");

-- CreateIndex
CREATE INDEX "symbol_idx" ON "SMA_Results"("symbol");

-- AddForeignKey
ALTER TABLE "HistoricalData1D" ADD CONSTRAINT "HistoricalData1D_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "StockSymbol"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

