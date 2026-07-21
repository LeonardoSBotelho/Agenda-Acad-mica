import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/Card";
import { EmptyState } from "../../src/components/EmptyState";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { disciplinaService } from "../../src/services/disciplinaService";
import { notaService } from "../../src/services/notaService";
import { Disciplina } from "../../src/models/types";

interface DisciplinaComMedia extends Disciplina {
  media?: number;
}

export default function ListaDisciplinas() {
  const router = useRouter();
  const { mostrarToast } = useToast();
  const [disciplinas, setDisciplinas] = useState<DisciplinaComMedia[]>([]);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    const [lista, notas] = await Promise.all([disciplinaService.listar(), notaService.listar()]);
    const mapaNotas = new Map(notas.map((n) => [n.disciplinaId, n.media]));
    setDisciplinas(lista.map((d) => ({ ...d, media: mapaNotas.get(d.id) })));
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(disciplina: Disciplina) {
    Alert.alert(
      "Excluir disciplina",
      `Excluir "${disciplina.nome}"? Todas as atividades, provas e notas relacionadas também serão excluídas.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await disciplinaService.excluir(disciplina.id);
            mostrarToast("Disciplina excluída");
            carregar();
          },
        },
      ]
    );
  }

  const filtradas = disciplinas.filter((d) =>
    d.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.buscaWrap}>
        <Ionicons name="search" size={18} color={theme.textMuted} />
        <TextInput
          style={styles.buscaInput}
          placeholder="Pesquisar disciplina..."
          placeholderTextColor={theme.textMuted}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <EmptyState
            icon="book-outline"
            titulo="Nenhuma disciplina cadastrada"
            descricao="Toque no botão + para adicionar sua primeira disciplina"
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/disciplinas/form?id=${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${item.nome}. ${item.professor || "Professor não informado"}. ${
              item.media !== undefined ? `Média ${item.media.toFixed(1)}` : "Sem notas lançadas"
            }`}
          >
            <Card accentColor={item.cor}>
              <View style={styles.linhaTopo}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Pressable
                  hitSlop={10}
                  onPress={() => confirmarExclusao(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir disciplina ${item.nome}`}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </Pressable>
              </View>
              <Text style={styles.detalhe}>{item.professor || "Professor não informado"}</Text>
              <View style={styles.linhaBase}>
                <View style={styles.tag}>
                  <Ionicons name="time-outline" size={13} color={theme.textMuted} />
                  <Text style={styles.tagTexto}>{item.horario || "—"}</Text>
                </View>
                <View style={styles.tag}>
                  <Ionicons name="school-outline" size={13} color={theme.textMuted} />
                  <Text style={styles.tagTexto}>
                    {item.media !== undefined ? `Média ${item.media.toFixed(1)}` : "Sem notas"}
                  </Text>
                </View>
              </View>
            </Card>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/disciplinas/form")}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova disciplina"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  buscaWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    gap: 8,
  },
  buscaInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: theme.text },
  lista: { padding: 20, paddingBottom: 100 },
  linhaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nome: { fontSize: 16, fontWeight: "700", color: theme.text, flex: 1 },
  detalhe: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  linhaBase: { flexDirection: "row", gap: 14, marginTop: 10 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4 },
  tagTexto: { fontSize: 12, color: theme.textMuted, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
