/*
  Warnings:

  - The values [ganho_fe,teste_sorte,instrucao_especial] on the enum `TipoAcao` will be removed. If these variants are still used in the database, this will fail.
  - The values [bonus_temporario,modificador_combate] on the enum `TipoEfeito` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `descricao` on the `Criatura` table. All the data in the column will be lost.
  - You are about to drop the column `atributo` on the `Efeito` table. All the data in the column will be lost.
  - You are about to drop the column `duracao` on the `Efeito` table. All the data in the column will be lost.
  - Made the column `paragrafoId` on table `AcaoIntermediaria` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoAcao_new" AS ENUM ('ganho_fé', 'ganho_sorte', 'perda_energia', 'perda_fé', 'perda_habilidade', 'recupera_energia');
ALTER TABLE "AcaoIntermediaria" ALTER COLUMN "tipo" TYPE "TipoAcao_new" USING ("tipo"::text::"TipoAcao_new");
ALTER TYPE "TipoAcao" RENAME TO "TipoAcao_old";
ALTER TYPE "TipoAcao_new" RENAME TO "TipoAcao";
DROP TYPE "TipoAcao_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TipoEfeito_new" AS ENUM ('efeito_continuo', 'penalidade', 'sangramento', 'maldição');
ALTER TABLE "Efeito" ALTER COLUMN "tipo" TYPE "TipoEfeito_new" USING ("tipo"::text::"TipoEfeito_new");
ALTER TYPE "TipoEfeito" RENAME TO "TipoEfeito_old";
ALTER TYPE "TipoEfeito_new" RENAME TO "TipoEfeito";
DROP TYPE "TipoEfeito_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AcaoIntermediaria" DROP CONSTRAINT "AcaoIntermediaria_paragrafoId_fkey";

-- AlterTable
ALTER TABLE "AcaoIntermediaria" ALTER COLUMN "paragrafoId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Criatura" DROP COLUMN "descricao";

-- AlterTable
ALTER TABLE "Efeito" DROP COLUMN "atributo",
DROP COLUMN "duracao",
ADD COLUMN     "condicao" TEXT,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "paragrafoId" INTEGER;

-- CreateTable
CREATE TABLE "ItemAdquirido" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "paragrafoId" INTEGER NOT NULL,

    CONSTRAINT "ItemAdquirido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecisaoCondicional" (
    "id" TEXT NOT NULL,
    "condicao" TEXT NOT NULL,
    "verdadeiro" INTEGER NOT NULL,
    "falso" INTEGER NOT NULL,
    "paragrafoId" INTEGER NOT NULL,

    CONSTRAINT "DecisaoCondicional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DecisaoCondicional_paragrafoId_key" ON "DecisaoCondicional"("paragrafoId");

-- AddForeignKey
ALTER TABLE "AcaoIntermediaria" ADD CONSTRAINT "AcaoIntermediaria_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Efeito" ADD CONSTRAINT "Efeito_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemAdquirido" ADD CONSTRAINT "ItemAdquirido_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecisaoCondicional" ADD CONSTRAINT "DecisaoCondicional_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
