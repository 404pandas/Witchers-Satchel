import React from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { theme } from "../theme";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type Props = {
  name?: string;
  isCompleted?: boolean;
  onDelete: () => void;
};

const SatchelItem = ({ name, isCompleted, onDelete }: Props) => {
  const handleDelete = () => {
    Alert.alert("Hmm...", `Are you sure you want to destroy ${name}?`, [
      {
        text: "Yes",
        onPress: () => onDelete(),
        style: "destructive",
      },
      { text: "No", style: "cancel" },
    ]);
  };
  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
    >
      <View style={{ flexDirection: "row", gap: 8, flex: 1, padding: 2 }}>
        <MaterialCommunityIcons
          name={
            isCompleted
              ? "checkbox-marked-circle-outline"
              : "checkbox-blank-circle-outline"
          }
          size={24}
          color="black"
        />
        <Text
          style={[
            styles.itemText,
            isCompleted ? styles.completedText : undefined,
          ]}
        >
          {name}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          isCompleted ? styles.completedButton : undefined,
        ]}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        {isCompleted ? (
          <Foundation name="skull" size={24} color={theme.colorBlack} />
        ) : (
          <MaterialIcons
            name="delete-outline"
            size={24}
            color={theme.colorWhite}
          />
        )}
      </TouchableOpacity>
    </Pressable>
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
    width: "100%",
    flex: 1,
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
  itemText: { fontSize: 18, flex: 1, paddingHorizontal: 20, fontWeight: "200" },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
  },
});

export default SatchelItem;
