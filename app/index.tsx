import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../src/components/Card";
import { theme } from "../src/utils/colors";
import { disciplinaService } from "../src/services/disciplinaService";
import { atividadeService } from "../src/services/atividadeService";
import { provaService } from "../src/services/provaService";
import { notaService } from "../src/services/notaService";
import { Disciplina, Prova, Atividade } from "../src/models/types";
import { isoParaBr, ordenarPorDataAsc, hojeIso, textoRelativo, diasAteHoje } from "../src/utils/date";

interface Resumo {
  totalDisciplinas: number;
  atividadesPendentes: number;
  proximaProva: (Prova & { disciplina?: Disciplina }) | null;
  proximaAtividade: (Atividade & { disciplina?: Disciplina }) | null;
  mediaGeral: number | null;
}

const MENU = [
  { rota: "/calendario", label: "Calendário", descricao: "Ver agenda", icon: "calendar-outline" as const },
  { rota: "/perfil", label: "Perfil", descricao: "Ver informações", icon: "person-outline" as const },
  { rota: "/notas", label: "Notas", descricao: "Ver desempenho", icon: "stats-chart-outline" as const },
];

export default function Home() {
  const router = useRouter();
  const [resumo, setResumo] = useState<Resumo>({
    totalDisciplinas: 0,
    atividadesPendentes: 0,
    proximaProva: null,
    proximaAtividade: null,
    mediaGeral: null,
  });

  const carregar = useCallback(async () => {
    const [disciplinas, atividades, provas, notas] = await Promise.all([
      disciplinaService.listar(),
      atividadeService.listar(),
      provaService.listar(),
      notaService.listar(),
    ]);

    const mapaDisciplinas = new Map(disciplinas.map((d) => [d.id, d]));
    const hoje = hojeIso();

    const provasFuturas = ordenarPorDataAsc(provas.filter((p) => p.data >= hoje));
    const proximaProvaBase = provasFuturas[0];
    const proximaProva = proximaProvaBase
      ? { ...proximaProvaBase, disciplina: mapaDisciplinas.get(proximaProvaBase.disciplinaId) }
      : null;

    const atividadesPendentesLista = atividades.filter((a) => a.status === "pendente");
    const atividadesFuturas = ordenarPorDataAsc(atividadesPendentesLista);
    const proximaAtividadeBase = atividadesFuturas[0];
    const proximaAtividade = proximaAtividadeBase
      ? {
          ...proximaAtividadeBase,
          disciplina: mapaDisciplinas.get(proximaAtividadeBase.disciplinaId),
        }
      : null;

    const mediaGeral =
      notas.length > 0
        ? Math.round((notas.reduce((soma, n) => soma + n.media, 0) / notas.length) * 100) / 100
        : null;

    setResumo({
      totalDisciplinas: disciplinas.length,
      atividadesPendentes: atividadesPendentesLista.length,
      proximaProva,
      proximaAtividade,
      mediaGeral,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá 👋</Text>
          <Text style={styles.subtitulo}>Aqui está um resumo da sua vida acadêmica.</Text>
        </View>
        <Pressable
          style={styles.sinoWrap}
          onPress={() => router.push("/atividades")}
          accessibilityRole="button"
          accessibilityLabel={`Notificações. ${resumo.atividadesPendentes} atividades pendentes`}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
          {resumo.atividadesPendentes > 0 ? <View style={styles.sinoBadge} /> : null}
        </Pressable>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="book-outline"
          valor={String(resumo.totalDisciplinas)}
          label="Disciplinas"
          detalhe="Ativas no período"
          cor={theme.primary}
          onPress={() => router.push("/disciplinas")}
        />
        <StatCard
          icon="clipboard-outline"
          valor={String(resumo.atividadesPendentes)}
          label="Tarefas Pendentes"
          detalhe="Para concluir"
          cor={theme.warning}
          onPress={() => router.push("/atividades")}
        />
        <StatCard
          icon="trending-up-outline"
          valor={resumo.mediaGeral !== null ? resumo.mediaGeral.toFixed(1) : "—"}
          label="Média Geral"
          detalhe="Em 10,0"
          cor={theme.success}
          onPress={() => router.push("/notas")}
        />
        <StatCard
          icon="calendar-outline"
          valor={
            resumo.proximaProva ? String(Math.max(diasAteHoje(resumo.proximaProva.data), 0)) : "—"
          }
          label="Próxima Prova"
          detalhe="Dias restantes"
          cor={theme.primary}
          onPress={() => router.push("/provas")}
        />
      </View>

      {resumo.proximaProva ? (
        <Pressable
          onPress={() => router.push(`/provas/form?id=${resumo.proximaProva!.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Próxima prova: ${resumo.proximaProva.disciplina?.nome ?? "Disciplina"}, ${isoParaBr(
            resumo.proximaProva.data
          )}`}
        >
          <View style={styles.destaqueCard}>
            <View style={styles.destaqueIconWrap}>
              <Ionicons name="school-outline" size={26} color={theme.primary} />
            </View>
            <View style={styles.destaqueTextos}>
              <Text style={styles.destaqueRotulo}>PRÓXIMA PROVA</Text>
              <Text style={styles.destaqueTitulo}>
                {resumo.proximaProva.disciplina?.nome ?? "Disciplina"}
              </Text>
              <View style={styles.destaqueLinha}>
                <Ionicons name="calendar-outline" size={13} color={theme.textMuted} />
                <Text style={styles.destaqueMeta}>{isoParaBr(resumo.proximaProva.data)}</Text>
                <Ionicons name="time-outline" size={13} color={theme.textMuted} style={{ marginLeft: 6 }} />
                <Text style={styles.destaqueMeta}>{resumo.proximaProva.horario}</Text>
              </View>
              <View style={styles.destaquePill}>
                <Text style={styles.destaquePillTexto}>{textoRelativo(resumo.proximaProva.data)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        </Pressable>
      ) : (
        <>
          <Text style={styles.secaoTitulo}>Próxima prova</Text>
          <Card>
            <Text style={styles.vazio}>Nenhuma prova agendada</Text>
          </Card>
        </>
      )}

      <Text style={styles.secaoTitulo}>Próxima atividade</Text>
      {resumo.proximaAtividade ? (
        <Pressable
          onPress={() => router.push(`/atividades/form?id=${resumo.proximaAtividade!.id}`)}
          accessibilityRole="button"
          accessibilityLabel={`Próxima atividade: ${resumo.proximaAtividade.titulo}`}
        >
          <Card accentColor={resumo.proximaAtividade.disciplina?.cor}>
            <Text style={styles.itemTitulo}>{resumo.proximaAtividade.titulo}</Text>
            <Text style={styles.itemDetalhe}>
              {resumo.proximaAtividade.disciplina?.nome ?? "Disciplina"}
            </Text>
            <Text style={styles.itemData}>
              Entrega: {isoParaBr(resumo.proximaAtividade.dataEntrega)} ·{" "}
              {textoRelativo(resumo.proximaAtividade.dataEntrega)}
            </Text>
          </Card>
        </Pressable>
      ) : (
        <Card>
          <Text style={styles.vazio}>Nenhuma atividade pendente</Text>
        </Card>
      )}

      <Text style={styles.secaoTitulo}>Acesso rápido</Text>
      <View style={styles.menuGrid}>
        {MENU.map((item) => (
          <Pressable
            key={item.rota}
            style={styles.menuItem}
            onPress={() => router.push(item.rota as any)}
            accessibilityRole="button"
            accessibilityLabel={`${item.label}. ${item.descricao}`}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name={item.icon} size={22} color={theme.primary} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDescricao}>{item.descricao}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function StatCard({
  icon,
  valor,
  label,
  detalhe,
  cor,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  valor: string;
  label: string;
  detalhe: string;
  cor: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.statCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${valor}. ${detalhe}`}
    >
      <View style={[styles.statIconWrap, { backgroundColor: cor + "1A" }]}>
        <Ionicons name={icon} size={20} color={cor} />
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValor}>{valor}</Text>
      <Text style={styles.statDetalhe}>{detalhe}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  conteudo: { padding: 20, paddingBottom: 40 },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  saudacao: { fontSize: 24, fontWeight: "800", color: theme.text },
  subtitulo: { fontSize: 14, color: theme.textMuted, marginTop: 4, maxWidth: 260 },
  sinoWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
  },
  sinoBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: "47%",
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statLabel: { fontSize: 13, fontWeight: "600", color: theme.text },
  statValor: { fontSize: 26, fontWeight: "800", color: theme.text, marginTop: 6 },
  statDetalhe: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  destaqueCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: theme.surface,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  destaqueIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  destaqueTextos: { flex: 1 },
  destaqueRotulo: { fontSize: 11, fontWeight: "700", color: theme.primary, letterSpacing: 0.5 },
  destaqueTitulo: { fontSize: 17, fontWeight: "800", color: theme.text, marginTop: 4 },
  destaqueLinha: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  destaqueMeta: { fontSize: 12, color: theme.textMuted },
  destaquePill: {
    alignSelf: "flex-start",
    backgroundColor: theme.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 10,
  },
  destaquePillTexto: { fontSize: 12, fontWeight: "700", color: theme.primary },
  secaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.text,
    marginTop: 20,
    marginBottom: 10,
  },
  itemTitulo: { fontSize: 15, fontWeight: "700", color: theme.text },
  itemDetalhe: { fontSize: 13, color: theme.textMuted, marginTop: 2 },
  itemData: { fontSize: 12, color: theme.primary, marginTop: 8, fontWeight: "600" },
  vazio: { fontSize: 13, color: theme.textMuted, textAlign: "center" },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  menuItem: {
    width: "31%",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  menuLabel: { fontSize: 13, fontWeight: "700", color: theme.text, textAlign: "center" },
  menuDescricao: { fontSize: 10, color: theme.textMuted, textAlign: "center", marginTop: 2 },
});
