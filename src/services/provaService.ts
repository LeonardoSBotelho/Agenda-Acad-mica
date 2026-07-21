import { Prova } from "../models/types";
import { CollectionStorage } from "./storage";
import { generateId } from "../utils/id";

export const provaStorage = new CollectionStorage<Prova>("@agenda:provas");

export const provaService = {
  listar: () => provaStorage.listar(),

  buscarPorId: (id: string) => provaStorage.buscarPorId(id),

  async listarPorDisciplina(disciplinaId: string): Promise<Prova[]> {
    const todas = await provaStorage.listar();
    return todas.filter((p) => p.disciplinaId === disciplinaId);
  },

  async criar(dados: Omit<Prova, "id">): Promise<Prova> {
    const nova: Prova = { id: generateId(), ...dados };
    await provaStorage.salvar(nova);
    return nova;
  },

  async atualizar(prova: Prova): Promise<void> {
    await provaStorage.salvar(prova);
  },

  async excluir(id: string): Promise<void> {
    await provaStorage.excluir(id);
  },
};
