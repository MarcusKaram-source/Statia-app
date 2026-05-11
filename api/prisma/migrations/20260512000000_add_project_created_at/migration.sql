-- AlterTable: Add missing createdAt column to Project
ALTER TABLE "Project" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex for Project (missing from schema)
CREATE INDEX "Project_type_idx" ON "Project"("type");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Project_priceEGP_idx" ON "Project"("priceEGP");

-- CreateIndex for User.email (non-unique, for lookups)
CREATE INDEX "User_email_idx" ON "User"("email");
