/*
  Warnings:

  - A unique constraint covering the columns `[transferNumber]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transferNumber` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "transferNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_transferNumber_key" ON "Transfer"("transferNumber");
