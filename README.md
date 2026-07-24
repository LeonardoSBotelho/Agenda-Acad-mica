📖 Sobre o projeto

Estudantes costumam lidar com múltiplas disciplinas, prazos de atividades, datas de provas e notas espalhados em cadernos, grupos de WhatsApp e planilhas soltas. A Agenda Acadêmica centraliza tudo isso em um app mobile único, offline-first, sem necessidade de backend ou conexão com a internet.

O app calcula automaticamente médias e situação (Aprovado/Recuperação/Reprovado), organiza compromissos futuros em um calendário unificado e resume tudo em um dashboard inicial.

✅ Status: projeto completo — todas as funcionalidades mínimas do escopo foram implementadas.

✨ Funcionalidades
Módulo	O que faz
🏠 Dashboard	Resumo geral: total de disciplinas, atividades pendentes, média geral, próxima prova e próxima atividade
📘 Disciplinas	Cadastro, edição e exclusão (em cascata, removendo atividades/provas/notas relacionadas), busca por nome e cor identificadora
✅ Atividades	Cadastro, edição, exclusão, marcar/desmarcar como concluída, prioridade (baixa/média/alta) e filtro por disciplina
📝 Provas	Cadastro, edição, exclusão, ordenadas por data, com indicação visual de provas já passadas
🎯 Notas	Lançamento de nota1, nota2 e trabalho por disciplina, com cálculo automático da média e da situação
📅 Calendário	Lista unificada de provas e atividades pendentes futuras, agrupadas por data
👤 Perfil	Dados básicos do aluno: nome, curso, matrícula e instituição
🔒 Validações	Campos obrigatórios, datas no formato DD/MM/AAAA e notas entre 0 e 10


🧱 Stack tecnológica
React Native — framework para apps mobile nativos com UI declarativa
Expo (SDK 54) — toolchain que acelera build, execução e distribuição
TypeScript — modo strict, zero erros de compilação
Expo Router — navegação por arquivos (cada pasta/arquivo em app/ é uma rota)
AsyncStorage — persistência local, 100% offline
@expo/vector-icons — ícones usados em toda a interface
🗂️ Estrutura do projeto
agenda-academica/
├── app/                     # Telas (rotas via Expo Router)
│   ├── index.tsx            # Dashboard / Home
│   ├── disciplinas/         # Lista + formulário (criar/editar)
│   ├── atividades/          # Lista + formulário
│   ├── provas/              # Lista + formulário
│   ├── notas/                # Lista + lançamento de notas
│   ├── calendario.tsx       # Compromissos futuros agrupados por data
│   └── perfil.tsx            # Dados do aluno
├── src/
│   ├── models/types.ts       # Tipos: Disciplina, Atividade, Prova, Nota, Perfil
│   ├── services/              # Camada de acesso a dados (CRUD sobre AsyncStorage)
│   ├── components/            # Componentes reutilizáveis (Card, Button, Input, ChipSelect, Badge, ColorPicker, EmptyState...)
│   └── utils/                  # Datas, cores, cálculo de média/situação
├── assets/                    # Ícones e splash screen
├── app.json                   # Configuração do Expo
└── package.json
