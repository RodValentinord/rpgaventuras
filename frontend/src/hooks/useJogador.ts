import { useEffect, useState } from "react";

// Interface fiel ao schema do Prisma + includes
export interface Jogador {
  id: string;
  nome: string;
  habilidade: number;
  habilidadeInicial: number;
  energia: number;
  energiaInicial: number;
  sorte: number;
  sorteInicial: number;
  fe: number;
  feInicial: number;
  provisoes: number;
  itens: { nome: string; descricao?: string }[];
  equipamentos: { nome: string; tipo: string }[];
  aflicoes: { nome: string }[];
  paragrafoAtual: { id: number; texto: string } | null;
}

export function useJogador(id: string) {
  const [jogador, setJogador] = useState<Jogador | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJogador() {
      try {
        const res = await fetch(`http://localhost:3001/jogador/${id}`);
        const data = await res.json();
        setJogador(data);
      } catch (error) {
        console.error("Erro ao buscar jogador:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchJogador();
  }, [id]);

  return { jogador, loading };
}
