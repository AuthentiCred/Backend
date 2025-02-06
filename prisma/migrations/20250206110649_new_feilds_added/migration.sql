/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateOfBirth` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `candidates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "educations" (
    "id" SERIAL NOT NULL,
    "institution" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "candidate_id" INTEGER NOT NULL,

    CONSTRAINT "educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "previous_employers" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "candidate_id" INTEGER NOT NULL,

    CONSTRAINT "previous_employers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "previous_employers" ADD CONSTRAINT "previous_employers_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
