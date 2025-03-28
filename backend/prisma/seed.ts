// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import cliProgress from 'cli-progress';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, '../../scripts/gemini/paragrafos_final_corrigido.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const paragrafoData = JSON.parse(rawData);

  console.log(`Importando ${paragrafoData.length} parágrafos...`);
  const paragrafoBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  paragrafoBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    await prisma.paragrafo.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        texto: item.texto,
      },
    });
    paragrafoBar.increment();
  }
  paragrafoBar.stop();

  console.log('Importando opções...');
  let count = 0;
  const opcaoBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  opcaoBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    for (const opcao of item.opcoes || []) {
      const exists = await prisma.opcao.findFirst({
        where: {
          paragrafoId: item.id,
          texto: opcao.texto,
        },
      });
      if (!exists) {
        try {
          await prisma.opcao.create({
            data: {
              texto: opcao.texto,
              destino: { connect: { id: opcao.destino } },
              paragrafo: { connect: { id: item.id } },
            },
          });
          count++;
        } catch (e) {
          console.warn(`Erro ao criar opcao no parágrafo ${item.id} -> destino ${opcao.destino}`);
          console.error(e);
        }
      }
    }
    opcaoBar.increment();
  }
  opcaoBar.stop();
  console.log(`Importadas ${count} opções. Importando criaturas...`);

  let criaturasCount = 0;
  const criaturaBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  criaturaBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    for (const criatura of item.criaturas || []) {
      const exists = await prisma.criatura.findFirst({
        where: {
          nome: criatura.nome,
          paragrafoId: item.id,
        },
      });
      if (!exists) {
        await prisma.criatura.create({
          data: {
            nome: criatura.nome,
            habilidade: criatura.habilidade,
            energia: criatura.energia,
            descricao: criatura.descricao || null,
            paragrafo: { connect: { id: item.id } },
          },
        });
        criaturasCount++;
      }
    }
    criaturaBar.increment();
  }
  criaturaBar.stop();
  console.log(`Importadas ${criaturasCount} criaturas. Importando ações intermediárias...`);

  let acoesCount = 0;
  const acaoBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  acaoBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    for (const acao of item.acoesIntermediarias || []) {
      const exists = await prisma.acaoIntermediaria.findFirst({
        where: {
          descricao: acao.descricao,
          paragrafoId: item.id,
        },
      });
      if (!exists) {
        await prisma.acaoIntermediaria.create({
          data: {
            descricao: acao.descricao,
            tipo: acao.tipo,
            valor: acao.valor || null,
            paragrafo: { connect: { id: item.id } },
          },
        });
        acoesCount++;
      }
    }
    acaoBar.increment();
  }
  acaoBar.stop();
  console.log(`Importadas ${acoesCount} ações. Importando efeitos contínuos de combate...`);

  let efeitosCount = 0;
  const efeitoBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  efeitoBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    for (const efeito of item.efeitosContinuosCombate || []) {
      const exists = await prisma.efeito.findFirst({
        where: {
          tipo: efeito.tipo,
          valor: efeito.valor,
          paragrafoId: item.id,
        },
      });
      if (!exists) {
        await prisma.efeito.create({
          data: {
            tipo: efeito.tipo,
            descricao: efeito.descricao || null,
            valor: efeito.valor,
            condicao: efeito.condicao || null,
            paragrafo: { connect: { id: item.id } },
          },
        });
        efeitosCount++;
      }
    }
    efeitoBar.increment();
  }
  efeitoBar.stop();
  console.log(`Importados ${efeitosCount} efeitos. Importando itens adquiridos...`);

  let itensCount = 0;
  const itemProgress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  itemProgress.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    for (const entrada of item.itensAdquiridos || []) {
      try {
        const nome = typeof entrada === 'string' ? entrada : entrada.nome;
        const exists = await prisma.itemAdquirido.findFirst({
          where: {
            nome,
            paragrafoId: item.id,
          },
        });
        if (!exists) {
          await prisma.itemAdquirido.create({
            data: {
              nome,
              paragrafo: { connect: { id: item.id } },
            },
          });
          itensCount++;
        }
      } catch (e) {
        console.warn(`Erro ao importar item no parágrafo ${item.id}`);
        console.error(e);
      }
    }
    itemProgress.increment();
  }
  itemProgress.stop();
  console.log(`Importados ${itensCount} itens. Importando decisões condicionais...`);

  let decisoesCount = 0;
  const decisaoBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  decisaoBar.start(paragrafoData.length, 0);

  for (const item of paragrafoData) {
    const cond = item.decisaoCondicional;
    if (cond) {
      const exists = await prisma.condicao.findFirst({
        where: {
          valor: cond.condicao,
          opcao: {
            paragrafoId: item.id,
          },
        },
      });
      if (!exists) {
        await prisma.condicao.create({
          data: {
            tipo: 'atributo_minimo',
            valor: cond.condicao,
            inverter: false,
            opcao: {
              create: {
                texto: `Decisão condicional para ${cond.condicao}`,
                destino: { connect: { id: cond.verdadeiro } },
                paragrafo: { connect: { id: item.id } },
              },
            },
          },
        });
        decisoesCount++;
      }
    }
    decisaoBar.increment();
  }
  decisaoBar.stop();
  console.log(`Importadas ${decisoesCount} decisões condicionais.`);
  console.log('Importação concluída!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });