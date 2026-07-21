import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/colors";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  titulo: string;
  descricao?: string;
}

export function EmptyState({ icon, titulo, descricao }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.border} />
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textMuted,
    marginTop: 12,
    textAlign: "center",
  },
  descricao: {
    fontSize: 13,
    color: theme.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
});
