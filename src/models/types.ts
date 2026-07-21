export interface Disciplina {
  id: string;
  nome: string;
  professor: string;
  sala: string;
  horario: string;
  cor: string;
}

export type Prioridade = "baixa" | "media" | "alta";
export type StatusAtividade = "pendente" | "concluida";

export interface Atividade {
  id: string;
  disciplinaId: string;
  titulo: string;
  descricao: string;
  dataEntrega: string; // formato ISO: YYYY-MM-DD
  prioridade: Prioridade;
  status: StatusAtividade;
}

export interface Prova {
  id: string;
  disciplinaId: string;
  conteudo: string;
  data: string; // formato ISO: YYYY-MM-DD
  horario: string;
  local: string;
}

export interface Nota {
  id: string;
  disciplinaId: string;
  nota1: number;
  nota2: number;
  trabalho: number;
  media: number;
}

export type Situacao = "Aprovado" | "Recuperação" | "Reprovado";

export interface Perfil {
  nome: string;
  curso: string;
  matricula: string;
  instituicao: string;
}
