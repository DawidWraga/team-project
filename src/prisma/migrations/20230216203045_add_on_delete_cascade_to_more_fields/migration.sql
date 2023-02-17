/*
  Warnings:

  - You are about to drop the column `statusToOrderedTaskIds` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `SubTask` DROP FOREIGN KEY `SubTask_taskId_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `statusToOrderedTaskIds`;

-- AddForeignKey
ALTER TABLE `SubTask` ADD CONSTRAINT `SubTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
