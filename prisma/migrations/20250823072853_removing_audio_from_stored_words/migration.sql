/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `stored_words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."stored_words" DROP COLUMN "fileUrl";
