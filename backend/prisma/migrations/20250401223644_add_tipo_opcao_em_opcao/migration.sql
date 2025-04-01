-- CreateEnum
CREATE TYPE "TipoOpcao" AS ENUM ('PADRAO', 'CONDICIONAL', 'ESPECIAL');

-- AlterTable
ALTER TABLE "Opcao" ADD COLUMN     "tipoOpcao" "TipoOpcao" NOT NULL DEFAULT 'PADRAO';
