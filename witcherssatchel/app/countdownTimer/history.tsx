import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { PersistedCountdownState, storageKey, BrewRecord } from ".";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import { format } from "date-fns";
import { theme } from "../../theme";
import Foundation from "@expo/vector-icons/Foundation";
import NoItems from "../../components/NoItems";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function HistoryScreen() {
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();

  const clearHistory = async () => {
    const cleared: PersistedCountdownState = {
      currentNotificationId: undefined,
      completedBrews: [],
    };
    await saveToStorage(storageKey, cleared);
    setCountdownState(cleared);
  };

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(storageKey);

      if (value?.completedAtTimestamps && !value.completedBrews) {
        const migrated: PersistedCountdownState = {
          currentNotificationId: value.currentNotificationId,
          completedBrews: value.completedAtTimestamps.map((t: number) => ({
            completedAt: t,
            duration: 0,
          })),
        };
        setCountdownState(migrated);
        await saveToStorage(storageKey, migrated);
      } else {
        setCountdownState(value);
      }
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
        data={countdownState?.completedBrews}
        ListEmptyComponent={<NoItems message="No potions brewed yet!" />}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: BrewRecord }) => {
          const brewSeconds = Math.round(item.duration / 1000);
          return (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {format(item.completedAt, fullDateFormat)}
              </Text>
              <Text style={styles.durationText}>
                ⏳ Brew Duration: {brewSeconds}s
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
    fontWeight: "600",
  },
  durationText: {
    fontSize: 18,
    color: theme.colorGray,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colorGray,
    paddingVertical: 8,
  },
});
