import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Contract, useContractsStore } from "@/store/contractStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/theme";
import { useRouter } from "expo-router";

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
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const { contracts, availableContracts, generateContracts, acceptContract } =
    useContractsStore();

  const router = useRouter();

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
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSelectedContract(item)}
            >
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
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Modal
        visible={!!selectedContract}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedContract(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedContract && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedContract.monsterName}
                </Text>

                <Text style={styles.modalText}>
                  📍 Location: {selectedContract.location}
                </Text>

                <Text style={styles.modalText}>
                  🜂 Vulnerable to: {selectedContract.vulnerability}
                </Text>

                <Text style={styles.modalText}>
                  💰 Reward: {selectedContract.reward} crowns
                </Text>

                <Text
                  style={[
                    styles.modalDifficulty,
                    {
                      color: difficultyColor(selectedContract.difficulty),
                    },
                  ]}
                >
                  {selectedContract.difficulty}
                </Text>

                {/* Actions */}
                <TouchableOpacity
                  style={[
                    theme.commonStyles.button,
                    {
                      borderColor: difficultyColor(selectedContract.difficulty),
                    },
                  ]}
                  onPress={() => {
                    acceptContract(selectedContract.id);

                    router.push({
                      pathname: "/encounter",
                      params: {
                        contractId: selectedContract.id,
                        monsterName: selectedContract.monsterName,
                        vulnerability: selectedContract.vulnerability,
                        difficulty: selectedContract.difficulty,
                      },
                    });

                    setSelectedContract(null);
                  }}
                >
                  <Text style={theme.commonStyles.buttonText}>
                    Accept Contract
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[theme.commonStyles.button, styles.cancelButton]}
                  onPress={() => setSelectedContract(null)}
                >
                  <Text style={theme.commonStyles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* -------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    textAlign: "center",
    marginVertical: 20,
    color: theme.colorDarkerRed,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333",
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F2C800",
    marginBottom: 12,
    textAlign: "center",
  },

  modalText: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 6,
  },

  modalDifficulty: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  cancelButton: {
    marginTop: 10,
    borderColor: "#555",
  },
});
