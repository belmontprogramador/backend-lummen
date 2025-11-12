-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "BoostType" AS ENUM ('BOOST', 'SUPERBOOST');

-- CreateEnum
CREATE TYPE "BoostStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Pronoun" AS ENUM ('HE_HIM', 'SHE_HER', 'THEY_THEM', 'OTHER');

-- CreateEnum
CREATE TYPE "Intention" AS ENUM ('FRIENDS', 'DATING', 'LONG_TERM', 'CASUAL', 'NETWORKING', 'OTHER');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('MONOGAMY', 'NON_MONOGAMY', 'OPEN', 'OTHER');

-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('HIGH_SCHOOL', 'BACHELOR', 'MASTER', 'PHD', 'OTHER');

-- CreateEnum
CREATE TYPE "SmokingStatus" AS ENUM ('NO', 'SOCIALLY', 'YES');

-- CreateEnum
CREATE TYPE "DrinkingStatus" AS ENUM ('NO', 'SOCIALLY', 'YES');

-- CreateEnum
CREATE TYPE "ActivityFrequency" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "PetsPreference" AS ENUM ('NONE', 'DOG', 'CAT', 'DOG_AND_CAT', 'OTHER');

-- CreateEnum
CREATE TYPE "CommunicationStyle" AS ENUM ('DIRECT', 'HUMOR', 'EMPATHETIC', 'ANALYTICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ZodiacSign" AS ENUM ('ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES', 'OTHER');

-- CreateEnum
CREATE TYPE "SexualOrientation" AS ENUM ('STRAIGHT', 'GAY', 'LESBIAN', 'BISEXUAL', 'ASEXUAL', 'PANSEXUAL', 'QUEER', 'OTHER');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPhoto" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "userId" UUID NOT NULL,
    "maxDistanceKm" INTEGER NOT NULL DEFAULT 50,
    "ageMin" INTEGER NOT NULL DEFAULT 18,
    "ageMax" INTEGER NOT NULL DEFAULT 99,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" UUID NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "birthday" TIMESTAMP(3),
    "gender" TEXT,
    "orientation" "SexualOrientation",
    "orientationOther" TEXT,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "pronoun" "Pronoun",
    "pronounOther" TEXT,
    "heightCm" INTEGER,
    "intention" "Intention",
    "intentionOther" TEXT,
    "relationshipType" "RelationshipType",
    "relationshipOther" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "zodiac" "ZodiacSign",
    "zodiacOther" TEXT,
    "educationLevel" "EducationLevel",
    "educationOther" TEXT,
    "communication" "CommunicationStyle",
    "communicationOther" TEXT,
    "pets" "PetsPreference",
    "petsOther" TEXT,
    "drinking" "DrinkingStatus",
    "smoking" "SmokingStatus",
    "activityLevel" "ActivityFrequency",
    "jobTitle" TEXT,
    "company" TEXT,
    "education" TEXT,
    "livingIn" TEXT,
    "interestsActivities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsLifestyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsCreativity" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsSportsFitness" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsMusic" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsNightlife" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interestsTvCinema" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" UUID,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "likerId" UUID NOT NULL,
    "likedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "credits" INTEGER,
    "minutes" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoostCredit" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "productId" UUID,
    "type" "BoostType" NOT NULL,
    "credits" INTEGER NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoostCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoostActivation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "BoostType" NOT NULL,
    "status" "BoostStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "creditId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoostActivation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnumLabel" (
    "id" UUID NOT NULL,
    "enumType" TEXT NOT NULL,
    "enumValue" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnumLabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "UserPhoto_userId_idx" ON "UserPhoto"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPhoto_userId_position_key" ON "UserPhoto"("userId", "position");

-- CreateIndex
CREATE INDEX "UserProfile_latitude_longitude_idx" ON "UserProfile"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_productId_idx" ON "Payment"("productId");

-- CreateIndex
CREATE INDEX "Payment_userId_status_idx" ON "Payment"("userId", "status");

-- CreateIndex
CREATE INDEX "Payment_status_paidAt_idx" ON "Payment"("status", "paidAt");

-- CreateIndex
CREATE INDEX "Like_likerId_idx" ON "Like"("likerId");

-- CreateIndex
CREATE INDEX "Like_likedId_idx" ON "Like"("likedId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_likerId_likedId_key" ON "Like"("likerId", "likedId");

-- CreateIndex
CREATE INDEX "BoostCredit_userId_idx" ON "BoostCredit"("userId");

-- CreateIndex
CREATE INDEX "BoostCredit_expiresAt_idx" ON "BoostCredit"("expiresAt");

-- CreateIndex
CREATE INDEX "BoostActivation_userId_idx" ON "BoostActivation"("userId");

-- CreateIndex
CREATE INDEX "BoostActivation_status_startsAt_idx" ON "BoostActivation"("status", "startsAt");

-- CreateIndex
CREATE INDEX "BoostActivation_status_endsAt_idx" ON "BoostActivation"("status", "endsAt");

-- CreateIndex
CREATE INDEX "BoostActivation_creditId_idx" ON "BoostActivation"("creditId");

-- CreateIndex
CREATE INDEX "EnumLabel_enumType_locale_idx" ON "EnumLabel"("enumType", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "EnumLabel_enumType_enumValue_locale_key" ON "EnumLabel"("enumType", "enumValue", "locale");

-- AddForeignKey
ALTER TABLE "UserPhoto" ADD CONSTRAINT "UserPhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likerId_fkey" FOREIGN KEY ("likerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likedId_fkey" FOREIGN KEY ("likedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostCredit" ADD CONSTRAINT "BoostCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostCredit" ADD CONSTRAINT "BoostCredit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostActivation" ADD CONSTRAINT "BoostActivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostActivation" ADD CONSTRAINT "BoostActivation_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "BoostCredit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
