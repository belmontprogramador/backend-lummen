-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER', 'ADMIN', 'AUTHOR');

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
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'OTHER');

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

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'PORTUGUESE', 'FRENCH', 'GERMAN', 'ITALIAN', 'CHINESE', 'JAPANESE', 'KOREAN', 'ARABIC', 'HINDI', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestActivity" AS ENUM ('TRAVEL', 'COOKING', 'READING', 'HIKING', 'BEACH', 'VIDEO_GAMES', 'PHOTOGRAPHY', 'GYM', 'RUNNING', 'YOGA', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestLifestyle" AS ENUM ('HEALTHY', 'VEGAN', 'MINIMALIST', 'ENTREPRENEUR', 'DIGITAL_NOMAD', 'PET_LOVER', 'SPIRITUAL', 'ECO_FRIENDLY', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestCreativity" AS ENUM ('ART', 'DRAWING', 'PAINTING', 'WRITING', 'DANCING', 'DESIGN', 'MAKEUP', 'CRAFTS', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestSports" AS ENUM ('FOOTBALL', 'SOCCER', 'BASKETBALL', 'TENNIS', 'BOXING', 'MMA', 'SWIMMING', 'CYCLING', 'CROSSFIT', 'RUNNING', 'GYM', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestMusic" AS ENUM ('POP', 'ROCK', 'RAP', 'EDM', 'JAZZ', 'CLASSICAL', 'HIPHOP', 'COUNTRY', 'REGGAE', 'BLUES', 'KPOP', 'MPB', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestNightlife" AS ENUM ('BARS', 'CLUBS', 'LOUNGES', 'CONCERTS', 'FESTIVALS', 'KARAOKE', 'LIVE_MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "InterestTvCinema" AS ENUM ('ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'ROMANCE', 'FANTASY', 'SCIFI', 'DOCUMENTARY', 'ANIME', 'SERIES', 'MOVIES', 'OTHER');

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
    "name" TEXT,
    "password" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidUntil" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planId" UUID,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "allowedRoutes" JSONB NOT NULL DEFAULT '[]',
    "routePayment" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
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
    "preferredGenders" "Gender"[] DEFAULT ARRAY[]::"Gender"[],
    "preferredOrientations" "SexualOrientation"[] DEFAULT ARRAY[]::"SexualOrientation"[],
    "preferredPronouns" "Pronoun"[] DEFAULT ARRAY[]::"Pronoun"[],
    "preferredZodiacs" "ZodiacSign"[] DEFAULT ARRAY[]::"ZodiacSign"[],
    "preferredIntentions" "Intention"[] DEFAULT ARRAY[]::"Intention"[],
    "preferredRelationshipTypes" "RelationshipType"[] DEFAULT ARRAY[]::"RelationshipType"[],
    "preferredPets" "PetsPreference"[] DEFAULT ARRAY[]::"PetsPreference"[],
    "preferredSmoking" "SmokingStatus"[] DEFAULT ARRAY[]::"SmokingStatus"[],
    "preferredDrinking" "DrinkingStatus"[] DEFAULT ARRAY[]::"DrinkingStatus"[],
    "preferredActivityLevel" "ActivityFrequency"[] DEFAULT ARRAY[]::"ActivityFrequency"[],
    "preferredCommunication" "CommunicationStyle"[] DEFAULT ARRAY[]::"CommunicationStyle"[],
    "preferredEducationLevels" "EducationLevel"[] DEFAULT ARRAY[]::"EducationLevel"[],
    "preferredLanguages" "Language"[] DEFAULT ARRAY[]::"Language"[],
    "preferredInterestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
    "preferredInterestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
    "preferredInterestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
    "preferredInterestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
    "preferredInterestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
    "preferredInterestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
    "preferredInterestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[],
    "maxDistanceKm" INTEGER NOT NULL DEFAULT 50,
    "ageMin" INTEGER NOT NULL DEFAULT 18,
    "ageMax" INTEGER NOT NULL DEFAULT 99,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" UUID NOT NULL,
    "bio" TEXT,
    "birthday" TIMESTAMP(3),
    "preferredGenders" "Gender"[] DEFAULT ARRAY[]::"Gender"[],
    "preferredOrientations" "SexualOrientation"[] DEFAULT ARRAY[]::"SexualOrientation"[],
    "preferredPronouns" "Pronoun"[] DEFAULT ARRAY[]::"Pronoun"[],
    "heightCm" INTEGER,
    "preferredIntentions" "Intention"[] DEFAULT ARRAY[]::"Intention"[],
    "preferredRelationshipTypes" "RelationshipType"[] DEFAULT ARRAY[]::"RelationshipType"[],
    "preferredZodiacs" "ZodiacSign"[] DEFAULT ARRAY[]::"ZodiacSign"[],
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "preferredPets" "PetsPreference"[] DEFAULT ARRAY[]::"PetsPreference"[],
    "preferredSmoking" "SmokingStatus"[] DEFAULT ARRAY[]::"SmokingStatus"[],
    "preferredDrinking" "DrinkingStatus"[] DEFAULT ARRAY[]::"DrinkingStatus"[],
    "preferredActivityLevel" "ActivityFrequency"[] DEFAULT ARRAY[]::"ActivityFrequency"[],
    "preferredCommunication" "CommunicationStyle"[] DEFAULT ARRAY[]::"CommunicationStyle"[],
    "jobTitle" TEXT,
    "company" TEXT,
    "preferredEducationLevels" "EducationLevel"[] DEFAULT ARRAY[]::"EducationLevel"[],
    "preferredLanguages" "Language"[] DEFAULT ARRAY[]::"Language"[],
    "preferredInterestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
    "preferredInterestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
    "preferredInterestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
    "preferredInterestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
    "preferredInterestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
    "preferredInterestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
    "preferredInterestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[],
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
    "plan" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" UUID,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" UUID NOT NULL,
    "likerId" UUID NOT NULL,
    "likedId" UUID NOT NULL,
    "isSuper" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dislike" (
    "id" UUID NOT NULL,
    "dislikerId" UUID NOT NULL,
    "dislikedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dislike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skip" (
    "id" UUID NOT NULL,
    "skipperId" UUID NOT NULL,
    "skippedId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skip_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Message" (
    "id" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "fromId" UUID NOT NULL,
    "toId" UUID NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" UUID NOT NULL,
    "user1Id" UUID NOT NULL,
    "user2Id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_categories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "content" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "coverImage" TEXT,
    "bannerImage" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_authors" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'AUTHOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlanRoutes" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_PlanRoutes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Route_tag_key" ON "Route"("tag");

-- CreateIndex
CREATE INDEX "UserPhoto_userId_idx" ON "UserPhoto"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPhoto_userId_position_key" ON "UserPhoto"("userId", "position");

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
CREATE INDEX "Dislike_dislikerId_idx" ON "Dislike"("dislikerId");

-- CreateIndex
CREATE INDEX "Dislike_dislikedId_idx" ON "Dislike"("dislikedId");

-- CreateIndex
CREATE UNIQUE INDEX "Dislike_dislikerId_dislikedId_key" ON "Dislike"("dislikerId", "dislikedId");

-- CreateIndex
CREATE INDEX "Skip_skipperId_idx" ON "Skip"("skipperId");

-- CreateIndex
CREATE INDEX "Skip_skippedId_idx" ON "Skip"("skippedId");

-- CreateIndex
CREATE UNIQUE INDEX "Skip_skipperId_skippedId_key" ON "Skip"("skipperId", "skippedId");

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

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON "Conversation"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_name_key" ON "blog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "blog_categories"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "blog_posts"("authorId");

-- CreateIndex
CREATE INDEX "blog_posts_categoryId_idx" ON "blog_posts"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_authors_email_key" ON "blog_authors"("email");

-- CreateIndex
CREATE INDEX "_PlanRoutes_B_index" ON "_PlanRoutes"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_dislikerId_fkey" FOREIGN KEY ("dislikerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_dislikedId_fkey" FOREIGN KEY ("dislikedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skip" ADD CONSTRAINT "Skip_skipperId_fkey" FOREIGN KEY ("skipperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skip" ADD CONSTRAINT "Skip_skippedId_fkey" FOREIGN KEY ("skippedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostCredit" ADD CONSTRAINT "BoostCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostCredit" ADD CONSTRAINT "BoostCredit_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostActivation" ADD CONSTRAINT "BoostActivation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoostActivation" ADD CONSTRAINT "BoostActivation_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "BoostCredit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "blog_authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanRoutes" ADD CONSTRAINT "_PlanRoutes_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanRoutes" ADD CONSTRAINT "_PlanRoutes_B_fkey" FOREIGN KEY ("B") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
