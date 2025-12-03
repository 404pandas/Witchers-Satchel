import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

const signs = ["Aard", "Igni", "Yrden", "Quen", "Axii"];

export default function SignRecognitionScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [activeSign, setActiveSign] = useState<string | null>(null);

  const animation = useRef(new Animated.Value(0)).current;

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Feather name="camera-off" size={100} color="gray" />
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleSignPress = (sign: string) => {
    setActiveSign(sign);
    // Reset animation
    animation.setValue(0);
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start(() => {
      setActiveSign(null); // remove animation after finishing
    });
  };

  // Map activeSign to some styles/colors for the animation
  const borderColor =
    activeSign === "Igni"
      ? "orange"
      : activeSign === "Aard"
        ? "lightblue"
        : activeSign === "Yrden"
          ? "purple"
          : activeSign === "Quen"
            ? "gold"
            : activeSign === "Axii"
              ? "pink"
              : "transparent";

  const borderWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10], // border grows from 0 to 10
  });

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />

      {/* Transparent overlay for animations */}
      {activeSign && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlay,
            {
              borderColor,
              borderWidth,
            },
          ]}
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
    paddingHorizontal: 64,
    justifyContent: "center",
  },
  button: { alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold", color: "#F2C800" },
  signsContainer: {
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
