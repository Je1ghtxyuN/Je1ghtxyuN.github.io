-- AlterTable
ALTER TABLE `StudySession` ADD COLUMN `userId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `StudyUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `githubId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StudyUser_email_key`(`email`),
    UNIQUE INDEX `StudyUser_githubId_key`(`githubId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `StudySession_userId_idx` ON `StudySession`(`userId`);

-- AddForeignKey
ALTER TABLE `StudySession` ADD CONSTRAINT `StudySession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `StudyUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
