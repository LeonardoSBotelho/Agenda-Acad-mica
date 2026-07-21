import { Disciplina } from "../models/types";
import { CollectionStorage } from "./storage";
import { generateId } from "../utils/id";
import { atividadeStorage } from "./atividadeService";
import { provaStorage } from "./provaService";
import { notaStorage } from "./notaService";

export const disciplinaStorage = new CollectionStorage<Disciplina>("@agenda:disciplinas");

export const disciplinaService = {
  listar: () => disciplinaStorage.listar(),

  buscarPorId: (id: string) => disciplinaStorage.buscarPorId(id),

  async criar(dados: Omit<Disciplina, "id">): Promise<Disciplina> {
    const nova: Disciplina = { id: generateId(), ...dados };
    await disciplinaStorage.salvar(nova);
    return nova;
  },

  async atualizar(disciplina: Disciplina): Promise<void> {
    await disciplinaStorage.salvar(disciplina);
  },

  /** Exclui a disciplina e todos os registros relacionados (atividades, provas, notas). */
  async excluir(id: string): Promise<void> {
    await disciplinaStorage.excluir(id);
    await atividadeStorage.excluirOndeCampo("disciplinaId", id);
    await provaStorage.excluirOndeCampo("disciplinaId", id);
    await notaStorage.excluirOndeCampo("disciplinaId", id);
  },
};
