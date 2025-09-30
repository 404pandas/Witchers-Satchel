import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TalleyerScreen() {
  const router = useRouter();
  const [talley, setTalley] = useState(0);

  return (
    <View style={theme.commonStyles.pageContainer}>
      <TouchableOpacity onPress={() => router.navigate("/")}>
        <Text style={theme.commonStyles.link}>Return to the tavern</Text>
      </TouchableOpacity>
      <View style={styles.buttonRow}>
        <Text style={theme.commonStyles.boldTitle}>Monster Trophies</Text>
        <FontAwesome
          name="question-circle-o"
          size={24}
          onPress={() => router.navigate("/bestiary")}
          color={theme.colorDarkBlue}
        />
      </View>

      <View style={styles.talleyContainer}>
        <MaterialCommunityIcons
          name="skull"
          size={32}
          color={theme.colorBlack}
        />
        <Text style={styles.talley}>{talley}</Text>
        <MaterialCommunityIcons
          name="skull"
          size={32}
          color={theme.colorBlack}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[theme.commonStyles.button, styles.decrement]}
          onPress={() => setTalley((c) => Math.max(0, c - 1))}
        >
          <MaterialCommunityIcons
            name="sword"
            size={24}
            color={theme.colorWhite}
          />
          <Text style={theme.commonStyles.buttonText}>Slay Fewer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.commonStyles.button, styles.reset]}
          onPress={() => setTalley(0)}
        >
          <FontAwesome name="beer" size={24} color={theme.colorWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.commonStyles.button, styles.increment]}
          onPress={() => setTalley((c) => c + 1)}
        >
          <MaterialCommunityIcons
            name="sword-cross"
            size={24}
            color={theme.colorWhite}
          />
          <Text style={theme.commonStyles.buttonText}>Slay More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  talleyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  talley: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colorRed,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  increment: {
    backgroundColor: theme.colorRed,
  },
  decrement: {
    backgroundColor: theme.colorBlack,
  },
  reset: {
    backgroundColor: theme.colorLightRed,
  },
});
