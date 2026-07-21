import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { theme } from "../utils/colors";

interface InputProps extends TextInputProps {
  label: string;
  erro?: string;
}

export function Input({ label, erro, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, erro ? styles.inputErro : null, style]}
        placeholderTextColor={theme.textMuted}
        {...props}
      />
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
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: theme.text,
    backgroundColor: theme.surface,
  },
  inputErro: {
    borderColor: theme.danger,
  },
  erro: {
    fontSize: 12,
    color: theme.danger,
    marginTop: 4,
  },
});
