import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Alert, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "../../src/components/Input";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { useToast } from "../../src/components/Toast";
import { theme } from "../../src/utils/colors";
import { notaService } from "../../src/services/notaService";
import { disciplinaService } from "../../src/services/disciplinaService";
import { Disciplina } from "../../src/models/types";
import {
  calcularMedia,
  calcularSituacao,
  corSituacao,
  sanitizarDigitacaoNota,
} from "../../src/utils/media";

export default function FormNota() {
  const router = useRouter();
  const { disciplinaId } = useLocalSearchParams<{ disciplinaId: string }>();
  const { mostrarToast } = useToast();

  const [disciplina, setDisciplina] = useState<Disciplina | undefined>();
  const [notaExistenteId, setNotaExistenteId] = useState<string | undefined>();
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");
  const [trabalho, setTrabalho] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!disciplinaId) return;
    disciplinaService.buscarPorId(disciplinaId).then(setDisciplina);
    notaService.buscarPorDisciplina(disciplinaId).then((nota) => {
      if (nota) {
        setNotaExistenteId(nota.id);
        setNota1(String(nota.nota1));
        setNota2(String(nota.nota2));
        setTrabalho(String(nota.trabalho));
      }
    });
  }, [disciplinaId]);

  const n1 = parseFloat(nota1.replace(",", ".")) || 0;
  const n2 = parseFloat(nota2.replace(",", ".")) || 0;
  const nt = parseFloat(trabalho.replace(",", ".")) || 0;
  const mediaPreview = calcularMedia(n1, n2, nt);
  const situacaoPreview = calcularSituacao(mediaPreview);
  const coresPreview = corSituacao(situacaoPreview);

  function validarNota(valor: string): boolean {
    if (valor.trim() === "") return true;
    const num = parseFloat(valor.replace(",", "."));
    return !isNaN(num) && num >= 0 && num <= 10;
  }

  async function salvar() {
    if (!validarNota(nota1) || !validarNota(nota2) || !validarNota(trabalho)) {
      setErro("As notas devem estar entre 0 e 10");
      return;
    }
    if (!disciplinaId) return;
    setErro("");
    setSalvando(true);
    try {
      await notaService.salvar({ disciplinaId, nota1: n1, nota2: n2, trabalho: nt }, notaExistenteId);
      mostrarToast("Notas salvas com sucesso");
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar as notas.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.disciplinaNome}>{disciplina?.nome ?? "Disciplina"}</Text>

      <Input
        label="Nota 1"
        placeholder="0,0 a 10,0"
        value={nota1}
        onChangeText={(v) => setNota1(sanitizarDigitacaoNota(v))}
        keyboardType="decimal-pad"
        accessibilityLabel="Nota 1, de 0 a 10"
      />
      <Input
        label="Nota 2"
        placeholder="0,0 a 10,0"
        value={nota2}
        onChangeText={(v) => setNota2(sanitizarDigitacaoNota(v))}
        keyboardType="decimal-pad"
        accessibilityLabel="Nota 2, de 0 a 10"
      />
      <Input
        label="Trabalho"
        placeholder="0,0 a 10,0"
        value={trabalho}
        onChangeText={(v) => setTrabalho(sanitizarDigitacaoNota(v))}
        keyboardType="decimal-pad"
        erro={erro}
        accessibilityLabel="Nota do trabalho, de 0 a 10"
      />

      <Card style={styles.previaCard}>
        <View style={styles.previaLinha}>
          <Text style={styles.previaLabel}>Média calculada</Text>
          <Text style={styles.previaMedia}>{mediaPreview.toFixed(1)}</Text>
        </View>
        <View style={[styles.situacaoBadge, { backgroundColor: coresPreview.bg }]}>
          <Text style={[styles.situacaoTexto, { color: coresPreview.text }]}>
            {situacaoPreview}
          </Text>
        </View>
      </Card>

      <Button
        label={salvando ? "Salvando..." : "Salvar notas"}
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
  disciplinaNome: { fontSize: 18, fontWeight: "800", color: theme.text, marginBottom: 20 },
  previaCard: { alignItems: "center", marginBottom: 20 },
  previaLinha: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  previaLabel: { fontSize: 13, color: theme.textMuted },
  previaMedia: { fontSize: 32, fontWeight: "800", color: theme.text },
  situacaoBadge: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  situacaoTexto: { fontSize: 13, fontWeight: "700" },
});
