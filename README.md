# 📚 Agenda Acadêmica

App mobile em **React Native + Expo + TypeScript** para estudantes gerenciarem disciplinas, atividades, provas, notas e compromissos.

## ✅ Status
Projeto completo, com `npx tsc --noEmit` passando sem erros. Todas as funcionalidades mínimas do escopo foram implementadas.

## 🚀 Como rodar

```bash
npm install
npx expo start
```

Depois escaneie o QR code com o app **Expo Go** (Android/iOS) ou pressione `a` / `i` para abrir em um emulador.

## 🧱 Stack

- React Native + Expo (SDK 54)
- TypeScript (modo `strict`)
- Expo Router (navegação por arquivos)
- AsyncStorage (persistência local)
- @expo/vector-icons

## 🗂️ Estrutura

```
app/                     → telas (rotas via Expo Router)
  index.tsx              → Dashboard / Home
  disciplinas/            → lista + formulário (criar/editar)
  atividades/             → lista + formulário
  provas/                 → lista + formulário
  notas/                  → lista + lançamento de notas
  calendario.tsx          → compromissos futuros agrupados por data
  perfil.tsx               → dados do aluno
src/
  models/types.ts          → tipos (Disciplina, Atividade, Prova, Nota, Perfil)
  services/                → camada de dados (CRUD sobre AsyncStorage)
  components/              → componentes reutilizáveis (Card, Button, Input, ChipSelect, Badge, ColorPicker, EmptyState)
  utils/                    → datas, cores, cálculo de média/situação
```

## 🎯 Funcionalidades implementadas

- **Disciplinas**: cadastro, edição, exclusão (em cascata: remove atividades/provas/notas relacionadas), busca por nome, cor identificadora.
- **Atividades**: cadastro, edição, exclusão, marcar/desmarcar como concluída, prioridade (baixa/média/alta), filtro por disciplina.
- **Provas**: cadastro, edição, exclusão, ordenadas por data, indicação visual de provas já passadas.
- **Notas**: lançamento de nota1, nota2 e trabalho por disciplina, com **cálculo automático da média** e da situação (Aprovado ≥ 7, Recuperação 5–6.9, Reprovado < 5).
- **Calendário**: lista unificada de provas e atividades pendentes futuras, agrupadas por data.
- **Dashboard**: total de disciplinas, atividades pendentes, média geral, próxima prova e próxima atividade.
- **Perfil**: dados básicos do aluno (nome, curso, matrícula, instituição).
- Persistência 100% local via AsyncStorage — sem necessidade de backend.
- Validação de formulários (campos obrigatórios, datas no formato DD/MM/AAAA, notas entre 0 e 10).

## 🔜 Próximos passos sugeridos (Etapa 7 do planejamento)

- Modo escuro
- Notificações locais (`expo-notifications`) para lembretes de provas/atividades
- Migração de AsyncStorage → SQLite (`expo-sqlite`) se o volume de dados crescer
- Animações de transição entre telas
