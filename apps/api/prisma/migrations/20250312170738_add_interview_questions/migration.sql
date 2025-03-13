-- AlterTable
ALTER TABLE "InterviewQuestion" ADD COLUMN     "maxValue" INTEGER,
ADD COLUMN     "minValue" INTEGER,
ADD COLUMN     "stepValue" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "InterviewQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
