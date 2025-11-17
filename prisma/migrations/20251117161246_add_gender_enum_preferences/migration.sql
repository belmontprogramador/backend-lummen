/*
  Warnings:

  - The `gender` column on the `UserProfileBasic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHER');

-- AlterTable
ALTER TABLE "UserPreference" ADD COLUMN     "preferredGenders" "Gender"[] DEFAULT ARRAY[]::"Gender"[];

-- AlterTable
ALTER TABLE "UserProfileBasic" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender";
