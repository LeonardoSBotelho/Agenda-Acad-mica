import { Nota } from "../models/types";
import { CollectionStorage } from "./storage";
import { generateId } from "../utils/id";
import { calcularMedia } from "../utils/media";

export const notaStorage = new CollectionStorage<Nota>("@agenda:notas");

export const notaService = {
  listar: () => notaStorage.listar(),

  buscarPorId: (id: string) => notaStorage.buscarPorId(id),

  async buscarPorDisciplina(disciplinaId: string): Promise<Nota | undefined> {
    const todas = await notaStorage.listar();
    return todas.find((n) => n.disciplinaId === disciplinaId);
  },

  async salvar(dados: Omit<Nota, "id" | "media">, idExistente?: string): Promise<Nota> {
    const media = calcularMedia(dados.nota1, dados.nota2, dados.trabalho);
    const registro: Nota = {
      id: idExistente ?? generateId(),
      ...dados,
      media,
    };
    await notaStorage.salvar(registro);
    return registro;
  },

  async excluir(id: string): Promise<void> {
    await notaStorage.excluir(id);
  },
};
