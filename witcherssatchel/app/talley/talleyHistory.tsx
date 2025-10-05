import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { theme } from "@/theme";
import Foundation from "@expo/vector-icons/Foundation";
import NoItems from "@/components/NoItems";

// Define a new type for Hunt history
export interface HuntRecord {
  huntName: string;
  seconds: number;
  scheduledAt: number; // timestamp
}

// Key for storing hunts in async storage
export const huntStorageKey = "huntHistory";

export default function HistoryScreen() {
  const [huntHistory, setHuntHistory] = useState<HuntRecord[]>([]);

  const clearHistory = async () => {
    await saveToStorage(huntStorageKey, []);
    setHuntHistory([]);
  };

  useEffect(() => {
    const init = async () => {
      const stored: HuntRecord[] = await getFromStorage(huntStorageKey);
      if (stored) setHuntHistory(stored);
    };

    init();
  }, []);

  return (
    <>
      <View style={styles.historyHeader}>
        <Text
          style={[
            theme.commonStyles.boldTitle,
            { paddingLeft: 16, paddingTop: 8 },
          ]}
        >
          Hunt History
        </Text>
        <TouchableOpacity
          style={[theme.commonStyles.button]}
          onPress={clearHistory}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18, color: theme.colorRed }}>Clear</Text>
          <Foundation name="skull" size={24} color={theme.colorRed} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        data={huntHistory}
        ListEmptyComponent={<NoItems message="No hunts scheduled yet!" />}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: HuntRecord }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.huntName}</Text>
            <Text style={styles.durationText}>
              Reminder set for: {item.seconds} seconds
            </Text>
            <Text style={styles.scheduledText}>
              Scheduled at: {new Date(item.scheduledAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  listContentContainer: {
    paddingBottom: 32,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listItemText: {
    fontSize: 20,
    fontWeight: "600",
  },
  durationText: {
    fontSize: 18,
    color: theme.colorGray,
  },
  scheduledText: {
    fontSize: 16,
    color: theme.colorDarkBlue,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colorGray,
    paddingVertical: 8,
  },
});
