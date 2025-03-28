-- CreateEnum
CREATE TYPE "TipoCondicao" AS ENUM ('possui_item', 'atributo_minimo', 'aflicao_ativa');

-- CreateEnum
CREATE TYPE "StatusCombate" AS ENUM ('ativo', 'encerrado', 'vitoria', 'derrota', 'fuga');

-- CreateEnum
CREATE TYPE "ResultadoRodada" AS ENUM ('jogador_feriu', 'inimigo_feriu', 'empate');

-- CreateEnum
CREATE TYPE "TipoEquipamento" AS ENUM ('arma', 'armadura', 'escudo', 'item_magico', 'outro');

-- CreateEnum
CREATE TYPE "TipoAflicao" AS ENUM ('continua', 'temporaria');

-- CreateEnum
CREATE TYPE "TipoEfeito" AS ENUM ('bonus_temporario', 'penalidade', 'modificador_combate');

-- CreateEnum
CREATE TYPE "TipoAcao" AS ENUM ('perda_energia', 'ganho_fe', 'teste_sorte', 'instrucao_especial');

-- CreateTable
CREATE TABLE "Jogador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "habilidadeInicial" INTEGER NOT NULL,
    "habilidade" INTEGER NOT NULL,
    "energiaInicial" INTEGER NOT NULL,
    "energia" INTEGER NOT NULL,
    "sorteInicial" INTEGER NOT NULL,
    "sorte" INTEGER NOT NULL,
    "feInicial" INTEGER NOT NULL,
    "fe" INTEGER NOT NULL,
    "provisoes" INTEGER NOT NULL,
    "paragrafoAtualId" INTEGER NOT NULL,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paragrafo" (
    "id" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "Paragrafo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcao" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "destinoId" INTEGER NOT NULL,
    "paragrafoId" INTEGER NOT NULL,

    CONSTRAINT "Opcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condicao" (
    "id" TEXT NOT NULL,
    "tipo" "TipoCondicao" NOT NULL,
    "valor" TEXT NOT NULL,
    "inverter" BOOLEAN,
    "opcaoId" TEXT NOT NULL,

    CONSTRAINT "Condicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Criatura" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "habilidade" INTEGER NOT NULL,
    "energia" INTEGER NOT NULL,
    "descricao" TEXT,
    "paragrafoId" INTEGER NOT NULL,

    CONSTRAINT "Criatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoEquipamento" NOT NULL,
    "descricao" TEXT NOT NULL,
    "bonusHabilidade" INTEGER,
    "efeitoEspecial" TEXT,
    "jogadorId" TEXT NOT NULL,

    CONSTRAINT "Equipamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aflicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoAflicao" NOT NULL,
    "efeito" TEXT NOT NULL,
    "condicoesCura" TEXT,
    "jogadorId" TEXT NOT NULL,

    CONSTRAINT "Aflicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feitico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "efeito" TEXT NOT NULL,
    "usosRestantes" INTEGER NOT NULL,
    "jogadorId" TEXT NOT NULL,

    CONSTRAINT "Feitico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Efeito" (
    "id" TEXT NOT NULL,
    "tipo" "TipoEfeito" NOT NULL,
    "atributo" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "duracao" INTEGER,
    "jogadorId" TEXT NOT NULL,

    CONSTRAINT "Efeito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcaoIntermediaria" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoAcao" NOT NULL,
    "valor" INTEGER,
    "paragrafoId" INTEGER,
    "jogadorId" TEXT,

    CONSTRAINT "AcaoIntermediaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Combate" (
    "id" TEXT NOT NULL,
    "jogadorId" TEXT NOT NULL,
    "status" "StatusCombate" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "Combate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rodada" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "forcaJogador" INTEGER NOT NULL,
    "forcaInimigo" INTEGER NOT NULL,
    "resultado" "ResultadoRodada" NOT NULL,
    "sorteUtilizada" BOOLEAN NOT NULL,
    "descricao" TEXT,
    "combateId" TEXT NOT NULL,

    CONSTRAINT "Rodada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CriaturasCombate" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CriaturasCombate_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Condicao_opcaoId_key" ON "Condicao"("opcaoId");

-- CreateIndex
CREATE INDEX "_CriaturasCombate_B_index" ON "_CriaturasCombate"("B");

-- AddForeignKey
ALTER TABLE "Jogador" ADD CONSTRAINT "Jogador_paragrafoAtualId_fkey" FOREIGN KEY ("paragrafoAtualId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcao" ADD CONSTRAINT "Opcao_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcao" ADD CONSTRAINT "Opcao_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Condicao" ADD CONSTRAINT "Condicao_opcaoId_fkey" FOREIGN KEY ("opcaoId") REFERENCES "Opcao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Criatura" ADD CONSTRAINT "Criatura_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipamento" ADD CONSTRAINT "Equipamento_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aflicao" ADD CONSTRAINT "Aflicao_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feitico" ADD CONSTRAINT "Feitico_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Efeito" ADD CONSTRAINT "Efeito_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoIntermediaria" ADD CONSTRAINT "AcaoIntermediaria_paragrafoId_fkey" FOREIGN KEY ("paragrafoId") REFERENCES "Paragrafo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcaoIntermediaria" ADD CONSTRAINT "AcaoIntermediaria_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Combate" ADD CONSTRAINT "Combate_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rodada" ADD CONSTRAINT "Rodada_combateId_fkey" FOREIGN KEY ("combateId") REFERENCES "Combate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CriaturasCombate" ADD CONSTRAINT "_CriaturasCombate_A_fkey" FOREIGN KEY ("A") REFERENCES "Combate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CriaturasCombate" ADD CONSTRAINT "_CriaturasCombate_B_fkey" FOREIGN KEY ("B") REFERENCES "Criatura"("id") ON DELETE CASCADE ON UPDATE CASCADE;
