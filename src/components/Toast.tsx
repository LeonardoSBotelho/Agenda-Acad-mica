import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/colors";

type ToastTipo = "sucesso" | "erro";

interface ToastState {
  visivel: boolean;
  mensagem: string;
  tipo: ToastTipo;
}

interface ToastContextValue {
  mostrarToast: (mensagem: string, tipo?: ToastTipo) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<ToastState>({
    visivel: false,
    mensagem: "",
    tipo: "sucesso",
  });
  const opacidade = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const esconder = useCallback(() => {
    Animated.timing(opacidade, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setEstado((s) => ({ ...s, visivel: false })));
  }, [opacidade]);

  const mostrarToast = useCallback(
    (mensagem: string, tipo: ToastTipo = "sucesso") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setEstado({ visivel: true, mensagem, tipo });
      opacidade.setValue(0);
      Animated.timing(opacidade, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      timeoutRef.current = setTimeout(esconder, 2200);
    },
    [opacidade, esconder]
  );

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      {estado.visivel ? (
        <Animated.View
          style={[styles.container, { opacity: opacidade }]}
          accessible
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          <View
            style={[
              styles.toast,
              { backgroundColor: estado.tipo === "sucesso" ? theme.text : theme.danger },
            ]}
          >
            <Ionicons
              name={estado.tipo === "sucesso" ? "checkmark-circle" : "alert-circle"}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.texto}>{estado.mensagem}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback seguro caso o provider não esteja montado (ex.: testes isolados)
    return { mostrarToast: () => {} };
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 32,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
    maxWidth: "100%",
  },
  texto: { color: "#FFFFFF", fontSize: 13, fontWeight: "600", flexShrink: 1 },
});
