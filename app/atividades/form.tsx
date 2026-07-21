import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Alert, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "../../src/components/Input";
import { ChipSelect } from "../../src/components/ChipSelect";
import { Button } from "../../src/components/Button";
import { EmptyState } from "../../src/components/EmptyState";
import { DatePicker } from "../../src/components/DatePicker";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { atividadeService } from "../../src/services/atividadeService";
import { disciplinaService } from "../../src/services/disciplinaService";
import { Disciplina, Prioridade } from "../../src/models/types";

const PRIORIDADES: { valor: Prioridade; rotulo: string; cor: string }[] = [
  { valor: "baixa", rotulo: "Baixa", cor: theme.success },
  { valor: "media", rotulo: "Média", cor: theme.warning },
  { valor: "alta", rotulo: "Alta", cor: theme.danger },
];

export default function FormAtividade() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;
  const { mostrarToast } = useToast();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinaId, setDisciplinaId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(""); // ISO: YYYY-MM-DD
  const [prioridade, setPrioridade] = useState<Prioridade>("media");
  const [erros, setErros] = useState<{ disciplina?: string; titulo?: string; data?: string }>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    disciplinaService.listar().then((lista) => {
      setDisciplinas(lista);
      if (!editando && lista.length > 0) setDisciplinaId(lista[0].id);
    });
  }, [editando]);

  useEffect(() => {
    if (editando && id) {
      atividadeService.buscarPorId(id).then((atividade) => {
        if (atividade) {
          setDisciplinaId(atividade.disciplinaId);
          setTitulo(atividade.titulo);
          setDescricao(atividade.descricao);
          setData(atividade.dataEntrega);
          setPrioridade(atividade.prioridade);
        }
      });
    }
  }, [editando, id]);

  async function salvar() {
    const novosErros: typeof erros = {};
    if (!disciplinaId) novosErros.disciplina = "Selecione uma disciplina";
    if (!titulo.trim()) novosErros.titulo = "Informe o título";
    if (!data) novosErros.data = "Selecione a data de entrega";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setSalvando(true);
    try {
      const dados = {
        disciplinaId,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        dataEntrega: data,
        prioridade,
        status: "pendente" as const,
      };
      if (editando && id) {
        const existente = await atividadeService.buscarPorId(id);
        await atividadeService.atualizar({ ...dados, id, status: existente?.status ?? "pendente" });
      } else {
        await atividadeService.criar(dados);
      }
      mostrarToast(editando ? "Atividade atualizada com sucesso" : "Atividade salva com sucesso");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a atividade.");
    } finally {
      setSalvando(false);
    }
  }

  if (disciplinas.length === 0) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        titulo="Cadastre uma disciplina primeiro"
        descricao="É preciso ter ao menos uma disciplina para criar uma atividade"
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <ChipSelect
        label="Disciplina *"
        opcoes={disciplinas.map((d) => ({ valor: d.id, rotulo: d.nome, cor: d.cor }))}
        valorSelecionado={disciplinaId}
        onSelecionar={setDisciplinaId}
        erro={erros.disciplina}
      />
      <Input
        label="Título *"
        placeholder="Ex: Lista de exercícios 3"
        value={titulo}
        onChangeText={setTitulo}
        erro={erros.titulo}
        accessibilityLabel="Título da atividade"
      />
      <Input
        label="Descrição"
        placeholder="Detalhes da atividade..."
        value={descricao}
        onChangeText={setDescricao}
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: "top" }}
        accessibilityLabel="Descrição da atividade"
      />
      <DatePicker label="Data de entrega *" valorIso={data} onSelecionar={setData} erro={erros.data} />
      <ChipSelect
        label="Prioridade"
        opcoes={PRIORIDADES}
        valorSelecionado={prioridade}
        onSelecionar={(v) => setPrioridade(v as Prioridade)}
      />

      <Button
        label={salvando ? "Salvando..." : "Salvar"}
        onPress={salvar}
        disabled={salvando}
        style={{ marginTop: 8 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  conteudo: { padding: 20, paddingBottom: 40 },
});
