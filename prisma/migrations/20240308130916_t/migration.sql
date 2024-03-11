-- DropForeignKey
ALTER TABLE "administrator" DROP CONSTRAINT "administrator_accessLevelId_fkey";

-- AlterTable
ALTER TABLE "administrator" ALTER COLUMN "accessLevelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "administrator" ADD CONSTRAINT "administrator_accessLevelId_fkey" FOREIGN KEY ("accessLevelId") REFERENCES "accessLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
