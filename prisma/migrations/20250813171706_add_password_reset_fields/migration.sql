-- Add password reset fields to User table
ALTER TABLE "User" 
  ADD COLUMN "resetToken" TEXT,
  ADD COLUMN "resetTokenExpires" TIMESTAMP(3);

-- Create unique index for reset tokens
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");