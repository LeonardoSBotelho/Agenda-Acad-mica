import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/Card";
import { Badge } from "../../src/components/Badge";
import { EmptyState } from "../../src/components/EmptyState";
import { theme } from "../../src/utils/colors";
import { disciplinaService } from "../../src/services/disciplinaService";
import { notaService } from "../../src/services/notaService";
import { Disciplina, Nota } from "../../src/models/types";
import { calcularSituacao, corSituacao } from "../../src/utils/media";

interface LinhaDisciplina {
  disciplina: Disciplina;
  nota?: Nota;
}

export default function ListaNotas() {
  const router = useRouter();
  const [linhas, setLinhas] = useState<LinhaDisciplina[]>([]);

  const carregar = useCallback(async () => {
    const [disciplinas, notas] = await Promise.all([
      disciplinaService.listar(),
      notaService.listar(),
    ]);
    const mapaNotas = new Map(notas.map((n) => [n.disciplinaId, n]));
    setLinhas(disciplinas.map((d) => ({ disciplina: d, nota: mapaNotas.get(d.id) })));
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.voltarBotao}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View style={styles.cabecalhoTextos}>
          <Text style={styles.cabecalhoTitulo}>Minhas Notas</Text>
          <Text style={styles.cabecalhoSubtitulo}>Acompanhe seu desempenho por disciplina</Text>
        </View>
        <View style={styles.cabecalhoIconeWrap} accessibilityElementsHidden importantForAccessibility="no">
          <Ionicons name="school-outline" size={22} color="#FFFFFF" />
        </View>
      </View>

      <FlatList
        data={linhas}
        keyExtractor={(item) => item.disciplina.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <EmptyState
            icon="school-outline"
            titulo="Nenhuma disciplina cadastrada"
            descricao="Cadastre disciplinas para poder lançar notas"
          />
        }
        renderItem={({ item }) => {
          const situacao = item.nota ? calcularSituacao(item.nota.media) : null;
          const cores = situacao ? corSituacao(situacao) : null;
          return (
            <Pressable
              onPress={() => router.push(`/notas/form?disciplinaId=${item.disciplina.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`${item.disciplina.nome}. ${
                situacao ? `Situação: ${situacao}, média ${item.nota?.media.toFixed(1)}` : "Sem notas lançadas"
              }`}
            >
              <Card accentColor={item.disciplina.cor}>
                <View style={styles.linhaTopo}>
                  <Text style={styles.nome}>{item.disciplina.nome}</Text>
                  {situacao && cores ? (
                    <Badge texto={situacao} corTexto={cores.text} corFundo={cores.bg} />
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                  )}
                </View>
                {item.nota ? (
                  <View style={styles.notasGrade}>
                    <NotaBox label="Nota 1" valor={item.nota.nota1} />
                    <NotaBox label="Nota 2" valor={item.nota.nota2} />
                    <NotaBox label="Trabalho" valor={item.nota.trabalho} />
                    <NotaBox label="Média" valor={item.nota.media} destaque />
                  </View>
                ) : (
                  <Text style={styles.semNota}>Toque para lançar as notas</Text>
                )}
              </Card>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function NotaBox({ label, valor, destaque }: { label: string; valor: number; destaque?: boolean }) {
  return (
    <View style={styles.notaBox}>
      <Text style={styles.notaLabel}>{label}</Text>
      <Text style={[styles.notaValor, destaque ? { color: theme.primary } : null]}>
        {valor.toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  cabecalho: {
    backgroundColor: theme.primary,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  voltarBotao: { marginRight: 8, marginTop: 2 },
  cabecalhoTextos: { flex: 1, paddingRight: 12 },
  cabecalhoTitulo: { fontSize: 24, fontWeight: "800", color: "#FFFFFF" },
  cabecalhoSubtitulo: { fontSize: 13, color: "#E0E7FF", marginTop: 4 },
  cabecalhoIconeWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  lista: { padding: 20, paddingTop: 16, paddingBottom: 40 },
  linhaTopo: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nome: { fontSize: 16, fontWeight: "700", color: theme.text },
  semNota: { fontSize: 13, color: theme.textMuted, marginTop: 8 },
  notasGrade: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
    marginHorizontal: -8,
  },
  notaBox: {
    width: "50%",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  notaLabel: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
  notaValor: { fontSize: 20, fontWeight: "800", color: theme.text },
});
