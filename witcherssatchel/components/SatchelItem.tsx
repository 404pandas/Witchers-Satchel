import React from "react";
import { Alert, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { theme } from "../theme";

type Props = {
  name?: string;
  isCompleted?: boolean;
};

const SatchelItem = ({ name, isCompleted }: Props) => {
  const handleDelete = () => {
    Alert.alert("Hmm...", `Are you sure you want to destroy ${name}?`, [
      {
        text: "Yes",
        onPress: () => console.log(`${name} destroyed`),
        style: "destructive",
      },
      { text: "No", style: "cancel" },
    ]);
  };
  return (
    <View
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
    >
      {" "}
      <Text
        style={[
          styles.itemText,
          isCompleted ? styles.completedText : undefined,
        ]}
      >
        {name}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          isCompleted ? styles.completedButton : undefined,
        ]}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Destroy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completedContainer: {
    backgroundColor: theme.colorLightRed,
    borderBottomColor: theme.colorLightRed,
  },
  completedButton: {
    backgroundColor: theme.colorRed,
  },
  completedText: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorBlack,
  },
  itemText: { fontSize: 18, fontWeight: "200" },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default SatchelItem;
