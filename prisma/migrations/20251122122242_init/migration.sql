/*
  Warnings:

  - You are about to drop the column `activityLevel` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `communication` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `communicationOther` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `drinking` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `educationLevel` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `educationOther` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `intention` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `intentionOther` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsActivities` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsCreativity` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsLifestyle` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsMusic` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsNightlife` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsSportsFitness` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `interestsTvCinema` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `livingIn` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `orientation` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pets` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `petsOther` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pronoun` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipOther` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `relationshipType` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `smoking` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `zodiac` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "activityLevel",
DROP COLUMN "communication",
DROP COLUMN "communicationOther",
DROP COLUMN "drinking",
DROP COLUMN "education",
DROP COLUMN "educationLevel",
DROP COLUMN "educationOther",
DROP COLUMN "gender",
DROP COLUMN "intention",
DROP COLUMN "intentionOther",
DROP COLUMN "interestsActivities",
DROP COLUMN "interestsCreativity",
DROP COLUMN "interestsLifestyle",
DROP COLUMN "interestsMusic",
DROP COLUMN "interestsNightlife",
DROP COLUMN "interestsSportsFitness",
DROP COLUMN "interestsTvCinema",
DROP COLUMN "languages",
DROP COLUMN "livingIn",
DROP COLUMN "orientation",
DROP COLUMN "pets",
DROP COLUMN "petsOther",
DROP COLUMN "pronoun",
DROP COLUMN "relationshipOther",
DROP COLUMN "relationshipType",
DROP COLUMN "smoking",
DROP COLUMN "zodiac",
ADD COLUMN     "preferredActivityLevel" "ActivityFrequency"[] DEFAULT ARRAY[]::"ActivityFrequency"[],
ADD COLUMN     "preferredCommunication" "CommunicationStyle"[] DEFAULT ARRAY[]::"CommunicationStyle"[],
ADD COLUMN     "preferredDrinking" "DrinkingStatus"[] DEFAULT ARRAY[]::"DrinkingStatus"[],
ADD COLUMN     "preferredEducationLevels" "EducationLevel"[] DEFAULT ARRAY[]::"EducationLevel"[],
ADD COLUMN     "preferredGenders" "Gender"[] DEFAULT ARRAY[]::"Gender"[],
ADD COLUMN     "preferredIntentions" "Intention"[] DEFAULT ARRAY[]::"Intention"[],
ADD COLUMN     "preferredInterestsActivities" "InterestActivity"[] DEFAULT ARRAY[]::"InterestActivity"[],
ADD COLUMN     "preferredInterestsCreativity" "InterestCreativity"[] DEFAULT ARRAY[]::"InterestCreativity"[],
ADD COLUMN     "preferredInterestsLifestyle" "InterestLifestyle"[] DEFAULT ARRAY[]::"InterestLifestyle"[],
ADD COLUMN     "preferredInterestsMusic" "InterestMusic"[] DEFAULT ARRAY[]::"InterestMusic"[],
ADD COLUMN     "preferredInterestsNightlife" "InterestNightlife"[] DEFAULT ARRAY[]::"InterestNightlife"[],
ADD COLUMN     "preferredInterestsSportsFitness" "InterestSports"[] DEFAULT ARRAY[]::"InterestSports"[],
ADD COLUMN     "preferredInterestsTvCinema" "InterestTvCinema"[] DEFAULT ARRAY[]::"InterestTvCinema"[],
ADD COLUMN     "preferredLanguages" "Language"[] DEFAULT ARRAY[]::"Language"[],
ADD COLUMN     "preferredOrientations" "SexualOrientation"[] DEFAULT ARRAY[]::"SexualOrientation"[],
ADD COLUMN     "preferredPets" "PetsPreference"[] DEFAULT ARRAY[]::"PetsPreference"[],
ADD COLUMN     "preferredPronouns" "Pronoun"[] DEFAULT ARRAY[]::"Pronoun"[],
ADD COLUMN     "preferredRelationshipTypes" "RelationshipType"[] DEFAULT ARRAY[]::"RelationshipType"[],
ADD COLUMN     "preferredSmoking" "SmokingStatus"[] DEFAULT ARRAY[]::"SmokingStatus"[],
ADD COLUMN     "preferredZodiacs" "ZodiacSign"[] DEFAULT ARRAY[]::"ZodiacSign"[];
