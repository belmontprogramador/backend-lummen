/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "UserProfileBasic" (
    "userId" UUID NOT NULL,
    "bio" TEXT,
    "birthday" TIMESTAMP(3),
    "gender" TEXT,
    "orientation" "SexualOrientation",
    "orientationOther" TEXT,
    "pronoun" "Pronoun",
    "pronounOther" TEXT,
    "heightCm" INTEGER,
    "zodiac" "ZodiacSign",
    "zodiacOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileBasic_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileLocation" (
    "userId" UUID NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileLocation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileLifestyle" (
    "userId" UUID NOT NULL,
    "pets" "PetsPreference",
    "petsOther" TEXT,
    "drinking" "DrinkingStatus",
    "smoking" "SmokingStatus",
    "activityLevel" "ActivityFrequency",
    "communication" "CommunicationStyle",
    "communicationOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileLifestyle_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileWorkEducation" (
    "userId" UUID NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "education" TEXT,
    "educationLevel" "EducationLevel",
    "educationOther" TEXT,
    "livingIn" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileWorkEducation_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileRelationInfo" (
    "userId" UUID NOT NULL,
    "intention" "Intention",
    "intentionOther" TEXT,
    "relationshipType" "RelationshipType",
    "relationshipOther" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileRelationInfo_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileInterests" (
    "userId" UUID NOT NULL,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsLifestyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsCreativity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsSportsFitness" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsMusic" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsNightlife" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsTvCinema" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileInterests_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfileExtra" (
    "userId" UUID NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfileExtra_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE INDEX "UserProfileLocation_latitude_longitude_idx" ON "UserProfileLocation"("latitude", "longitude");

-- AddForeignKey
ALTER TABLE "UserProfileBasic" ADD CONSTRAINT "UserProfileBasic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileLocation" ADD CONSTRAINT "UserProfileLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileLifestyle" ADD CONSTRAINT "UserProfileLifestyle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileWorkEducation" ADD CONSTRAINT "UserProfileWorkEducation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileRelationInfo" ADD CONSTRAINT "UserProfileRelationInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileInterests" ADD CONSTRAINT "UserProfileInterests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfileExtra" ADD CONSTRAINT "UserProfileExtra_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
