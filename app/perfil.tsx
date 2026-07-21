import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../src/components/Input";
import { Button } from "../src/components/Button";
import { theme } from "../src/utils/colors";
import { perfilService } from "../src/services/perfilService";

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [matricula, setMatricula] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    perfilService.obter().then((perfil) => {
      setNome(perfil.nome);
      setCurso(perfil.curso);
      setMatricula(perfil.matricula);
      setInstituicao(perfil.instituicao);
    });
  }, []);

  async function salvar() {
    setSalvando(true);
    try {
      await perfilService.salvar({ nome, curso, matricula, instituicao });
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o perfil.");
    } finally {
      setSalvando(false);
    }
  }

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          {iniciais ? (
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          ) : (
            <Ionicons name="person-outline" size={32} color="#FFFFFF" />
          )}
        </View>
      </View>

      <Input label="Nome completo" placeholder="Seu nome" value={nome} onChangeText={setNome} />
      <Input label="Curso" placeholder="Ex: Engenharia de Software" value={curso} onChangeText={setCurso} />
      <Input label="Matrícula" placeholder="Número de matrícula" value={matricula} onChangeText={setMatricula} />
      <Input
        label="Instituição"
        placeholder="Nome da faculdade/universidade"
        value={instituicao}
        onChangeText={setInstituicao}
      />

      <Button
        label={salvando ? "Salvando..." : "Salvar perfil"}
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
  avatarWrap: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
});
