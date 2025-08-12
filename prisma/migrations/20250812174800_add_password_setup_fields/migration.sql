-- AlterTable: Make password nullable and add password setup fields
ALTER TABLE "User" 
  ALTER COLUMN "password" DROP NOT NULL,
  ADD COLUMN "passwordSetupToken" TEXT,
  ADD COLUMN "passwordSetupExpires" TIMESTAMP(3),
  ADD COLUMN "passwordSetupUsed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex: Add unique constraint for password setup tokens
CREATE UNIQUE INDEX "User_passwordSetupToken_key" ON "User"("passwordSetupToken");