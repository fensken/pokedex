import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#EE8130",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pokedex",
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          title: "Pokemon Details",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
