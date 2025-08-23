-- CreateTable
CREATE TABLE "public"."Audio" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "voice" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);
