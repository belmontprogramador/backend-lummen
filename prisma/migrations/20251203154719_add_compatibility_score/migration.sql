-- CreateTable
CREATE TABLE "CompatibilityScore" (
    "id" TEXT NOT NULL,
    "userA" UUID NOT NULL,
    "userB" UUID NOT NULL,
    "score" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompatibilityScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompatibilityScore_userA_score_idx" ON "CompatibilityScore"("userA", "score");

-- CreateIndex
CREATE INDEX "CompatibilityScore_userB_idx" ON "CompatibilityScore"("userB");

-- CreateIndex
CREATE UNIQUE INDEX "CompatibilityScore_userA_userB_key" ON "CompatibilityScore"("userA", "userB");

-- AddForeignKey
ALTER TABLE "CompatibilityScore" ADD CONSTRAINT "CompatibilityScore_userA_fkey" FOREIGN KEY ("userA") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompatibilityScore" ADD CONSTRAINT "CompatibilityScore_userB_fkey" FOREIGN KEY ("userB") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
