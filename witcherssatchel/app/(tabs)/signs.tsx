import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { captureScreen } from "react-native-view-shot";

import { useState, useRef, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import LottieView from "lottie-react-native";
import * as MediaLibrary from "expo-media-library";

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
  const [permissionResponse, requestPermissionResponse] =
    MediaLibrary.usePermissions();
  const [activeSign, setActiveSign] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const borderAnim = useRef(new Animated.Value(0)).current;

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      if (!permission?.granted) await requestPermission();
      if (!permissionResponse?.granted) await requestPermissionResponse();
    })();
  }, []);

  if (!permission || !permissionResponse) {
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

  if (!permissionResponse.granted) {
    return (
      <View style={styles.container}>
        <Feather name="image" size={100} color="gray" />
        <Text style={styles.message}>
          We need your permission to access the media library
        </Text>
        <TouchableOpacity onPress={requestPermissionResponse}>
          <Text style={styles.text}>Grant Media Permission</Text>
        </TouchableOpacity>
        <ResetButton />
      </View>
    );
  }

  const toggleCameraFacing = () => {
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

  // Play animation + border + capture screenshot
  const handleSignPress = async (sign: string) => {
    setActiveSign(sign);

    // Animate border in
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start();

    // Capture screenshot after short delay
    setTimeout(async () => {
      try {
        const uri = await captureScreen({ format: "png", quality: 1 });
        console.log("Captured snapshot:", uri);
        if (permissionResponse?.granted) {
          await MediaLibrary.saveToLibraryAsync(uri);
        }
        setCapturedPhoto(uri);
      } catch (err) {
        console.error("captureScreen failed:", err);
      }
    }, 300); // delay to allow animation to render

    // Reset border and animation after 3s
    setTimeout(() => {
      Animated.timing(borderAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => setActiveSign(null));
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        active={true}
        ratio="16:9"
      />

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

      <ResetButton />
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
  buttonContainer: {
    position: "absolute",
    bottom: 140,
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
  previewContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    bottom: 200,
    borderWidth: 2,
    borderColor: "#F2C800",
    borderRadius: 20,
    overflow: "hidden",
    zIndex: 11,
  },
  previewImage: { width: "100%", height: "100%", borderRadius: 20 },
});
