import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { theme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { RollHistoryRecord } from "@/types/diceTypes";

export default function DiceHistoryScreen() {
  const [rollHistory, setRollHistory] = useState<RollHistoryRecord[]>([]);

  const clearHistory = async () => {
    await saveToStorage("dice-roller-store", {
      state: { rollHistory: [] },
    });
    setRollHistory([]);
  };

  useEffect(() => {
    const load = async () => {
      const stored = await getFromStorage("dice-roller-store");
      if (stored?.state?.rollHistory) {
        setRollHistory(stored.state.rollHistory);
      }
    };
    load();
  }, []);

  return (
    <>
      <View style={theme.commonStyles.header}>
        <Text style={[theme.commonStyles.boldTitle, styles.headerText]}>
          Roll History
        </Text>

        <TouchableOpacity
          style={theme.commonStyles.clearButton}
          onPress={clearHistory}
          activeOpacity={0.8}
        >
          <Text style={theme.commonStyles.clearText}>Clear</Text>
          <MaterialIcons name="history" size={22} color={theme.colorRed} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={rollHistory}
        contentContainerStyle={[
          styles.listContent,
          rollHistory.length === 0 && styles.centerEmpty,
        ]}
        ListEmptyComponent={<NoItems message="No diceulations yet!" />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View style={styles.row}>
              <Text style={styles.expressionText}>{item.expression}</Text>
              <Text style={styles.resultText}>= {item.result}</Text>
            </View>
            <Text style={styles.timeText}>
              {new Date(item.diceulatedAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </>
  );
}

function NoItems({ message }: { message: string }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="casino" size={48} color={theme.colorGray} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: { paddingTop: 4 },
  listContent: { padding: 16 },
  centerEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGray,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expressionText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colorDarkBlue,
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colorRed,
  },
  timeText: {
    marginTop: 4,
    fontSize: 13,
    color: theme.colorGray,
  },
  emptyContainer: {
    paddingTop: 80,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    color: theme.colorGray,
  },
});
