import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CORES_DISCIPLINA, NOME_COR, theme } from "../utils/colors";

interface ColorPickerProps {
  corSelecionada: string;
  onSelecionar: (cor: string) => void;
}

export function ColorPicker({ corSelecionada, onSelecionar }: ColorPickerProps) {
  return (
    <View style={styles.linha}>
      {CORES_DISCIPLINA.map((cor) => {
        const nome = NOME_COR[cor] ?? cor;
        const selecionada = corSelecionada === cor;
        return (
          <Pressable
            key={cor}
            onPress={() => onSelecionar(cor)}
            style={styles.item}
            accessibilityRole="radio"
            accessibilityLabel={`Cor ${nome}`}
            accessibilityState={{ selected: selecionada }}
          >
            <View style={[styles.bolinha, { backgroundColor: cor }]}>
              {selecionada ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
            </View>
            <Text style={[styles.nomeTexto, selecionada ? styles.nomeTextoSelecionado : null]}>
              {nome}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  item: { alignItems: "center", width: 56 },
  bolinha: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  nomeTexto: { fontSize: 10, color: theme.textMuted, marginTop: 4, textAlign: "center" },
  nomeTextoSelecionado: { color: theme.text, fontWeight: "700" },
});
