import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme } from "../../theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { getFromStorage, saveToStorage } from "../../utils/storage";
import { HuntRecord, huntStorageKey } from "./talleyHistory";

export default function TalleyerScreen() {
  const [talley, setTalley] = useState(0);
  const [seconds, setSeconds] = useState("");
  const [huntName, setHuntName] = useState("");

  const scheduleNotification = async () => {
    const delay = parseInt(seconds, 10);
    const name = huntName.trim();

    if (!name) {
      Alert.alert("Invalid input", "Please enter a hunt name.");
      return;
    }

    if (isNaN(delay) || delay <= 0) {
      Alert.alert(
        "Invalid input",
        "Please enter a positive number of seconds."
      );
      return;
    }

    const result = await registerForPushNotificationsAsync();
    console.log(result);
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for your hunt: ${name}!`,
          body: "Your hunt is ready to begin.",
          sound: true,
        },
        trigger: {
          type: "timeInterval" as const,
          seconds: delay,
          repeats: false,
        },
      });

      const stored: HuntRecord[] = (await getFromStorage(huntStorageKey)) || [];
      const newRecord: HuntRecord = {
        huntName: name,
        seconds: delay,
        scheduledAt: Date.now(),
      };
      await saveToStorage(huntStorageKey, [...stored, newRecord]);

      Alert.alert(
        "Notification scheduled",
        `You'll be reminded in ${delay} seconds.`
      );

      setSeconds("");
      setHuntName("");
    } else if (result === null) {
      const stored: HuntRecord[] = (await getFromStorage(huntStorageKey)) || [];
      const newRecord: HuntRecord = {
        huntName: name,
        seconds: delay,
        scheduledAt: Date.now(),
      };
      await saveToStorage(huntStorageKey, [...stored, newRecord]);
      setSeconds("");
      setHuntName("");
      Alert.alert(
        "Push notifications not supported",
        "Push notifications are not supported on emulators. Please test on a physical device."
      );
      return;
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Uh oh... unable to get permission to notify you.",
          "Please enable notifications in your settings."
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={theme.commonStyles.pageContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.buttonRow}>
        <Text style={theme.commonStyles.boldTitle}>Monster Trophies</Text>
      </View>

      <View style={styles.talleyContainer}>
        <MaterialCommunityIcons
          name="skull"
          size={32}
          color={theme.colorBlack}
        />
        <Text style={styles.talley}>{talley}</Text>
        <MaterialCommunityIcons
          name="skull"
          size={32}
          color={theme.colorBlack}
        />
      </View>

      <View style={[styles.buttonRow, styles.talleyContainer]}>
        <TouchableOpacity
          style={[theme.commonStyles.button, styles.decrement]}
          onPress={() => setTalley((c) => Math.max(0, c - 1))}
        >
          <MaterialCommunityIcons
            name="sword"
            size={24}
            color={theme.colorWhite}
          />
          <Text style={theme.commonStyles.buttonText}>Slay Fewer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.commonStyles.button, styles.reset]}
          onPress={() => setTalley(0)}
        >
          <FontAwesome name="beer" size={24} color={theme.colorWhite} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[theme.commonStyles.button, styles.increment]}
          onPress={() => setTalley((c) => c + 1)}
        >
          <MaterialCommunityIcons
            name="sword-cross"
            size={24}
            color={theme.colorWhite}
          />
          <Text style={theme.commonStyles.buttonText}>Slay More</Text>
        </TouchableOpacity>
      </View>

      <Text style={theme.commonStyles.boldTitle}>Hunt Scheduler</Text>

      <View style={styles.notificationContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name of hunt"
          keyboardType="default"
          value={huntName}
          onChangeText={setHuntName}
        />
        <TextInput
          style={styles.input}
          placeholder="Seconds"
          keyboardType="numeric"
          value={seconds}
          onChangeText={setSeconds}
        />
        <TouchableOpacity
          style={[theme.commonStyles.button, styles.increment]}
          onPress={scheduleNotification}
        >
          <Text style={theme.commonStyles.buttonText}>Schedule</Text>
        </TouchableOpacity>
      </View>

      <Text>Use this notification to get a reminder to hunt!</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  talleyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  talley: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colorRed,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  increment: {
    backgroundColor: theme.colorRed,
  },
  decrement: {
    backgroundColor: theme.colorBlack,
  },
  reset: {
    backgroundColor: theme.colorLightRed,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colorDarkBlue,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
