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

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_dislikerId_fkey" FOREIGN KEY ("dislikerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dislike" ADD CONSTRAINT "Dislike_dislikedId_fkey" FOREIGN KEY ("dislikedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skip" ADD CONSTRAINT "Skip_skipperId_fkey" FOREIGN KEY ("skipperId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skip" ADD CONSTRAINT "Skip_skippedId_fkey" FOREIGN KEY ("skippedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
