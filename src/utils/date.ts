/**
 * Utilitários de data. Datas são armazenadas internamente no formato ISO
 * "YYYY-MM-DD" e exibidas ao usuário no formato brasileiro "DD/MM/YYYY".
 */

export function isoParaBr(iso: string): string {
  if (!iso) return "";
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

export function brParaIso(br: string): string {
  const partes = br.split("/");
  if (partes.length !== 3) return "";
  const [dia, mes, ano] = partes;
  if (!dia || !mes || !ano) return "";
  return `${ano.padStart(4, "0")}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}

export function dataValida(br: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(br)) return false;
  const iso = brParaIso(br);
  const data = new Date(iso + "T00:00:00");
  return !isNaN(data.getTime());
}

export function hojeIso(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function diasAteHoje(iso: string): number {
  const hoje = new Date(hojeIso() + "T00:00:00");
  const alvo = new Date(iso + "T00:00:00");
  const diffMs = alvo.getTime() - hoje.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function textoRelativo(iso: string): string {
  const dias = diasAteHoje(iso);
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Amanhã";
  if (dias === -1) return "Ontem";
  if (dias > 1) return `Em ${dias} dias`;
  return `Atrasado (${Math.abs(dias)}d)`;
}

export function ordenarPorDataAsc<T extends { data?: string; dataEntrega?: string }>(
  itens: T[]
): T[] {
  return [...itens].sort((a, b) => {
    const dataA = a.data ?? a.dataEntrega ?? "";
    const dataB = b.data ?? b.dataEntrega ?? "";
    return dataA.localeCompare(dataB);
  });
}
