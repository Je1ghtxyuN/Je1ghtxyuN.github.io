-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `StudySession` DROP FOREIGN KEY `StudySession_userId_fkey`;

-- DropIndex
DROP INDEX `Session_userId_fkey` ON `Session`;
