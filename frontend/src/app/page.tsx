"use client";

import { useRouter } from "next/navigation";
import { useJogador } from "@/hooks/useJogador";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const jogadorId = "ee2663e0-232d-4118-8e53-a622e0b45923"; // substituir por session/localStorage
  const { jogador, loading } = useJogador(jogadorId);

  return (
    <main className="min-h-screen bg-[url('/bg-vampire.png')] bg-cover bg-center text-white flex flex-col items-center justify-center px-4 py-8 space-y-6">
      <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 w-full max-w-xl text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-title font-bold tracking-tight drop-shadow-md">
          A Cripta do Vampiro
        </h1>

        <p className="text-stone-300 max-w-md mx-auto">
          Um RPG de texto interativo. Avance pelos parágrafos, tome decisões e enfrente criaturas sombrias em uma jornada de fantasia sombria.
        </p>

        <div className="w-full space-y-3">
          <Button variant="default" className="w-full text-lg">
            Nova Aventura
          </Button>
          <Button
            variant="default"
            onClick={() => router.push("/aventura")}
            className="w-full text-lg"
          >
            Continuar
          </Button>
          <Button variant="ghost" className="w-full text-lg">
            Configurações
          </Button>
        </div>
      </div>

      {!loading && jogador && (
        <Card className="w-full max-w-md mt-10 bg-stone-900/80 backdrop-blur border border-stone-700 text-stone-300">
          <CardContent className="p-4 space-y-2">
            <p className="text-white font-semibold text-base">🧝 Status do Jogador:</p>
            <div className="grid grid-cols-2 gap-x-6 text-sm">
              <span>Habilidade:</span><span className="text-white font-medium">{jogador.habilidade}</span>
              <span>Energia:</span><span className="text-white font-medium">{jogador.energia}</span>
              <span>Sorte:</span><span className="text-white font-medium">{jogador.sorte}</span>
              <span>Fé:</span><span className="text-white font-medium">{jogador.fe}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
