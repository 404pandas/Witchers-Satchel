import { Link, Stack } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TalleyRouting() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Talley",
          headerShown: false,
          headerRight: () => {
            return (
              <Link href="/talley/history" asChild>
                <MaterialIcons
                  name="format-list-bulleted"
                  size={24}
                  color="black"
                />
              </Link>
            );
          },
        }}
      ></Stack.Screen>
    </Stack>
  );
}
