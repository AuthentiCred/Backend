/*
  Warnings:

  - You are about to drop the column `name` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `candidates` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `candidates` table. All the data in the column will be lost.
  - Added the required column `mobile_number` to the `candidates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "name",
DROP COLUMN "number",
DROP COLUMN "phone",
ADD COLUMN     "mobile_number" TEXT NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL;
