/*
  Warnings:

  - You are about to drop the column `list_name` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `list_name`;

-- CreateTable
CREATE TABLE `_ProjectToTaskStatus` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProjectToTaskStatus_AB_unique`(`A`, `B`),
    INDEX `_ProjectToTaskStatus_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectToTaskStatus` ADD CONSTRAINT `_ProjectToTaskStatus_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectToTaskStatus` ADD CONSTRAINT `_ProjectToTaskStatus_B_fkey` FOREIGN KEY (`B`) REFERENCES `TaskStatus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
