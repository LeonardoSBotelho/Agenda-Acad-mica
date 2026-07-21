import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BadgeProps {
  texto: string;
  corTexto: string;
  corFundo: string;
}

export function Badge({ texto, corTexto, corFundo }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: corFundo }]}>
      <Text style={[styles.texto, { color: corTexto }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  texto: {
    fontSize: 12,
    fontWeight: "700",
  },
});
