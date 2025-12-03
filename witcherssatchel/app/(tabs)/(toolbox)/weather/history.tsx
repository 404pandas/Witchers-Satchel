import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { theme } from "@/theme";
import NoItems from "@/components/NoItems";
import { useWeatherStore } from "@/store/weatherStore";
import { format } from "date-fns";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const fullDateFormat = `LLL d yyyy, h:mm aaa`;

export default function WeatherHistoryScreen() {
  const { currentWeather, removeWeather } = useWeatherStore();
  const [weatherHistory, setWeatherHistory] = useState(currentWeather || []);

  useEffect(() => {
    setWeatherHistory(currentWeather);
  }, [currentWeather]);

  const clearHistory = () => {
    if (!weatherHistory?.length) return;
    weatherHistory.forEach((w) => removeWeather(w.id.toString()));
    setWeatherHistory([]);
  };

  return (
    <>
      <View style={theme.commonStyles.header}>
        <Text
          style={[
            theme.commonStyles.boldTitle,
            { paddingLeft: 16, paddingTop: 8 },
          ]}
        >
          Weather History
        </Text>
        <TouchableOpacity
          style={theme.commonStyles.clearButton}
          onPress={clearHistory}
          activeOpacity={0.7}
        >
          <Text style={theme.commonStyles.clearText}>Clear</Text>
          <MaterialIcons name="history" size={22} color={theme.colorRed} />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
        data={weatherHistory}
        ListEmptyComponent={<NoItems message="No weather history yet!" />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const { main, weather: weatherArr, wind, lastUpdatedAt } = item;
          const description = weatherArr[0]?.description || "";
          const icon = weatherArr[0]?.icon
            ? `https://openweathermap.org/img/wn/${weatherArr[0].icon}@2x.png`
            : null;

          return (
            <View style={styles.listItem}>
              <Text style={styles.dateText}>
                {lastUpdatedAt
                  ? format(lastUpdatedAt, fullDateFormat)
                  : "Unknown date"}
              </Text>

              {icon && <Image source={{ uri: icon }} style={styles.icon} />}

              <Text style={styles.listItemText}>
                Temperature: {main.temp} °F
              </Text>
              <Text style={styles.listItemText}>
                Feels Like: {main.feels_like} °F
              </Text>
              <Text style={styles.listItemText}>
                Humidity: {main.humidity}%
              </Text>
              <Text style={styles.listItemText}>
                Pressure: {main.pressure} hPa
              </Text>
              <Text style={styles.listItemText}>Wind: {wind.speed} m/s</Text>
              <Text style={styles.listItemText}>Conditions: {description}</Text>
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
    alignItems: "flex-start",
  },
  listItemText: {
    fontSize: 18,
    color: theme.colorGray,
    marginVertical: 2,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  icon: {
    width: 80,
    height: 80,
    marginVertical: 4,
  },
});
