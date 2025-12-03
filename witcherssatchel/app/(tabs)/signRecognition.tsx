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

const animations: Record<string, any> = {
  Igni: igni,
  Aard: aard,
  Yrden: yrden,
  Quen: quen,
  Axii: axii,
};
const signs = Object.keys(animations);

export default function SignRecognitionScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [activeSign, setActiveSign] = useState<string | null>(null);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeSign) {
      Animated.timing(borderAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start(() => setActiveSign(null));
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [activeSign]);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Feather name="camera-off" size={100} color="gray" />
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () =>
    setFacing(facing === "back" ? "front" : "back");

  const handleSignPress = (sign: string) => {
    setActiveSign(sign);
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

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />

      {/* Glowing/fade border overlay */}
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

      {/* Sign Lottie animation */}
      {activeSign && animations[activeSign] && (
        <LottieView
          source={animations[activeSign]}
          autoPlay
          loop={false}
          style={styles.overlayAnimation}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>

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
  container: { flex: 1, backgroundColor: "#010302" },
  message: {
    textAlign: "center",
    paddingVertical: 10,
    color: "#F2C800",
    fontSize: 18,
  },
  camera: { flex: 1, width: "100%" },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  button: { alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", color: "#F2C800" },
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
});
