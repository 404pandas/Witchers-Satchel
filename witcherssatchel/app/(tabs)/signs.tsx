import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import LottieView from "lottie-react-native";

import igni from "@/assets/animations/igni.json";
import aard from "@/assets/animations/aard.json";
import yrden from "@/assets/animations/yrden.json";
import quen from "@/assets/animations/quen.json";
import axii from "@/assets/animations/axii.json";

import { ResetButton } from "@/components/ResetButton";

const animations: Record<string, any> = {
  Igni: igni,
  Aard: aard,
  Yrden: yrden,
  Quen: quen,
  Axii: axii,
};

const signs = Object.keys(animations);

export default function SignRecognitionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  const borderAnim = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();
    })();
  }, []);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#F2C800" }}>Loading camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Feather name="camera-off" size={100} color="gray" />
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.text}>Grant Camera Permission</Text>
        </TouchableOpacity>
        <ResetButton />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    // Animate flip icon: 360° rotation + bounce
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Flip camera
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const borderColor =
    activeSign === "Igni"
      ? "orange"
      : activeSign === "Aard"
        ? "lightblue"
        : activeSign === "Yrden"
          ? "aqua"
          : activeSign === "Quen"
            ? "green"
            : activeSign === "Axii"
              ? "pink"
              : "transparent";

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });
  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  // Trigger animation + border
  const handleSignPress = (sign: string) => {
    setActiveSign(sign);

    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Reset border after 5s
    setTimeout(() => {
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setActiveSign(null));
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        active={true}
        ratio="16:9"
      />

      {/* Top bar: Reset (left) + Flip Camera (right) */}
      <View style={styles.topBar}>
        <ResetButton />
        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraFacing}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                {
                  scale: flipAnim.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            }}
          >
            <Feather name="rotate-ccw" size={28} color="#F2C800" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {activeSign && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlayBorder,
            {
              borderColor,
              borderWidth,
              shadowColor: borderColor,
              shadowOpacity,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 0 },
              ...Platform.select({
                android: { elevation: borderWidth.__getValue() * 2 },
              }),
            },
          ]}
        />
      )}

      {activeSign && animations[activeSign] && (
        <LottieView
          source={animations[activeSign]}
          autoPlay
          loop={true}
          style={styles.overlayAnimation}
        />
      )}

      <View style={styles.signsContainer}>
        {signs.map((sign) => (
          <TouchableOpacity
            key={sign}
            style={styles.signButton}
            onPress={() => handleSignPress(sign)}
          >
            <Text style={styles.signText}>{sign}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  message: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#F2C800",
    fontSize: 18,
  },
  camera: { flex: 1, width: "100%", height: "80%", backgroundColor: "unset" },
  signsContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 9,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#010302",
  },
  signButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#F2C800",
  },
  signText: { color: "#F2C800", fontWeight: "bold", fontSize: 16 },
  overlayAnimation: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -150,
    zIndex: 1,
  },
  overlayBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 2,
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    alignItems: "center",
  },
  flipButton: {
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#F2C800",
    alignItems: "center",
    justifyContent: "center",
  },
});
