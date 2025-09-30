import React, { ReactNode, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
} from "react-native";

const { width } = Dimensions.get("window");

type CarouselProps = {
  children: ReactNode[];
};

export default function Carousel({ children }: CarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {children.map((child, idx) => (
          <View key={idx} style={{ width, paddingHorizontal: 16 }}>
            {child}
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {children.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx ? styles.activeDot : undefined,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#555",
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: "#F2C800" },
});
