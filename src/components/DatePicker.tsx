import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/colors";
import { isoParaBr } from "../utils/date";

interface DatePickerProps {
  label: string;
  valorIso: string; // "" quando nada selecionado
  onSelecionar: (iso: string) => void;
  erro?: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function diasNoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate();
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function DatePicker({ label, valorIso, onSelecionar, erro }: DatePickerProps) {
  const hoje = new Date();
  const selecionada = valorIso ? new Date(valorIso + "T00:00:00") : null;
  const [aberto, setAberto] = useState(false);
  const [anoVisivel, setAnoVisivel] = useState(selecionada ? selecionada.getFullYear() : hoje.getFullYear());
  const [mesVisivel, setMesVisivel] = useState(selecionada ? selecionada.getMonth() : hoje.getMonth());
  const [rascunho, setRascunho] = useState(valorIso);

  function abrir() {
    setRascunho(valorIso);
    if (selecionada) {
      setAnoVisivel(selecionada.getFullYear());
      setMesVisivel(selecionada.getMonth());
    }
    setAberto(true);
  }

  function irParaMesAnterior() {
    if (mesVisivel === 0) {
      setMesVisivel(11);
      setAnoVisivel((a) => a - 1);
    } else {
      setMesVisivel((m) => m - 1);
    }
  }

  function irParaProximoMes() {
    if (mesVisivel === 11) {
      setMesVisivel(0);
      setAnoVisivel((a) => a + 1);
    } else {
      setMesVisivel((m) => m + 1);
    }
  }

  function confirmar() {
    if (rascunho) onSelecionar(rascunho);
    setAberto(false);
  }

  const primeiroDiaSemana = new Date(anoVisivel, mesVisivel, 1).getDay();
  const totalDias = diasNoMes(anoVisivel, mesVisivel);
  const celulas: (number | null)[] = [
    ...Array(primeiroDiaSemana).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.campo, erro ? styles.campoErro : null]}
        onPress={abrir}
        accessibilityRole="button"
        accessibilityLabel={`${label}. ${valorIso ? `Data selecionada: ${isoParaBr(valorIso)}` : "Nenhuma data selecionada"}`}
      >
        <Ionicons name="calendar-outline" size={18} color={theme.primary} />
        <Text style={[styles.campoTexto, !valorIso ? styles.placeholder : null]}>
          {valorIso ? isoParaBr(valorIso) : "Selecionar data"}
        </Text>
        <Ionicons name={aberto ? "chevron-up" : "chevron-down"} size={18} color={theme.textMuted} />
      </Pressable>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      {aberto ? (
        <View style={styles.calendario}>
          <View style={styles.calendarioTopo}>
            <Pressable onPress={() => setAberto(false)} accessibilityLabel="Cancelar seleção de data">
              <Text style={styles.acaoTexto}>Cancelar</Text>
            </Pressable>
            <Text style={styles.tituloCalendario}>Selecionar data</Text>
            <Pressable onPress={confirmar} accessibilityLabel="Confirmar data selecionada">
              <Text style={[styles.acaoTexto, styles.acaoConfirmar]}>OK</Text>
            </Pressable>
          </View>

          <View style={styles.navegacaoMes}>
            <Pressable
              onPress={irParaMesAnterior}
              hitSlop={10}
              accessibilityLabel="Mês anterior"
            >
              <Ionicons name="chevron-back" size={20} color={theme.text} />
            </Pressable>
            <Text style={styles.mesAno}>
              {MESES[mesVisivel]} {anoVisivel}
            </Text>
            <Pressable onPress={irParaProximoMes} hitSlop={10} accessibilityLabel="Próximo mês">
              <Ionicons name="chevron-forward" size={20} color={theme.text} />
            </Pressable>
          </View>

          <View style={styles.semanaCabecalho}>
            {DIAS_SEMANA.map((dia) => (
              <Text key={dia} style={styles.diaSemanaTexto}>
                {dia}
              </Text>
            ))}
          </View>

          <View style={styles.grade}>
            {celulas.map((dia, index) => {
              if (dia === null) {
                return <View key={`vazio-${index}`} style={styles.celula} />;
              }
              const iso = `${anoVisivel}-${pad2(mesVisivel + 1)}-${pad2(dia)}`;
              const estaSelecionado = iso === rascunho;
              return (
                <Pressable
                  key={iso}
                  style={styles.celula}
                  onPress={() => setRascunho(iso)}
                  accessibilityRole="button"
                  accessibilityLabel={`Dia ${dia} de ${MESES[mesVisivel]}`}
                  accessibilityState={{ selected: estaSelecionado }}
                >
                  <View style={[styles.diaCirculo, estaSelecionado ? styles.diaCirculoSelecionado : null]}>
                    <Text style={[styles.diaTexto, estaSelecionado ? styles.diaTextoSelecionado : null]}>
                      {dia}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: theme.text, marginBottom: 6 },
  campo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: theme.surface,
  },
  campoErro: { borderColor: theme.danger },
  campoTexto: { flex: 1, fontSize: 15, color: theme.text, fontWeight: "600" },
  placeholder: { color: theme.primary, fontWeight: "600" },
  erro: { fontSize: 12, color: theme.danger, marginTop: 4 },
  calendario: {
    marginTop: 10,
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 14,
  },
  calendarioTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tituloCalendario: { fontSize: 14, fontWeight: "700", color: theme.text },
  acaoTexto: { fontSize: 14, color: theme.textMuted, fontWeight: "600" },
  acaoConfirmar: { color: theme.primary, fontWeight: "700" },
  navegacaoMes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  mesAno: { fontSize: 15, fontWeight: "700", color: theme.text },
  semanaCabecalho: { flexDirection: "row" },
  diaSemanaTexto: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: theme.textMuted,
    marginBottom: 6,
  },
  grade: { flexDirection: "row", flexWrap: "wrap" },
  celula: { width: `${100 / 7}%`, alignItems: "center", paddingVertical: 3 },
  diaCirculo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  diaCirculoSelecionado: { backgroundColor: theme.primary },
  diaTexto: { fontSize: 13, color: theme.text, fontWeight: "600" },
  diaTextoSelecionado: { color: "#FFFFFF", fontWeight: "800" },
});
