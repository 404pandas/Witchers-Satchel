import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { theme } from "../../theme";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { getFromStorage, saveToStorage } from "../../utils/storage";

export const storageKey = "witchers-satchel-countdown-state";

export type BrewRecord = {
  completedAt: number;
  duration: number;
};

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedBrews: BrewRecord[];
};

type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration;
};

export default function CounterScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {},
  });
  const [countdownState, setCountdownState] =
    useState<PersistedCountdownState>();
  const [brewTime, setBrewTime] = useState("60");
  const [brewDuration, setBrewDuration] = useState<number | null>(null);

  const lastCompletedTimestamp =
    countdownState?.completedBrews?.[0]?.completedAt ?? Date.now();

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(storageKey);

      let state: PersistedCountdownState;
      if (value?.completedAtTimestamps && !value.completedBrews) {
        state = {
          currentNotificationId: value.currentNotificationId,
          completedBrews: value.completedAtTimestamps.map((t: number) => ({
            completedAt: t,
            duration: 0,
          })),
        };
        await saveToStorage(storageKey, state);
      } else if (value) {
        state = value;
      } else {
        state = { currentNotificationId: undefined, completedBrews: [] };
        await saveToStorage(storageKey, state);
      }

      setCountdownState(state);

      if (state.completedBrews?.[0]?.duration) {
        const lastBrew = state.completedBrews[0];
        const elapsed = Date.now() - lastBrew.completedAt;
        if (elapsed < lastBrew.duration) {
          setBrewDuration(lastBrew.duration);
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (!brewDuration) return;

    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp + (brewDuration ?? 0);
      const isOverdue = isBefore(timestamp, Date.now());

      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timestamp }
          : { start: Date.now(), end: timestamp }
      );

      setStatus({ isOverdue, distance });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [lastCompletedTimestamp, brewDuration]);

  const scheduleNotification = async () => {
    const latestState = await getFromStorage(storageKey);
    const durationMs = parseInt(brewTime) * 1000;
    setBrewDuration(durationMs);

    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();
    console.log(result);
    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Potion Complete!",
          body: "Your potion has finished brewing.",
          sound: true,
        },
        trigger: {
          seconds: parseInt(brewTime),
        },
      });
      Alert.alert(
        "Potion brewing begun!",
        `You'll be notified in ${brewTime} seconds.`
      );
    } else if (Device.isDevice) {
      Alert.alert(
        "Notification permission denied",
        "Please enable notifications in your settings."
      );
    }

    if (latestState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        latestState.currentNotificationId
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedBrews: latestState?.completedBrews
        ? [
            { completedAt: Date.now(), duration: durationMs },
            ...latestState.completedBrews,
          ]
        : [{ completedAt: Date.now(), duration: durationMs }],
    };
    setCountdownState(newCountdownState);
    await saveToStorage(storageKey, newCountdownState);
  };

  if (isLoading) {
    return (
      <View style={theme.commonStyles.pageContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View
      style={[
        theme.commonStyles.pageContainer,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {!brewDuration ? (
        <>
          <Text style={[styles.heading]}>Enter brewing time (seconds):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 30"
            placeholderTextColor="#999"
            value={brewTime}
            onChangeText={setBrewTime}
          />
          <TouchableOpacity
            onPress={scheduleNotification}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Start Brewing</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {!status.isOverdue ? (
            <Text style={[styles.heading]}>Potion brewing...</Text>
          ) : (
            <Text style={[styles.heading, styles.whiteText]}>
              Potion has been brewed for...
            </Text>
          )}
          <View style={styles.row}>
            <TimeSegment
              unit="Days"
              number={status.distance?.days ?? 0}
              textStyle={status.isOverdue ? styles.whiteText : undefined}
            />
            <TimeSegment
              unit="Hours"
              number={status.distance?.hours ?? 0}
              textStyle={status.isOverdue ? styles.whiteText : undefined}
            />
            <TimeSegment
              unit="Minutes"
              number={status.distance?.minutes ?? 0}
              textStyle={status.isOverdue ? styles.whiteText : undefined}
            />
            <TimeSegment
              unit="Seconds"
              number={status.distance?.seconds ?? 0}
              textStyle={status.isOverdue ? styles.whiteText : undefined}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setBrewDuration(null);
              setStatus({ isOverdue: false, distance: {} });
            }}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Brew Another Potion</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 18,
    color: theme.colorBlack,
    marginBottom: 16,
    width: "80%",
    textAlign: "center",
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
