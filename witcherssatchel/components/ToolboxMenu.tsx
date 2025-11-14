// components/ToolboxMenu.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

export function ToolboxMenu({ onClose }) {
  const router = useRouter();

  const items = [
    {
      label: "Satchel",
      icon: <Ionicons name="bag" size={22} />,
      route: "/(home)",
    },
    {
      label: "Talley",
      icon: <MaterialIcons name="library-add" size={22} />,
      route: "/talley",
    },
    {
      label: "Timer",
      icon: <Ionicons name="timer" size={22} />,
      route: "/countdownTimer",
    },
    {
      label: "Calculator",
      icon: <Entypo name="calculator" size={22} />,
      route: "/calculator",
    },
    {
      label: "Weather",
      icon: <Ionicons name="partly-sunny-outline" size={22} />,
      route: "/weather",
    },
  ];

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <View style={styles.menu}>
        {items.map((item) => (
          <Pressable
            key={item.label}
            style={styles.row}
            onPress={() => {
              router.push(item.route);
              onClose();
            }}
          >
            {item.icon}
            <Text style={styles.text}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: 180,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  text: {
    fontSize: 16,
  },
});
