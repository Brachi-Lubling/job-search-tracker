-- CreateEnum
CREATE TYPE "JobLocation" AS ENUM ('remote', 'hybrid', 'onsite');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "location" "JobLocation",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "pipeline" SET DEFAULT 'wishlist';

-- AlterTable
ALTER TABLE "ResumeVersion" ADD COLUMN     "language" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
