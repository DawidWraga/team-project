/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `TaskStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Task` ADD COLUMN `kanbanOrderIndex` INTEGER NOT NULL DEFAULT 999;

-- AlterTable
ALTER TABLE `TaskStatus` MODIFY `label` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TaskStatus_label_key` ON `TaskStatus`(`label`);
