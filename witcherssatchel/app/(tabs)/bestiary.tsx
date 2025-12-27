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
  FlatList,
  TouchableOpacity,
} from "react-native";
import bestiary from "@/assets/beastiary.json";
import { theme } from "@/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const CARD_WIDTH = width * 0.9;
const CARD_MARGIN = width * 0.05;
const CARD_HEIGHT = height * 0.7;

export default function Bestiary() {
  const scrollRef = useRef<ScrollView>(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!sliderWidth) return;

      let newX = gestureState.dx + gestureState.x0 - 20;
      if (newX < 0) newX = 0;
      if (newX > sliderWidth) newX = sliderWidth;

      pan.setValue(newX);

      const scrollPercent = newX / sliderWidth;
      const scrollX = scrollPercent * (width * (bestiary.length - 1));
      scrollRef.current?.scrollTo({ x: scrollX, animated: false });
    },
  });

  return (
    <View style={{ flex: 1, paddingTop: 16 }}>
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
      <View>
        <TouchableOpacity
          style={[
            theme.commonStyles.buttonRed,
            { width: "80%", alignSelf: "center", marginBottom: 12 },
          ]}
          onPress={() => router.push("/encounter")}
        >
          <Text
            style={[theme.commonStyles.buttonText, { textAlign: "center" }]}
          >
            Random Encounter
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const maxScrollX = width * (bestiary.length - 1);

          if (sliderWidth > 0) {
            const percent = x / maxScrollX;
            pan.setValue(percent * sliderWidth);
          }
        }}
        scrollEventThrottle={16}
      >
        {bestiary.map((monster) => (
          <ScrollView
            key={monster.beastName}
            contentContainerStyle={[
              theme.commonStyles.monsterCard,
              {
                height: CARD_HEIGHT,
                width: CARD_WIDTH,
                marginHorizontal: CARD_MARGIN,
              },
            ]}
          >
            <ScrollView>
              <Text
                style={[
                  theme.commonStyles.boldTitle,
                  styles.name,
                  theme.commonStyles.scriptText,
                ]}
              >
                {monster.beastName.replace(/\b\w/g, (char) =>
                  char.toUpperCase()
                )}
              </Text>
              <Image
                source={{ uri: monster.imageUrl }}
                style={theme.commonStyles.image}
                resizeMode="contain"
              />
              <View style={styles.statsContainer}>
                <Text style={theme.commonStyles.keyName}>
                  Vitality:{"\u00A0"}
                  <Text
                    style={[
                      theme.commonStyles.value,
                      theme.commonStyles.scriptText,
                    ]}
                  >
                    {monster.stats.vitality}
                  </Text>
                </Text>
                <Text style={theme.commonStyles.keyName}>
                  Attack:{"\u00A0"}
                  <Text
                    style={[
                      theme.commonStyles.value,
                      theme.commonStyles.scriptText,
                    ]}
                  >
                    {monster.stats.attack}
                  </Text>
                </Text>
                <Text style={theme.commonStyles.keyName}>
                  Defense:{"\u00A0"}
                  <Text
                    style={[
                      theme.commonStyles.value,
                      theme.commonStyles.scriptText,
                    ]}
                  >
                    {monster.stats.defense}
                  </Text>
                </Text>
                <Text style={theme.commonStyles.keyName}>
                  Speed:{"\u00A0"}
                  <Text
                    style={[
                      theme.commonStyles.value,
                      theme.commonStyles.scriptText,
                    ]}
                  >
                    {monster.stats.speed}
                  </Text>
                </Text>
                <Text style={theme.commonStyles.keyName}>
                  Intelligence:{"\u00A0"}
                  <Text
                    style={[
                      theme.commonStyles.value,
                      theme.commonStyles.scriptText,
                    ]}
                  >
                    {monster.stats.intelligence}
                  </Text>
                </Text>
              </View>
              <Text style={theme.commonStyles.keyName}>
                Weak to:{"\u00A0"}
                <Text
                  style={[
                    theme.commonStyles.value,
                    theme.commonStyles.scriptText,
                  ]}
                >
                  {monster.signVulnerability}
                </Text>
              </Text>
              <Text style={theme.commonStyles.keyName}>Loot:{"\u00A0"} </Text>
              <ScrollView>
                <FlatList
                  data={monster.loot}
                  keyExtractor={(item, index) => item + index}
                  renderItem={({ item }) => (
                    <Text
                      style={[
                        theme.commonStyles.value,
                        theme.commonStyles.scriptText,
                        { marginVertical: 2 },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="sword"
                        size={24}
                        color={theme.colorLightRed}
                      />
                      {"\u00A0"} {item}
                    </Text>
                  )}
                  scrollEnabled={false} // prevents nested scroll issues
                />
              </ScrollView>
            </ScrollView>
          </ScrollView>
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
  name: {
    color: theme.colorRed,
    marginBottom: 8,
  },
  statsContainer: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
  },
});
