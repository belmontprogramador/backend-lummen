/*
  Warnings:

  - You are about to drop the column `requiresPayment` on the `Route` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "routePayment" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "requiresPayment";
