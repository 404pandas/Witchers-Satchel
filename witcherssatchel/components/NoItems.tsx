import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme";

export default function NoItems({
  message = "No items",
}: {
  message?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: theme.colorGray,
    fontWeight: "500",
  },
});
