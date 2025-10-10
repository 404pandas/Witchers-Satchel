import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
} from "react-native";
import bestiary from "@/assets/beastiary.json";
import { theme } from "@/theme";

const { width } = Dimensions.get("window");

export default function Bestiary() {
  const scrollRef = useRef<ScrollView>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!sliderWidth) return;

      let newX = gestureState.dx + gestureState.x0 - 20; // adjust for padding
      if (newX < 0) newX = 0;
      if (newX > sliderWidth) newX = sliderWidth;

      pan.setValue(newX);

      // Calculate corresponding carousel scroll
      const scrollPercent = newX / sliderWidth;
      const scrollX = scrollPercent * (width * (bestiary.length - 1));
      scrollRef.current?.scrollTo({ x: scrollX, animated: false });
    },
  });

  return (
    <View style={{ flex: 1, paddingTop: 16 }}>
      {/* Slider */}
      <View
        style={styles.sliderContainer}
        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
      >
        <Text style={[styles.letter, theme.commonStyles.scriptText]}>A</Text>
        <View style={styles.track}>
          <Animated.View
            {...panResponder.panHandlers}
            style={[styles.thumb, { transform: [{ translateX: pan }] }]}
          />
        </View>
        <Text style={[styles.letter, theme.commonStyles.scriptText]}>Z</Text>
      </View>

      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {bestiary.map((monster) => (
          <View key={monster.beastName} style={[styles.card, { width }]}>
            <Text
              style={[
                theme.commonStyles.boldTitle,
                styles.name,
                theme.commonStyles.scriptText,
              ]}
            >
              {monster.beastName.toUpperCase()}
            </Text>
            <Image
              source={{ uri: monster.imageUrl }}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.statsContainer}>
              <Text style={styles.statsKeyName}>
                Vitality:
                <Text
                  style={[styles.statsValue, theme.commonStyles.scriptText]}
                >
                  {monster.stats.vitality}
                </Text>
              </Text>
              <Text style={styles.statsKeyName}>
                Attack:{" "}
                <Text
                  style={[styles.statsValue, theme.commonStyles.scriptText]}
                >
                  {monster.stats.attack}
                </Text>
              </Text>
              <Text style={styles.statsKeyName}>
                Defense:{" "}
                <Text
                  style={[styles.statsValue, theme.commonStyles.scriptText]}
                >
                  {monster.stats.defense}
                </Text>
              </Text>
              <Text style={styles.statsKeyName}>
                Speed:{" "}
                <Text
                  style={[styles.statsValue, theme.commonStyles.scriptText]}
                >
                  {monster.stats.speed}
                </Text>
              </Text>
              <Text style={styles.statsKeyName}>
                Intelligence:{" "}
                <Text
                  style={[styles.statsValue, theme.commonStyles.scriptText]}
                >
                  {monster.stats.intelligence}
                </Text>
              </Text>
            </View>
            <Text style={styles.statsKeyName}>
              Weak to:{" "}
              <Text style={[styles.statsValue, theme.commonStyles.scriptText]}>
                {monster.stats.signVulnerability}
              </Text>
            </Text>
            <Text style={styles.statsKeyName}>Loot:</Text>
            <Text style={[styles.statsValue, theme.commonStyles.scriptText]}>
              {monster.stats.loot.join(", ")}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { backgroundColor: theme.colorGray },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  letter: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colorRed,
  },
  track: {
    flex: 1,
    height: 4,
    backgroundColor: theme.colorBlack,
    marginHorizontal: 8,
    borderRadius: 2,
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colorRed,
    top: -8,
  },
  card: {
    backgroundColor: theme.colorWhite,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginVertical: 24,
  },
  image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  name: {
    color: theme.colorRed,
    marginBottom: 8,
  },
  statsKeyName: {
    fontSize: 20,
    color: theme.colorBlack,
    textAlign: "center",
    marginBottom: 4,
  },
  statsValue: { fontWeight: "bold", color: theme.colorLightRed, fontSize: 24 },
  statsContainer: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
});
