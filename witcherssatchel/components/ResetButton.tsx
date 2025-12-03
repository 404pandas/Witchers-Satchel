import React from "react";
import {
  Linking,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import * as IntentLauncher from "expo-intent-launcher";
import * as Application from "expo-application";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export function ResetButton() {
  return (
    <TouchableOpacity
      onPress={() => {
        if (Platform.OS === "ios") {
          Linking.openURL("app-settings:");
        } else {
          IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
            { data: "package:" + Application.applicationId }
          );
        }
      }}
      style={styles.debugPermissionButton}
    >
      {/* Gear icon */}
      <FontAwesome name="gears" size={24} color="#f2C800" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  debugPermissionButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F2C800",
    zIndex: 999,
  },
});
