-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "allowedRoutes" JSONB NOT NULL DEFAULT '[]';
