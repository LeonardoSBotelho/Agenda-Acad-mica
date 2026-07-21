import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/Card";
import { Badge } from "../../src/components/Badge";
import { EmptyState } from "../../src/components/EmptyState";
import { ChipSelect } from "../../src/components/ChipSelect";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { atividadeService } from "../../src/services/atividadeService";
import { disciplinaService } from "../../src/services/disciplinaService";
import { Atividade, Disciplina } from "../../src/models/types";
import { isoParaBr, ordenarPorDataAsc, textoRelativo } from "../../src/utils/date";

interface AtividadeComDisciplina extends Atividade {
  disciplina?: Disciplina;
}

const PRIORIDADE_LABEL: Record<string, string> = { baixa: "Baixa", media: "Média", alta: "Alta" };
const PRIORIDADE_COR: Record<string, string> = {
  baixa: theme.success,
  media: theme.warning,
  alta: theme.danger,
};

export default function ListaAtividades() {
  const router = useRouter();
  const { mostrarToast } = useToast();
  const [atividades, setAtividades] = useState<AtividadeComDisciplina[]>([]);
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const carregar = useCallback(async () => {
    const [lista, disciplinasLista] = await Promise.all([
      atividadeService.listar(),
      disciplinaService.listar(),
    ]);
    const mapa = new Map(disciplinasLista.map((d) => [d.id, d]));
    const comDisciplina = lista.map((a) => ({ ...a, disciplina: mapa.get(a.disciplinaId) }));
    setAtividades(ordenarPorDataAsc(comDisciplina));
    setDisciplinas(disciplinasLista);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(atividade: Atividade) {
    Alert.alert("Excluir atividade", `Excluir "${atividade.titulo}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await atividadeService.excluir(atividade.id);
          mostrarToast("Atividade excluída");
          carregar();
        },
      },
    ]);
  }

  const opcoesFiltro = [
    { valor: "todas", rotulo: "Todas" },
    ...disciplinas.map((d) => ({ valor: d.id, rotulo: d.nome, cor: d.cor })),
  ];

  const filtradas =
    filtroDisciplina === "todas"
      ? atividades
      : atividades.filter((a) => a.disciplinaId === filtroDisciplina);

  return (
    <View style={styles.container}>
      {disciplinas.length > 0 && (
        <View style={styles.filtroWrap}>
          <ChipSelect
            label="Filtrar por disciplina"
            opcoes={opcoesFiltro}
            valorSelecionado={filtroDisciplina}
            onSelecionar={setFiltroDisciplina}
          />
        </View>
      )}

      <FlatList
        data={filtradas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <EmptyState
            icon="checkbox-outline"
            titulo="Nenhuma atividade cadastrada"
            descricao="Toque no botão + para adicionar uma atividade"
          />
        }
        renderItem={({ item }) => (
          <AtividadeItem
            item={item}
            onEditar={() => router.push(`/atividades/form?id=${item.id}`)}
            onExcluir={() => confirmarExclusao(item)}
            onAlternarStatus={async () => {
              await atividadeService.alternarStatus(item.id);
              mostrarToast(
                item.status === "concluida" ? "Atividade reaberta" : "Atividade concluída"
              );
              carregar();
            }}
          />
        )}
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push("/atividades/form")}
        accessibilityRole="button"
        accessibilityLabel="Adicionar nova atividade"
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const AtividadeItem = React.memo(function AtividadeItem({
  item,
  onEditar,
  onExcluir,
  onAlternarStatus,
}: {
  item: AtividadeComDisciplina;
  onEditar: () => void;
  onExcluir: () => void;
  onAlternarStatus: () => void;
}) {
  return (
    <Card accentColor={item.disciplina?.cor}>
      <View style={styles.linhaTopo}>
        <Text
          style={[styles.titulo, item.status === "concluida" ? styles.tituloConcluido : null]}
        >
          {item.titulo}
        </Text>
        <Pressable
          hitSlop={10}
          onPress={onExcluir}
          accessibilityRole="button"
          accessibilityLabel={`Excluir atividade ${item.titulo}`}
        >
          <Ionicons name="trash-outline" size={18} color={theme.danger} />
        </Pressable>
      </View>
      <Text style={styles.disciplina}>{item.disciplina?.nome ?? "Sem disciplina"}</Text>
      {item.descricao ? <Text style={styles.descricao}>{item.descricao}</Text> : null}

      <View style={styles.linhaBase}>
        <Badge
          texto={PRIORIDADE_LABEL[item.prioridade]}
          corTexto={PRIORIDADE_COR[item.prioridade]}
          corFundo={PRIORIDADE_COR[item.prioridade] + "1A"}
        />
        <Text style={styles.data}>
          {isoParaBr(item.dataEntrega)} · {textoRelativo(item.dataEntrega)}
        </Text>
      </View>

      <View style={styles.acoes}>
        <Pressable
          style={[styles.acaoBotao, { backgroundColor: theme.primaryLight }]}
          onPress={onEditar}
          accessibilityRole="button"
          accessibilityLabel={`Editar atividade ${item.titulo}`}
        >
          <Ionicons name="create-outline" size={15} color={theme.primary} />
          <Text style={[styles.acaoTexto, { color: theme.primary }]}>Editar</Text>
        </Pressable>
        <Pressable
          style={[
            styles.acaoBotao,
            { backgroundColor: item.status === "concluida" ? theme.warningBg : theme.successBg },
          ]}
          onPress={onAlternarStatus}
          accessibilityRole="button"
          accessibilityLabel={
            item.status === "concluida"
              ? `Reabrir atividade ${item.titulo}`
              : `Concluir atividade ${item.titulo}`
          }
        >
          <Ionicons
            name={item.status === "concluida" ? "arrow-undo-outline" : "checkmark-outline"}
            size={15}
            color={item.status === "concluida" ? theme.warning : theme.success}
          />
          <Text
            style={[
              styles.acaoTexto,
              { color: item.status === "concluida" ? theme.warning : theme.success },
            ]}
          >
            {item.status === "concluida" ? "Reabrir" : "Concluir"}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  filtroWrap: { paddingHorizontal: 20, paddingTop: 16 },
  lista: { padding: 20, paddingBottom: 100 },
  linhaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: 15, fontWeight: "700", color: theme.text, flex: 1 },
  tituloConcluido: { textDecorationLine: "line-through", color: theme.textMuted },
  disciplina: { fontSize: 12, color: theme.primary, fontWeight: "600", marginTop: 2 },
  descricao: { fontSize: 13, color: theme.textMuted, marginTop: 6 },
  linhaBase: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  data: { fontSize: 12, color: theme.textMuted, fontWeight: "600" },
  acoes: { flexDirection: "row", gap: 8, marginTop: 12 },
  acaoBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  acaoTexto: { fontSize: 12, fontWeight: "700" },
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
