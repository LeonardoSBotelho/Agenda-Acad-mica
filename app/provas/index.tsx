import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/Card";
import { Badge } from "../../src/components/Badge";
import { EmptyState } from "../../src/components/EmptyState";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { provaService } from "../../src/services/provaService";
import { disciplinaService } from "../../src/services/disciplinaService";
import { Prova, Disciplina } from "../../src/models/types";
import { isoParaBr, ordenarPorDataAsc, textoRelativo, hojeIso } from "../../src/utils/date";

interface ProvaComDisciplina extends Prova {
  disciplina?: Disciplina;
}

export default function ListaProvas() {
  const router = useRouter();
  const { mostrarToast } = useToast();
  const [provas, setProvas] = useState<ProvaComDisciplina[]>([]);

  const carregar = useCallback(async () => {
    const [lista, disciplinas] = await Promise.all([
      provaService.listar(),
      disciplinaService.listar(),
    ]);
    const mapa = new Map(disciplinas.map((d) => [d.id, d]));
    const comDisciplina = lista.map((p) => ({ ...p, disciplina: mapa.get(p.disciplinaId) }));
    setProvas(ordenarPorDataAsc(comDisciplina));
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(prova: Prova) {
    Alert.alert("Excluir prova", "Deseja realmente excluir esta prova?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await provaService.excluir(prova.id);
          mostrarToast("Prova excluída");
          carregar();
        },
      },
    ]);
  }

  const hoje = hojeIso();

  return (
    <View style={styles.container}>
      <FlatList
        data={provas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            titulo="Nenhuma prova cadastrada"
            descricao="Toque no botão + para agendar uma prova"
          />
        }
        renderItem={({ item }) => {
          const passada = item.data < hoje;
          return (
            <Pressable
              onPress={() => router.push(`/provas/form?id=${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Prova de ${item.disciplina?.nome ?? "disciplina"} em ${isoParaBr(
                item.data
              )} às ${item.horario}`}
            >
              <Card accentColor={item.disciplina?.cor} style={passada ? styles.cardPassada : undefined}>
                <View style={styles.linhaTopo}>
                  <Text style={styles.disciplina}>{item.disciplina?.nome ?? "Sem disciplina"}</Text>
                  <Pressable
                    hitSlop={10}
                    onPress={() => confirmarExclusao(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`Excluir prova de ${item.disciplina?.nome ?? "disciplina"}`}
                  >
                    <Ionicons name="trash-outline" size={18} color={theme.danger} />
                  </Pressable>
                </View>
                <Text style={styles.conteudo}>{item.conteudo}</Text>
                <View style={styles.linhaBase}>
                  <View style={styles.tag}>
                    <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
                    <Text style={styles.tagTexto}>{isoParaBr(item.data)}</Text>
                  </View>
                  <View style={styles.tag}>
                    <Ionicons name="time-outline" size={13} color={theme.textMuted} />
                    <Text style={styles.tagTexto}>{item.horario}</Text>
                  </View>
                  {item.local ? (
                    <View style={styles.tag}>
                      <Ionicons name="location-outline" size={13} color={theme.textMuted} />
                      <Text style={styles.tagTexto}>{item.local}</Text>
                    </View>
                  ) : null}
                </View>
                {!passada && (
                  <Badge
                    texto={textoRelativo(item.data)}
                    corTexto={theme.primary}
                    corFundo={theme.primaryLight}
                  />
                )}
              </Card>
            </Pressable>
          );
        }}
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/provas/form")}
        accessibilityRole="button"
        accessibilityLabel="Agendar nova prova"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  lista: { padding: 20, paddingBottom: 100 },
  cardPassada: { opacity: 0.55 },
  linhaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  disciplina: { fontSize: 15, fontWeight: "700", color: theme.text, flex: 1 },
  conteudo: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  linhaBase: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10, marginBottom: 8 },
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
