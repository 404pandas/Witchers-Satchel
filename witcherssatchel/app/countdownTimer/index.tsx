import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { theme } from "../../theme";
import { Duration, intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "../../components/TimeSegment";
import { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../../utils/registerForPushNotificationsAsync";
import { getFromStorage, saveToStorage } from "../../utils/storage";

// 10 seconds from now
const frequency = 10 * 1000;

export const storageKey = "witchers-satchel-countdown-state";

export type PersistedCountdownState = {
  currentNotificationId: string | undefined;
  completedAtTimestamps: number[];
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

  const lastCompletedTimestamp = countdownState?.completedAtTimestamps[0];

  useEffect(() => {
    const init = async () => {
      const value = await getFromStorage(storageKey);
      if (value) {
        setCountdownState(value);
      } else {
        const emptyState: PersistedCountdownState = {
          currentNotificationId: undefined,
          completedAtTimestamps: [],
        };
        setCountdownState(emptyState);
        await saveToStorage(storageKey, emptyState);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedTimestamp
        ? lastCompletedTimestamp + frequency
        : Date.now();
      if (lastCompletedTimestamp) {
        setIsLoading(false);
      }
      const isOverdue = isBefore(timestamp, Date.now());

      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timestamp }
          : { start: Date.now(), end: timestamp }
      );

      setStatus({ isOverdue, distance });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [lastCompletedTimestamp]);

  const scheduleNotification = async () => {
    const latestState = await getFromStorage(storageKey);

    let pushNotificationId;
    const result = await registerForPushNotificationsAsync();

    if (result === "granted") {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Potion Complete!",
          body: "Your potion has finished brewing.",
          sound: true,
        },
        trigger: {
          seconds: frequency / 1000,
        },
      });
      Alert.alert(
        "Notification scheduled",
        "You'll be reminded when the potion is done brewing."
      );
    } else {
      if (Device.isDevice) {
        Alert.alert(
          "Uh oh... unable to get permission to notify you.",
          "Please enable notifications in your settings."
        );
      }
    }
    if (latestState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        latestState?.currentNotificationId
      );
    }

    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: latestState
        ? [Date.now(), ...latestState.completedAtTimestamps]
        : [Date.now()],
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
    <>
      <View
        style={[
          theme.commonStyles.pageContainer,
          status.isOverdue ? styles.containerLate : undefined,
        ]}
      >
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
          onPress={scheduleNotification}
          style={styles.button}
          activeOpacity={0.8}
        >
          {!status.isOverdue ? (
            <Text style={styles.buttonText}>One moment...</Text>
          ) : (
            <Text style={styles.buttonText}>
              Collect and Brew Another Potion
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
