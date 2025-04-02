-- DropForeignKey
ALTER TABLE "ItemAdquirido" DROP CONSTRAINT "ItemAdquirido_paragrafoId_fkey";

-- AlterTable
ALTER TABLE "ItemAdquirido" ADD COLUMN     "jogadorId" TEXT,
ALTER COLUMN "paragrafoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ItemAdquirido" ADD CONSTRAINT "ItemAdquirido_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAdquirido" ADD CONSTRAINT "ItemAdquirido_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
