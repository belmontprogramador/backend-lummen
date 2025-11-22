/*
  Warnings:

  - You are about to drop the `UserProfileBasic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileExtra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileInterests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileLifestyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileRelationInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProfileWorkEducation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfileBasic" DROP CONSTRAINT "UserProfileBasic_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileExtra" DROP CONSTRAINT "UserProfileExtra_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileInterests" DROP CONSTRAINT "UserProfileInterests_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileLifestyle" DROP CONSTRAINT "UserProfileLifestyle_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileLocation" DROP CONSTRAINT "UserProfileLocation_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileRelationInfo" DROP CONSTRAINT "UserProfileRelationInfo_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfileWorkEducation" DROP CONSTRAINT "UserProfileWorkEducation_userId_fkey";

-- DropTable
DROP TABLE "UserProfileBasic";

-- DropTable
DROP TABLE "UserProfileExtra";

-- DropTable
DROP TABLE "UserProfileInterests";

-- DropTable
DROP TABLE "UserProfileLifestyle";

-- DropTable
DROP TABLE "UserProfileLocation";

-- DropTable
DROP TABLE "UserProfileRelationInfo";

-- DropTable
DROP TABLE "UserProfileWorkEducation";

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" UUID NOT NULL,
    "bio" TEXT,
    "birthday" TIMESTAMP(3),
    "gender" "Gender",
    "orientation" "SexualOrientation",
    "pronoun" "Pronoun",
    "heightCm" INTEGER,
    "zodiac" "ZodiacSign",
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "intention" "Intention",
    "intentionOther" TEXT,
    "relationshipType" "RelationshipType",
    "relationshipOther" TEXT,
    "pets" "PetsPreference",
    "petsOther" TEXT,
    "drinking" "DrinkingStatus",
    "smoking" "SmokingStatus",
    "activityLevel" "ActivityFrequency",
    "communication" "CommunicationStyle",
    "communicationOther" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "education" TEXT,
    "educationLevel" "EducationLevel",
    "educationOther" TEXT,
    "livingIn" TEXT,
    "languages" "Language"[] DEFAULT ARRAY[]::"Language"[],
    "interestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
    "interestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
    "interestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
    "interestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
    "interestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
    "interestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
    "interestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
