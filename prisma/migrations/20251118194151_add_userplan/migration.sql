-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('FREE', 'PREMIUM_1', 'PREMIUM_2', 'VIP', 'ULTRA');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "UserPlan" NOT NULL DEFAULT 'FREE';
