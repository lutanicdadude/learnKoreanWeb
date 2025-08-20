-- CreateTable
CREATE TABLE "public"."stored_words" (
    "id" SERIAL NOT NULL,
    "kor_word" TEXT NOT NULL,
    "eng_word" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_words_pkey" PRIMARY KEY ("id")
);
