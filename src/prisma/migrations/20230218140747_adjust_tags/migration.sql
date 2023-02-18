-- DropForeignKey
ALTER TABLE `Document` DROP FOREIGN KEY `Document_authorId_fkey`;

-- CreateTable
CREATE TABLE `_DocumentToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DocumentToUser_AB_unique`(`A`, `B`),
    INDEX `_DocumentToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DocumentToUser` ADD CONSTRAINT `_DocumentToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Document`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DocumentToUser` ADD CONSTRAINT `_DocumentToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
