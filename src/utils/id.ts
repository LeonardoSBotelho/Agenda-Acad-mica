/**
 * Gera um identificador único simples (sem dependências externas).
 * Suficiente para uso local com AsyncStorage.
 */
export function generateId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}
