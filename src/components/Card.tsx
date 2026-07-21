import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../utils/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
}

export function Card({ children, style, accentColor, accessible, accessibilityLabel }: CardProps) {
  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
});
