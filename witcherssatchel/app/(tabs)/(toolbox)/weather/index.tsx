import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import * as Location from "expo-location";
import { useWeatherStore } from "@/store/weatherStore";
import { theme } from "@/theme";

export default function WeatherScreen() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const { weather, loading, error, fetchWeather } = useWeatherStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to fetch weather."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newCoords = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
      };
      setCoords(newCoords);
      await fetchWeather(newCoords.lat, newCoords.lon);
    })();
  }, []);

  if (!coords) {
    return (
      <View style={theme.commonStyles.pageContainer}>
        <ActivityIndicator size="large" color={theme.colorRed} />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={theme.commonStyles.pageContainer}>
        <ActivityIndicator size="large" color={theme.colorRed} />
        <Text>Loading weather...</Text>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={theme.commonStyles.pageContainer}>
        <Text>Error fetching weather: {error}</Text>
      </View>
    );
  }

  const { main, weather: weatherArr, wind } = weather;
  const description = weatherArr[0]?.description || "";
  const icon = weatherArr[0]?.icon
    ? `https://openweathermap.org/img/wn/${weatherArr[0].icon}@2x.png`
    : null;

  return (
    <KeyboardAvoidingView style={theme.commonStyles.pageContainer}>
      <ScrollView
        contentContainerStyle={[
          theme.commonStyles.pageContainer,
          { alignItems: "center" },
        ]}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Current Weather
        </Text>
        <Text
          style={[
            (theme.commonStyles.boldTitle, theme.commonStyles.scriptText),
            { fontSize: 28 },
          ]}
        >
          {weather.name}
        </Text>
        {icon && (
          <Image source={{ uri: icon }} style={{ width: 100, height: 100 }} />
        )}
        <Text style={theme.commonStyles.keyName}>Temperature: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.temp} °F
        </Text>
        <Text style={theme.commonStyles.keyName}>Temperature Min: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.temp_min} °F
        </Text>
        <Text style={theme.commonStyles.keyName}>Temperature Max: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.temp_max} °F
        </Text>
        <Text style={theme.commonStyles.keyName}>Feels Like: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.feels_like} °F
        </Text>
        <Text style={theme.commonStyles.keyName}>Humidity: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.humidity}%
        </Text>
        <Text style={theme.commonStyles.keyName}>Pressure: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {main.pressure} hPa
        </Text>
        <Text style={theme.commonStyles.keyName}>Wind Speed: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {wind.speed} m/s
        </Text>
        <Text style={theme.commonStyles.keyName}>Conditions: </Text>
        <Text style={[theme.commonStyles.value, theme.commonStyles.scriptText]}>
          {description}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
