/*
  Warnings:

  - You are about to drop the `_ProjectToTaskStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `TaskStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ProjectToTaskStatus` DROP FOREIGN KEY `_ProjectToTaskStatus_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProjectToTaskStatus` DROP FOREIGN KEY `_ProjectToTaskStatus_B_fkey`;

-- AlterTable
ALTER TABLE `TaskStatus` ADD COLUMN `projectId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_ProjectToTaskStatus`;

-- CreateTable
CREATE TABLE `SubTask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL,
    `taskId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubTask` ADD CONSTRAINT `SubTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaskStatus` ADD CONSTRAINT `TaskStatus_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
