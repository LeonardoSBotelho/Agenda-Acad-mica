import { Atividade } from "../models/types";
import { CollectionStorage } from "./storage";
import { generateId } from "../utils/id";

export const atividadeStorage = new CollectionStorage<Atividade>("@agenda:atividades");

export const atividadeService = {
  listar: () => atividadeStorage.listar(),

  buscarPorId: (id: string) => atividadeStorage.buscarPorId(id),

  async listarPorDisciplina(disciplinaId: string): Promise<Atividade[]> {
    const todas = await atividadeStorage.listar();
    return todas.filter((a) => a.disciplinaId === disciplinaId);
  },

  async listarPendentes(): Promise<Atividade[]> {
    const todas = await atividadeStorage.listar();
    return todas.filter((a) => a.status === "pendente");
  },

  async criar(dados: Omit<Atividade, "id">): Promise<Atividade> {
    const nova: Atividade = { id: generateId(), ...dados };
    await atividadeStorage.salvar(nova);
    return nova;
  },

  async atualizar(atividade: Atividade): Promise<void> {
    await atividadeStorage.salvar(atividade);
  },

  async alternarStatus(id: string): Promise<void> {
    const atividade = await atividadeStorage.buscarPorId(id);
    if (!atividade) return;
    atividade.status = atividade.status === "pendente" ? "concluida" : "pendente";
    await atividadeStorage.salvar(atividade);
  },

  async excluir(id: string): Promise<void> {
    await atividadeStorage.excluir(id);
  },
};
