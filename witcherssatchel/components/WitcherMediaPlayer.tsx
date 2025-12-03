import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import { theme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";

export default function WitcherMediaPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { sound, status } = await Audio.Sound.createAsync(
          require("@/assets/audio/toss-a-coin.mp3"),
          { shouldPlay: false }
        );
        soundRef.current = sound;
        setDuration(status.durationMillis || 1);
        setIsLoaded(true);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 1);
          setIsPlaying(status.isPlaying);
        });
      } catch (err) {
        console.error("Error loading audio:", err);
      }
    };

    load();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    isPlaying
      ? await soundRef.current.pauseAsync()
      : await soundRef.current.playAsync();
  };

  const rewind = async () => {
    if (!soundRef.current) return;
    const newPos = Math.max(position - 5000, 0);
    await soundRef.current.setPositionAsync(newPos);
  };

  const fastForward = async () => {
    if (!soundRef.current) return;
    const newPos = Math.min(position + 5000, duration);
    await soundRef.current.setPositionAsync(newPos);
  };

  const onSliderValueChange = async (value: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(value);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!isLoaded)
    return <Text style={theme.commonStyles.keyName}>Loading audio...</Text>;

  return (
    <View style={[styles.container, { alignSelf: "center" }]}>
      <Text
        style={[theme.commonStyles.boldTitle, { color: "white", fontSize: 10 }]}
      >
        Toss a Coin to Your Witcher
      </Text>

      <Slider
        style={{ width: "90%", marginVertical: 8 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={onSliderValueChange}
        minimumTrackTintColor={theme.colorLightRed}
        maximumTrackTintColor={theme.colorWhite}
        thumbTintColor={theme.colorRed}
      />

      <View style={styles.timeContainer}>
        <Text style={[theme.commonStyles.keyName, { color: "white" }]}>
          {formatTime(position)}
        </Text>
        <Text style={[theme.commonStyles.keyName, { color: "white" }]}>
          {formatTime(duration)}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={rewind} style={styles.controlButton}>
          <Ionicons name="play-back" size={24} color={theme.colorRed} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.controlButton}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={24}
            color={theme.colorRed}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={fastForward} style={styles.controlButton}>
          <Ionicons name="play-forward" size={24} color={theme.colorRed} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#010302",
    width: "75%",
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "auto",
  },
  controls: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginTop: 12,
    marginBottom: 12,
  },
  controlButton: {
    padding: 4,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 4,
  },
});
