import AsyncStorage from "@react-native-async-storage/async-storage";
import { Perfil } from "../models/types";

const CHAVE = "@agenda:perfil";

const PERFIL_PADRAO: Perfil = {
  nome: "",
  curso: "",
  matricula: "",
  instituicao: "",
};

export const perfilService = {
  async obter(): Promise<Perfil> {
    try {
      const raw = await AsyncStorage.getItem(CHAVE);
      return raw ? (JSON.parse(raw) as Perfil) : PERFIL_PADRAO;
    } catch (erro) {
      console.error("Erro ao ler perfil:", erro);
      return PERFIL_PADRAO;
    }
  },

  async salvar(perfil: Perfil): Promise<void> {
    await AsyncStorage.setItem(CHAVE, JSON.stringify(perfil));
  },
};
