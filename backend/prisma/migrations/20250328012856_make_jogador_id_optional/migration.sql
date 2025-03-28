-- DropForeignKey
ALTER TABLE "Efeito" DROP CONSTRAINT "Efeito_jogadorId_fkey";

-- AlterTable
ALTER TABLE "Efeito" ALTER COLUMN "jogadorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Efeito" ADD CONSTRAINT "Efeito_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
