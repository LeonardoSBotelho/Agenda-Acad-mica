import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "../../src/components/Input";
import { ChipSelect } from "../../src/components/ChipSelect";
import { Button } from "../../src/components/Button";
import { EmptyState } from "../../src/components/EmptyState";
import { DatePicker } from "../../src/components/DatePicker";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { provaService } from "../../src/services/provaService";
import { disciplinaService } from "../../src/services/disciplinaService";
import { Disciplina } from "../../src/models/types";

export default function FormProva() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;
  const { mostrarToast } = useToast();

  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinaId, setDisciplinaId] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [data, setData] = useState(""); // ISO: YYYY-MM-DD
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [erros, setErros] = useState<{ disciplina?: string; data?: string; horario?: string }>({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    disciplinaService.listar().then((lista) => {
      setDisciplinas(lista);
      if (!editando && lista.length > 0) setDisciplinaId(lista[0].id);
    });
  }, [editando]);

  useEffect(() => {
    if (editando && id) {
      provaService.buscarPorId(id).then((prova) => {
        if (prova) {
          setDisciplinaId(prova.disciplinaId);
          setConteudo(prova.conteudo);
          setData(prova.data);
          setHorario(prova.horario);
          setLocal(prova.local);
        }
      });
    }
  }, [editando, id]);

  async function salvar() {
    const novosErros: typeof erros = {};
    if (!disciplinaId) novosErros.disciplina = "Selecione uma disciplina";
    if (!data) novosErros.data = "Selecione a data da prova";
    if (!horario.trim()) novosErros.horario = "Informe o horário";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

    setSalvando(true);
    try {
      const dados = {
        disciplinaId,
        conteudo: conteudo.trim(),
        data,
        horario: horario.trim(),
        local: local.trim(),
      };
      if (editando && id) {
        await provaService.atualizar({ id, ...dados });
      } else {
        await provaService.criar(dados);
      }
      mostrarToast(editando ? "Prova atualizada com sucesso" : "Prova salva com sucesso");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a prova.");
    } finally {
      setSalvando(false);
    }
  }

  if (disciplinas.length === 0) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        titulo="Cadastre uma disciplina primeiro"
        descricao="É preciso ter ao menos uma disciplina para agendar uma prova"
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
        label="Conteúdo cobrado"
        placeholder="Ex: Capítulos 1 a 4"
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        numberOfLines={3}
        style={{ minHeight: 70, textAlignVertical: "top" }}
      />
      <DatePicker label="Data *" valorIso={data} onSelecionar={setData} erro={erros.data} />
      <Input
        label="Horário *"
        placeholder="Ex: 08h00"
        value={horario}
        onChangeText={setHorario}
        erro={erros.horario}
        accessibilityLabel="Horário da prova"
      />
      <Input
        label="Local"
        placeholder="Ex: Bloco A, sala 12"
        value={local}
        onChangeText={setLocal}
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
