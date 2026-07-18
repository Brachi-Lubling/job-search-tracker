-- CreateEnum
CREATE TYPE "PipelineStage" AS ENUM ('wishlist', 'applied', 'interviewing', 'offer', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "pipeline" "PipelineStage" NOT NULL DEFAULT 'applied';

-- AlterTable
ALTER TABLE "ResumeVersion" ADD COLUMN     "notes" TEXT;
