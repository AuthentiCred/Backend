-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "educations" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "previous_employers" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
