/*
  Warnings:

  - You are about to drop the column `title` on the `InterviewQuestion` table. All the data in the column will be lost.
  - Added the required column `question` to the `InterviewQuestion` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `InterviewQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `InterviewQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('Personal', 'Dev', 'Marketing', 'Design', 'Multimedia');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('Checkbox', 'Radio', 'Slider', 'Field', 'Select', 'TextArea', 'Number');

-- AlterTable
ALTER TABLE "InterviewQuestion" DROP COLUMN "title",
ADD COLUMN     "question" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "QuestionType" NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "QuestionCategory" NOT NULL;
