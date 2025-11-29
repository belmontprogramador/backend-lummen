/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `blog_posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `blog_posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
