import { theme } from "@/theme";
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  Easing,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";

type Props = {
  title: string;
  onPress: () => void;
};

export function WitcherSatchelButton({ title, onPress }: Props) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    onPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        styles.buttonPrettier,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={{ overflow: "hidden" }}>
        <Animated.View
          style={[
            styles.shimmerWrapper,
            { transform: [{ translateX: shimmerTranslate }] },
          ]}
        >
          <LinearGradient
            colors={[
              "transparent",
              "rgba(179, 57, 57, 0.4)",
              "rgba(188, 88, 88, 0.5)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 2,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colorRed,
    marginVertical: 12,
    overflow: "hidden",
  },
  buttonPrettier: {
    backgroundColor: "#3d3d3e",
    shadowColor: "#e64711",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  buttonPressed: {
    backgroundColor: theme.colorBlack,
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    width: "180%",
    height: "100%",
    zIndex: 1,
    transform: [{ rotate: "20deg" }],
  },
});
