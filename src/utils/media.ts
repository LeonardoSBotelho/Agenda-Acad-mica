import { Situacao } from "../models/types";
import { theme } from "./colors";

/**
 * Calcula a média ponderada simples: (nota1 + nota2 + trabalho) / 3
 */
/**
 * Sanitiza a digitação de uma nota em tempo real: aceita apenas dígitos e um
 * separador decimal (vírgula ou ponto), limitando a uma casa decimal e ao
 * intervalo textual de 0 a 10. Mantém o valor como string para não atrapalhar
 * a digitação (ex: permitir "1," antes de completar "1,5").
 */
export function sanitizarDigitacaoNota(valor: string): string {
  let limpo = valor.replace(/[^0-9,.]/g, "").replace(".", ",");
  const partes = limpo.split(",");
  if (partes.length > 2) {
    limpo = `${partes[0]},${partes.slice(1).join("")}`;
  }
  const [inteiro, decimal] = limpo.split(",");
  let inteiroLimitado = inteiro.slice(0, 2);
  if (Number(inteiroLimitado) > 10) inteiroLimitado = "10";
  const decimalLimitado = decimal !== undefined ? decimal.slice(0, 1) : undefined;
  return decimalLimitado !== undefined ? `${inteiroLimitado},${decimalLimitado}` : inteiroLimitado;
}

export function calcularMedia(nota1: number, nota2: number, trabalho: number): number {
  const soma = (nota1 || 0) + (nota2 || 0) + (trabalho || 0);
  return Math.round((soma / 3) * 100) / 100;
}

export function calcularSituacao(media: number): Situacao {
  if (media >= 6) return "Aprovado";
  if (media >= 5) return "Recuperação";
  return "Reprovado";
}

export function corSituacao(situacao: Situacao): { text: string; bg: string } {
  switch (situacao) {
    case "Aprovado":
      return { text: theme.success, bg: theme.successBg };
    case "Recuperação":
      return { text: theme.warning, bg: theme.warningBg };
    case "Reprovado":
      return { text: theme.danger, bg: theme.dangerBg };
  }
}
