-- DropForeignKey
ALTER TABLE "CompatibilityScore" DROP CONSTRAINT "CompatibilityScore_userA_fkey";

-- DropForeignKey
ALTER TABLE "CompatibilityScore" DROP CONSTRAINT "CompatibilityScore_userB_fkey";

-- DropIndex
DROP INDEX "idx_compatibility_usera_score";

-- AddForeignKey
ALTER TABLE "CompatibilityScore" ADD CONSTRAINT "CompatibilityScore_userA_fkey" FOREIGN KEY ("userA") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompatibilityScore" ADD CONSTRAINT "CompatibilityScore_userB_fkey" FOREIGN KEY ("userB") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
