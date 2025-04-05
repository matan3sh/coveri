-- CreateEnum
CREATE TYPE "WritingStyle" AS ENUM ('FORMAL', 'INFORMAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerkUserId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "companyWebsite" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "workHistory" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "writingStyle" "WritingStyle" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CoverLetter_clerkUserId_idx" ON "CoverLetter"("clerkUserId");

-- AddForeignKey
ALTER TABLE "CoverLetter" ADD CONSTRAINT "CoverLetter_clerkUserId_fkey" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE CASCADE ON UPDATE CASCADE;
