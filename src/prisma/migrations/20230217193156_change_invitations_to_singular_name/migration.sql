/*
  Warnings:

  - You are about to drop the `Invitations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Invitations`;

-- CreateTable
CREATE TABLE `Invitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Invitation_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
