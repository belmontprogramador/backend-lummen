/*
  Warnings:

  - You are about to drop the column `preferredActivityLevel` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCommunication` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredDrinking` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredEducationLevels` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredGenders` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredIntentions` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsActivities` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsCreativity` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsLifestyle` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsMusic` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsNightlife` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsSportsFitness` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredInterestsTvCinema` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredLanguages` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredOrientations` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredPets` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredPronouns` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredRelationshipTypes` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredSmoking` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `preferredZodiacs` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "preferredActivityLevel",
DROP COLUMN "preferredCommunication",
DROP COLUMN "preferredDrinking",
DROP COLUMN "preferredEducationLevels",
DROP COLUMN "preferredGenders",
DROP COLUMN "preferredIntentions",
DROP COLUMN "preferredInterestsActivities",
DROP COLUMN "preferredInterestsCreativity",
DROP COLUMN "preferredInterestsLifestyle",
DROP COLUMN "preferredInterestsMusic",
DROP COLUMN "preferredInterestsNightlife",
DROP COLUMN "preferredInterestsSportsFitness",
DROP COLUMN "preferredInterestsTvCinema",
DROP COLUMN "preferredLanguages",
DROP COLUMN "preferredOrientations",
DROP COLUMN "preferredPets",
DROP COLUMN "preferredPronouns",
DROP COLUMN "preferredRelationshipTypes",
DROP COLUMN "preferredSmoking",
DROP COLUMN "preferredZodiacs",
ADD COLUMN     "activityLevel" "ActivityFrequency"[] DEFAULT ARRAY[]::"ActivityFrequency"[],
ADD COLUMN     "city" TEXT,
ADD COLUMN     "communication" "CommunicationStyle"[] DEFAULT ARRAY[]::"CommunicationStyle"[],
ADD COLUMN     "country" TEXT,
ADD COLUMN     "drinking" "DrinkingStatus"[] DEFAULT ARRAY[]::"DrinkingStatus"[],
ADD COLUMN     "educationLevel" "EducationLevel"[] DEFAULT ARRAY[]::"EducationLevel"[],
ADD COLUMN     "gender" "Gender"[] DEFAULT ARRAY[]::"Gender"[],
ADD COLUMN     "intention" "Intention"[] DEFAULT ARRAY[]::"Intention"[],
ADD COLUMN     "interestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
ADD COLUMN     "interestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
ADD COLUMN     "interestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
ADD COLUMN     "interestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
ADD COLUMN     "interestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
ADD COLUMN     "interestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
ADD COLUMN     "interestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[],
ADD COLUMN     "languages" "Language"[] DEFAULT ARRAY[]::"Language"[],
ADD COLUMN     "orientation" "SexualOrientation"[] DEFAULT ARRAY[]::"SexualOrientation"[],
ADD COLUMN     "pets" "PetsPreference"[] DEFAULT ARRAY[]::"PetsPreference"[],
ADD COLUMN     "pronoun" "Pronoun"[] DEFAULT ARRAY[]::"Pronoun"[],
ADD COLUMN     "relationshipType" "RelationshipType"[] DEFAULT ARRAY[]::"RelationshipType"[],
ADD COLUMN     "smoking" "SmokingStatus"[] DEFAULT ARRAY[]::"SmokingStatus"[],
ADD COLUMN     "state" TEXT,
ADD COLUMN     "zodiac" "ZodiacSign"[] DEFAULT ARRAY[]::"ZodiacSign"[];
