/*
  Warnings:

  - You are about to drop the column `orientationOther` on the `UserProfileBasic` table. All the data in the column will be lost.
  - You are about to drop the column `pronounOther` on the `UserProfileBasic` table. All the data in the column will be lost.
  - You are about to drop the column `zodiacOther` on the `UserProfileBasic` table. All the data in the column will be lost.
  - The `languages` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsActivities` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsLifestyle` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsCreativity` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsSportsFitness` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsMusic` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsNightlife` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `interestsTvCinema` column on the `UserProfileInterests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
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

-- AlterTable
ALTER TABLE "UserProfileBasic" DROP COLUMN "orientationOther",
DROP COLUMN "pronounOther",
DROP COLUMN "zodiacOther";

-- AlterTable
ALTER TABLE "UserProfileInterests" DROP COLUMN "languages",
ADD COLUMN     "languages" "Language"[] DEFAULT ARRAY[]::"Language"[],
DROP COLUMN "interestsActivities",
ADD COLUMN     "interestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
DROP COLUMN "interestsLifestyle",
ADD COLUMN     "interestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
DROP COLUMN "interestsCreativity",
ADD COLUMN     "interestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
DROP COLUMN "interestsSportsFitness",
ADD COLUMN     "interestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
DROP COLUMN "interestsMusic",
ADD COLUMN     "interestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
DROP COLUMN "interestsNightlife",
ADD COLUMN     "interestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
DROP COLUMN "interestsTvCinema",
ADD COLUMN     "interestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[];
