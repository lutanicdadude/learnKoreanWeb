-- AddForeignKey
ALTER TABLE "public"."Audio" ADD CONSTRAINT "Audio_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "public"."stored_words"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
