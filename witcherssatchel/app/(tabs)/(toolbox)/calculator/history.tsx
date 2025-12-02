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
import { calcStorageKey } from "@/components/Calculatorr";
import NoItems from "@/components/NoItems";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CalcRecord } from "@/types/calculatorTypes";

export default function CalculatorHistoryScreen() {
  const [calcHistory, setCalcHistory] = useState<CalcRecord[]>([]);

  const clearHistory = async () => {
    await saveToStorage(calcStorageKey, []);
    setCalcHistory([]);
  };

  useEffect(() => {
    const load = async () => {
      const stored = await getFromStorage(calcStorageKey);
      if (stored) setCalcHistory(stored);
    };
    load();
  }, []);

  return (
    <>
      <View style={theme.commonStyles.historyHeader}>
        <Text
          style={[
            theme.commonStyles.boldTitle,
            { paddingLeft: 16, paddingTop: 8 },
          ]}
        >
          Calculation History
        </Text>
        <TouchableOpacity
          style={[theme.commonStyles.button]}
          onPress={clearHistory}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18, color: theme.colorRed }}>Clear</Text>
          <MaterialIcons name="history" size={24} color={theme.colorRed} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        data={calcHistory}
        ListEmptyComponent={<NoItems message="No calculations yet!" />}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }: { item: CalcRecord }) => (
          <View style={styles.listItem}>
            <Text style={styles.expressionText}>{item.expression}</Text>
            <Text style={styles.resultText}>= {item.result}</Text>
            <Text style={styles.timeText}>
              {new Date(item.calculatedAt).toLocaleString()}
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
    backgroundColor: theme.colorLight,
  },
  listContentContainer: {
    paddingBottom: 32,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorGray,
    paddingHorizontal: 16,
  },
  expressionText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colorDarkBlue,
  },
  resultText: {
    fontSize: 18,
    color: theme.colorRed,
  },
  timeText: {
    fontSize: 14,
    color: theme.colorGray,
  },
});
