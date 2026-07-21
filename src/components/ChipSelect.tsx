import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { theme } from "../utils/colors";

interface Opcao {
  valor: string;
  rotulo: string;
  cor?: string;
}

interface ChipSelectProps {
  label: string;
  opcoes: Opcao[];
  valorSelecionado: string;
  onSelecionar: (valor: string) => void;
  erro?: string;
}

export function ChipSelect({
  label,
  opcoes,
  valorSelecionado,
  onSelecionar,
  erro,
}: ChipSelectProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.linha}>
          {opcoes.map((opcao) => {
            const selecionado = opcao.valor === valorSelecionado;
            const corBase = opcao.cor ?? theme.primary;
            return (
              <Pressable
                key={opcao.valor}
                onPress={() => onSelecionar(opcao.valor)}
                accessibilityRole="radio"
                accessibilityLabel={opcao.rotulo}
                accessibilityState={{ selected: selecionado }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selecionado ? corBase : theme.primaryLight,
                    borderColor: corBase,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipTexto,
                    { color: selecionado ? "#FFFFFF" : corBase },
                  ]}
                >
                  {opcao.rotulo}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.text,
    marginBottom: 8,
  },
  linha: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: "600",
  },
  erro: {
    fontSize: 12,
    color: theme.danger,
    marginTop: 4,
  },
});
