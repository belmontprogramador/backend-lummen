/*
  Warnings:

  - You are about to drop the column `price` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "price",
ADD COLUMN     "priceBrl" DECIMAL(10,2),
ADD COLUMN     "priceEur" DECIMAL(10,2),
ADD COLUMN     "priceUsd" DECIMAL(10,2);
