-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('WELCOME', 'PASSWORD_SETUP', 'PASSWORD_RESET', 'REVIEW_NOTIFICATION', 'LEAVE_REQUEST', 'SYSTEM_NOTIFICATION', 'OTHER');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('SENT', 'FAILED', 'PENDING', 'DELIVERED');

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "emailType" "EmailType" NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'SENT',
    "templateUsed" TEXT,
    "userId" TEXT,
    "employeeId" TEXT,
    "employerId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failureReason" TEXT,
    "metadata" JSONB,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);