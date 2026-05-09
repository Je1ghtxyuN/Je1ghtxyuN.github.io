-- CreateTable
CREATE TABLE `StudySession` (
    `id` VARCHAR(191) NOT NULL,
    `workDuration` INTEGER NOT NULL,
    `completedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudySession_completedAt_idx`(`completedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
