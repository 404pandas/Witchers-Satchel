import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import { useState, useRef, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
  Linking,
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

let cameraInstance: any = null;

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
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");

  const cameraRef = useRef(null);
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Request both permissions on mount
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }

      if (!permissionResponse?.granted) {
        await requestPermissionResponse();
      }
    })();
  }, []);

  useEffect(() => {
    console.log("cameraRef:", cameraRef.current);
  }, []);

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

  if (!permission || !permissionResponse) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#F2C800" }}>Loading camera…</Text>
      </View>
    );
  }
  // If camera permission denied
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

  // If media permission denied
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

  // Saving photo
  const takePhoto = async () => {
    const cam = cameraRef.current?._cameraRef?.current;
    if (!cam) return console.warn("Camera not ready yet");

    try {
      const photo = await cam.takePictureAsync({ quality: 1 });
      console.log("Photo captured:", photo.uri);

      if (permissionResponse?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      }
      setCapturedPhoto(photo.uri);
    } catch (err) {
      console.error("Error taking photo:", err);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
    console.log("Toggled camera facing to:", facing);
  };

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
      <View style={styles.container}>
        <Text style={{ color: "white", zIndex: 90 }}>
          {/* This console logs: */}
          {/* {"canAskAgain": true, "expires": "never", "granted": true, "status": "granted"} */}
          {console.log(permission)}Test
        </Text>
        {permission.granted && permissionResponse.granted && (
          <>
            <CameraView
              style={styles.camera}
              facing={facing}
              active={true}
              ref={(ref) => {
                cameraInstance = ref;
                console.log("Camera instance:", ref);
              }}
              onCameraReady={() =>
                console.log(
                  "Camera ready",
                  cameraRef.current?._cameraRef?.current
                )
              }
              onMountError={(err) => console.log("Camera mount error:", err)}
              ratio="16:9"
            />
            <Text style={{ color: "white" }}>Hello</Text>
          </>
        )}
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Text>Flip Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Glowing/fuzzy border overlay */}
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

      {/* Capture button */}
      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Feather name="camera" size={36} color="#F2C800" />
        </TouchableOpacity>
      </View>

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

      {/* Preview captured photo */}
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: capturedPhoto }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      )}
      <ResetButton />
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
  captureContainer: {
    position: "absolute",
    bottom: 220,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  captureButton: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#F2C800",
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
