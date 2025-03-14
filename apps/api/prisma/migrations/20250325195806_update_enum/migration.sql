/*
  Warnings:

  - The values [Dev] on the enum `QuestionCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionCategory_new" AS ENUM ('General', 'Personal', 'Final', 'Development', 'Marketing', 'Design', 'Multimedia');
ALTER TABLE "InterviewQuestion" ALTER COLUMN "category" TYPE "QuestionCategory_new" USING ("category"::text::"QuestionCategory_new");
ALTER TYPE "QuestionCategory" RENAME TO "QuestionCategory_old";
ALTER TYPE "QuestionCategory_new" RENAME TO "QuestionCategory";
DROP TYPE "QuestionCategory_old";
COMMIT;
