import { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useContractsStore } from "@/store/contractStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/theme";

const difficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "#4CAF50";
    case "Medium":
      return "#FFC107";
    case "Hard":
      return "#E53935";
    default:
      return "#999";
  }
};

export default function ContractsBoardScreen() {
  const { contracts, availableContracts, generateContracts, acceptContract } =
    useContractsStore();

  const available = availableContracts();

  useEffect(() => {
    if (contracts.length === 0) {
      generateContracts(4);
    }
  }, []);

  const handleGenerateMore = () => {
    generateContracts(5);
  };

  return (
    <SafeAreaView style={theme.commonStyles.pageContainer}>
      <Text style={styles.title}>Witcher Contracts</Text>

      <FlatList
        data={available}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No contracts available. Come back later.
          </Text>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={[theme.commonStyles.button, styles.generateButton]}
              onPress={handleGenerateMore}
            >
              <Text style={[theme.commonStyles.buttonText, { color: "black" }]}>
                Generate More Contracts
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const diffColor = difficultyColor(item.difficulty);

          return (
            <View style={styles.card}>
              {/* Header */}
              <View style={styles.rowBetween}>
                <Text style={styles.monster}>{item.monsterName}</Text>
                <Text style={[styles.difficulty, { color: diffColor }]}>
                  {item.difficulty}
                </Text>
              </View>

              {/* Location */}
              <Text style={styles.location}>📍 {item.location}</Text>

              {/* Meta */}
              <View style={[styles.rowBetween, { marginTop: 14 }]}>
                <Text style={styles.meta}>💰 {item.reward} crowns</Text>
                <Text style={styles.meta}>
                  🜂 Vulnerable to {item.vulnerability}
                </Text>
              </View>

              {/* Accept */}
              <TouchableOpacity
                style={[theme.commonStyles.button, { borderColor: diffColor }]}
                onPress={() => acceptContract(item.id)}
              >
                <Text
                  style={[theme.commonStyles.buttonText, { color: diffColor }]}
                >
                  Accept Contract
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

/* -------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    textAlign: "center",
    marginVertical: 20,
    color: "#F2C800",
    fontWeight: "700",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monster: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  difficulty: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  location: {
    marginTop: 6,
    color: "#aaa",
    fontSize: 14,
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    color: "#ccc",
    fontSize: 13,
  },
  generateButton: {
    marginTop: 10,
    marginBottom: 30,
    borderColor: "#555",
  },
  footer: {
    marginTop: 20,
  },
});
