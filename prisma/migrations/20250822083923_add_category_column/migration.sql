/*
  Warnings:

  - Added the required column `category` to the `stored_words` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."stored_words" ADD COLUMN     "category" TEXT NOT NULL;
