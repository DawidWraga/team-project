/*
  Warnings:

  - You are about to drop the column `authorId` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Document_authorId_fkey` ON `Document`;

-- AlterTable
ALTER TABLE `Document` DROP COLUMN `authorId`;
