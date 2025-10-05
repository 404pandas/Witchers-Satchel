import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { PersistedCountdownState, storageKey } from ".";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import { format } from "date-fns";
import { theme } from "../../theme";
import Foundation from "@expo/vector-icons/Foundation";
const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();

  const clearHistory = async () => {
    await saveToStorage(storageKey, {
      currentNotificationId: undefined,
      completedAtTimestamps: [],
    });
  };

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(storageKey);
      setCountdownState(value);
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
          Potion History
        </Text>
        <TouchableOpacity
          style={[theme.commonStyles.button]}
          onPress={() => {
            clearHistory();
            setCountdownState({
              currentNotificationId: undefined,
              completedAtTimestamps: [],
            });
          }}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18, color: theme.colorRed }}>Clear</Text>
          <Foundation name="skull" size={24} color={theme.colorRed} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        data={countdownState?.completedAtTimestamps}
        ListEmptyComponent={<Text>No items</Text>}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {format(item, fullDateFormat)}
              </Text>
            </View>
          );
        }}
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
    fontSize: 24,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colorGray,
    paddingVertical: 8,
  },
});
