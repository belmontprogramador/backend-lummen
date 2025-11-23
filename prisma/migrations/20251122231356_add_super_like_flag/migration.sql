/*
  Warnings:

  - You are about to drop the column `city` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "isSuper" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state";
