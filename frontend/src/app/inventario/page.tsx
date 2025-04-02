"use client";

import { useJogador } from "@/hooks/useJogador";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InventarioPage() {
  const jogadorId = "ee2663e0-232d-4118-8e53-a622e0b45923";
  const { jogador, loading } = useJogador(jogadorId);
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[url('/bg-vampire.png')] bg-cover bg-center text-white px-4 py-8 flex flex-col items-center justify-center relative">
      <div className="max-w-md w-full space-y-6 bg-black/80 p-6 rounded-xl backdrop-blur text-center">
        <h1 className="text-3xl font-title">Inventário</h1>

        {!loading && jogador && (
          <Card className="bg-stone-900/80 border border-stone-700 text-left">
            <CardContent className="p-4 text-sm text-stone-300 space-y-6">
              <div>
                <p className="text-white font-semibold mb-2">⚔️ Atributos</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Nome: {jogador.nome}</li>
                  <li>Habilidade: {jogador.habilidade} (Inicial: {jogador.habilidadeInicial})</li>
                  <li>Energia: {jogador.energia} (Inicial: {jogador.energiaInicial})</li>
                  <li>Sorte: {jogador.sorte} (Inicial: {jogador.sorteInicial})</li>
                  <li>Fé: {jogador.fe} (Inicial: {jogador.feInicial})</li>
                  <li>Provisões: {jogador.provisoes}</li>
                </ul>
              </div>

              <div>
                <p className="text-white font-semibold mb-2">🛡️ Equipamentos</p>
                {jogador.equipamentos?.length ? (
                  <ul className="list-inside list-disc space-y-1">
                    {jogador.equipamentos.map((eqp, idx) => (
                      <li key={idx}>{eqp.nome} ({eqp.tipo})</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-stone-400">Nenhum equipamento.</p>
                )}
              </div>

              <div>
                <p className="text-white font-semibold mb-2">🎒 Itens</p>
                {jogador.itens?.length ? (
                  <ul className="list-inside list-disc space-y-1">
                    {jogador.itens.map((item, idx) => (
                      <li key={idx}>
                        {item.nome}
                        {item.descricao && ` – ${item.descricao}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-stone-400">Nenhum item.</p>
                )}
              </div>

              <div>
                <p className="text-white font-semibold mb-2">☠️ Aflições</p>
                {jogador.aflicoes?.length ? (
                  <ul className="list-inside list-disc space-y-1">
                    {jogador.aflicoes.map((af, idx) => (
                      <li key={idx}>{af.nome}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-stone-400">Sem aflições.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Button variant="default" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    </main>
  );
}
