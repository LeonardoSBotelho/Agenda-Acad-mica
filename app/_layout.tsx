import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "../src/utils/colors";
import { ToastProvider } from "../src/components/Toast";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.surface },
            headerTitleStyle: { fontWeight: "700", color: theme.text },
            headerTintColor: theme.primary,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Agenda Acadêmica" }} />
          <Stack.Screen name="disciplinas/index" options={{ title: "Disciplinas" }} />
          <Stack.Screen name="disciplinas/form" options={{ title: "Disciplina" }} />
          <Stack.Screen name="atividades/index" options={{ title: "Atividades" }} />
          <Stack.Screen name="atividades/form" options={{ title: "Atividade" }} />
          <Stack.Screen name="provas/index" options={{ title: "Provas" }} />
          <Stack.Screen name="provas/form" options={{ title: "Prova" }} />
          <Stack.Screen name="notas/index" options={{ title: "Notas", headerShown: false }} />
          <Stack.Screen name="notas/form" options={{ title: "Lançar Nota" }} />
          <Stack.Screen name="calendario" options={{ title: "Calendário" }} />
          <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
        </Stack>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}
