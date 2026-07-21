import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Camada genérica de persistência local usando AsyncStorage.
 * Cada "coleção" é salva como um array JSON sob uma chave própria,
 * simulando uma tabela de um banco de dados simples.
 *
 * Trocar para SQLite no futuro exige apenas reimplementar esta classe,
 * sem alterar os serviços de domínio (disciplinaService, atividadeService, etc).
 */
export class CollectionStorage<T extends { id: string }> {
  constructor(private readonly key: string) {}

  async listar(): Promise<T[]> {
    try {
      const raw = await AsyncStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch (erro) {
      console.error(`Erro ao ler ${this.key}:`, erro);
      return [];
    }
  }

  async buscarPorId(id: string): Promise<T | undefined> {
    const itens = await this.listar();
    return itens.find((item) => item.id === id);
  }

  async salvar(item: T): Promise<void> {
    const itens = await this.listar();
    const indice = itens.findIndex((i) => i.id === item.id);
    if (indice >= 0) {
      itens[indice] = item;
    } else {
      itens.push(item);
    }
    await this.persistir(itens);
  }

  async excluir(id: string): Promise<void> {
    const itens = await this.listar();
    const filtrados = itens.filter((i) => i.id !== id);
    await this.persistir(filtrados);
  }

  async excluirOndeCampo(campo: keyof T, valor: unknown): Promise<void> {
    const itens = await this.listar();
    const filtrados = itens.filter((i) => i[campo] !== valor);
    await this.persistir(filtrados);
  }

  private async persistir(itens: T[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.key, JSON.stringify(itens));
    } catch (erro) {
      console.error(`Erro ao salvar ${this.key}:`, erro);
      throw erro;
    }
  }
}
