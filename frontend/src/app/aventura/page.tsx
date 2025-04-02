"use client";

import { useJogador } from "@/hooks/useJogador";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BackpackIcon } from "lucide-react";

export default function AventuraPage() {
    const router = useRouter();
    const jogadorId = "ee2663e0-232d-4118-8e53-a622e0b45923"; // mock fixo
    const { jogador, loading } = useJogador(jogadorId);
  
    const paragrafoAtual = {
      texto:
        "Você se encontra diante de uma porta de ferro antiga, coberta de runas. O ar está carregado com um cheiro metálico...",
      opcoes: [
        { texto: "Abrir a porta", destino: 102 },
        { texto: "Voltar pelo corredor", destino: 12 },
      ],
    };
  
    return (
      <main className="min-h-screen bg-[url('/bg-vampire.png')] bg-cover bg-center text-white px-4 py-8 flex flex-col items-center justify-center relative">
        {/* Botão de Inventário */}
        <button
          onClick={() => router.push("/inventario")}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-stone-800 hover:bg-stone-700 shadow-md"
          aria-label="Inventário"
        >
          <BackpackIcon className="w-6 h-6 text-white" />
        </button>
  
        {/* Texto centralizado */}
        <div className="max-w-3xl bg-black/80 p-6 rounded-xl backdrop-blur text-center space-y-4">
          <p className="text-stone-300">{paragrafoAtual.texto}</p>
  
          <div className="space-y-2">
            {paragrafoAtual.opcoes.map((opcao, index) => (
              <Button key={index} className="w-full text-lg">
                {opcao.texto}
              </Button>
            ))}
          </div>
        </div>
  
        {/* Status do jogador sempre visível */}
        {!loading && jogador && (
          <Card className="fixed top-6 right-6 w-64 bg-stone-900/80 border border-stone-700">
            <CardContent className="p-4 text-sm text-stone-300">
              <p className="text-white font-semibold">🎲 Status</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Habilidade: {jogador.habilidade}</li>
                <li>Energia: {jogador.energia}</li>
                <li>Sorte: {jogador.sorte}</li>
                <li>Fé: {jogador.fe}</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    );
  }