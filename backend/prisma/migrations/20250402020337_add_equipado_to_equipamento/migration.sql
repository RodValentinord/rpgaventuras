/*
  Warnings:

  - Added the required column `equipado` to the `Equipamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Equipamento" ADD COLUMN     "equipado" BOOLEAN NOT NULL;
