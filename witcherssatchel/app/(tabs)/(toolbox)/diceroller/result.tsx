import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useDiceStore, RollResult } from "@/store/diceRollerStore";
import { theme } from "@/theme";

export default function DiceResult() {
  const router = useRouter();
  const results = useDiceStore((s) => s.results);
  const total = useDiceStore((s) => s.total);

  return (
    <ScrollView contentContainerStyle={theme.commonStyles.pageContainer}>
      <ScrollView>
        <Text style={styles.title}>Roll Results</Text>
        <FlatList
          data={results}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }: { item: RollResult }) => (
            <View style={styles.row}>
              <Text style={[theme.commonStyles.keyName, { marginLeft: 20 }]}>
                {item.die.toUpperCase()}
              </Text>
              <Text
                style={[
                  theme.commonStyles.value,
                  theme.commonStyles.scriptText,
                  { marginRight: 20 },
                ]}
              >
                {item.value}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={theme.commonStyles.sep} />}
          style={{ width: "100%" }}
        />
      </ScrollView>

      <Text style={theme.commonStyles.boldTitle}>Total:</Text>
      <Text
        style={[
          theme.commonStyles.boldTitle,
          theme.commonStyles.scriptText,
          { padding: 10 },
        ]}
      >
        {total}
      </Text>

      <Pressable
        style={theme.commonStyles.buttonRed}
        onPress={() => {
          // clear previous results and go back to picker
          useDiceStore.getState().clearResults();
          router.replace("/(tabs)/(toolbox)/diceroller");
        }}
      >
        <Text style={theme.commonStyles.buttonText}>Roll Again</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
