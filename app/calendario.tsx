import React, { useCallback, useState } from "react";
import { View, Text, SectionList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../src/components/Card";
import { EmptyState } from "../src/components/EmptyState";
import { theme } from "../src/utils/colors";
import { atividadeService } from "../src/services/atividadeService";
import { provaService } from "../src/services/provaService";
import { disciplinaService } from "../src/services/disciplinaService";
import { Disciplina } from "../src/models/types";
import { isoParaBr, hojeIso } from "../src/utils/date";

type EventoTipo = "prova" | "atividade";

interface Evento {
  id: string;
  tipo: EventoTipo;
  titulo: string;
  data: string;
  detalhe: string;
  disciplina?: Disciplina;
}

interface Secao {
  title: string;
  data: Evento[];
}

export default function Calendario() {
  const [secoes, setSecoes] = useState<Secao[]>([]);

  const carregar = useCallback(async () => {
    const [provas, atividades, disciplinas] = await Promise.all([
      provaService.listar(),
      atividadeService.listar(),
      disciplinaService.listar(),
    ]);
    const mapa = new Map(disciplinas.map((d) => [d.id, d]));
    const hoje = hojeIso();

    const eventos: Evento[] = [
      ...provas
        .filter((p) => p.data >= hoje)
        .map((p) => ({
          id: `prova-${p.id}`,
          tipo: "prova" as const,
          titulo: p.conteudo || "Prova",
          data: p.data,
          detalhe: `${p.horario}${p.local ? " · " + p.local : ""}`,
          disciplina: mapa.get(p.disciplinaId),
        })),
      ...atividades
        .filter((a) => a.status === "pendente" && a.dataEntrega >= hoje)
        .map((a) => ({
          id: `atividade-${a.id}`,
          tipo: "atividade" as const,
          titulo: a.titulo,
          data: a.dataEntrega,
          detalhe: "Entrega de atividade",
          disciplina: mapa.get(a.disciplinaId),
        })),
    ].sort((a, b) => a.data.localeCompare(b.data));

    const grupos = new Map<string, Evento[]>();
    eventos.forEach((ev) => {
      const lista = grupos.get(ev.data) ?? [];
      lista.push(ev);
      grupos.set(ev.data, lista);
    });

    const secoesMontadas: Secao[] = Array.from(grupos.entries()).map(([data, itens]) => ({
      title: isoParaBr(data),
      data: itens,
    }));

    setSecoes(secoesMontadas);
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={secoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            titulo="Nenhum compromisso futuro"
            descricao="Provas e atividades pendentes aparecerão aqui"
          />
        }
        renderSectionHeader={({ section }) => (
          <Text style={styles.secaoData}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <Card accentColor={item.disciplina?.cor}>
            <View style={styles.linha}>
              <View
                style={[
                  styles.iconeWrap,
                  { backgroundColor: item.tipo === "prova" ? theme.dangerBg : theme.primaryLight },
                ]}
              >
                <Ionicons
                  name={item.tipo === "prova" ? "document-text-outline" : "checkbox-outline"}
                  size={18}
                  color={item.tipo === "prova" ? theme.danger : theme.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.disciplina}>{item.disciplina?.nome ?? "Sem disciplina"}</Text>
                <Text style={styles.detalhe}>{item.detalhe}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  lista: { padding: 20, paddingBottom: 40 },
  secaoData: {
    fontSize: 13,
    fontWeight: "800",
    color: theme.primary,
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  linha: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconeWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: { fontSize: 14, fontWeight: "700", color: theme.text },
  disciplina: { fontSize: 12, color: theme.primary, fontWeight: "600", marginTop: 2 },
  detalhe: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
});
