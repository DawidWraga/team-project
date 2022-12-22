/*
  Warnings:

  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_icon` on the `User` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userIcon` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `full_name`,
    DROP COLUMN `role_id`,
    DROP COLUMN `user_icon`,
    ADD COLUMN `fullName` TEXT NOT NULL,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `userIcon` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `UserRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
