import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "../../src/components/Input";
import { ColorPicker } from "../../src/components/ColorPicker";
import { Button } from "../../src/components/Button";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { CORES_DISCIPLINA } from "../../src/utils/colors";
import { disciplinaService } from "../../src/services/disciplinaService";

export default function FormDisciplina() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editando = !!id;
  const { mostrarToast } = useToast();

  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [sala, setSala] = useState("");
  const [horario, setHorario] = useState("");
  const [cor, setCor] = useState(CORES_DISCIPLINA[0]);
  const [erroNome, setErroNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (editando && id) {
      disciplinaService.buscarPorId(id).then((disciplina) => {
        if (disciplina) {
          setNome(disciplina.nome);
          setProfessor(disciplina.professor);
          setSala(disciplina.sala);
          setHorario(disciplina.horario);
          setCor(disciplina.cor);
        }
      });
    }
  }, [editando, id]);

  async function salvar() {
    if (!nome.trim()) {
      setErroNome("Informe o nome da disciplina");
      return;
    }
    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), professor: professor.trim(), sala: sala.trim(), horario: horario.trim(), cor };
      if (editando && id) {
        await disciplinaService.atualizar({ id, ...dados });
      } else {
        await disciplinaService.criar(dados);
      }
      mostrarToast(editando ? "Disciplina atualizada com sucesso" : "Disciplina salva com sucesso");
      router.back();
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível salvar a disciplina.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Input
        label="Nome da disciplina *"
        placeholder="Ex: Cálculo I"
        value={nome}
        onChangeText={(t) => {
          setNome(t);
          if (t.trim()) setErroNome("");
        }}
        erro={erroNome}
      />
      <Input
        label="Professor"
        placeholder="Ex: Maria Silva"
        value={professor}
        onChangeText={setProfessor}
      />
      <Input label="Sala" placeholder="Ex: Bloco A, sala 12" value={sala} onChangeText={setSala} />
      <Input
        label="Horário"
        placeholder="Ex: Seg/Qua 08h-10h"
        value={horario}
        onChangeText={setHorario}
      />

      <View style={styles.corSecao}>
        <View style={styles.corLabelWrap}>
          <View style={[styles.previaCor, { backgroundColor: cor }]} />
          <Text style={styles.corLabel}>Cor da disciplina</Text>
        </View>
        <ColorPicker corSelecionada={cor} onSelecionar={setCor} />
      </View>

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
  corSecao: { marginBottom: 24 },
  corLabelWrap: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  previaCor: { width: 20, height: 20, borderRadius: 6, marginRight: 8 },
  corLabel: { fontSize: 13, fontWeight: "600", color: theme.text },
});
