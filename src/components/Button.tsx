import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../utils/colors";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  style?: ViewStyle;
  icon?: React.ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  style,
  icon,
  disabled,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && !disabled ? { opacity: 0.8 } : null,
        disabled ? { opacity: 0.5 } : null,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, variant === "outline" ? { color: theme.primary } : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: theme.primary },
  secondary: { backgroundColor: theme.textMuted },
  danger: { backgroundColor: theme.danger },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: theme.primary },
};
