-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "transaction" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "user" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
