import {
  Text,
  StyleSheet,
  TextInput,
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { theme } from "@/theme";
import { WitcherSatchelButton } from "@/components/WitcherSatchelButton";
import { useState } from "react";
import { Potion } from "@/components/Potion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePotionStore } from "@/store/potionStore";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function NewScreen() {
  const [name, setName] = useState<string>();
  const [days, setDays] = useState<string>();
  const [imageURI, setImageURI] = useState<string>();
  const addPotion = usePotionStore((state) => state.addPotion);
  const router = useRouter();

  const handleTakePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not supported", "Camera capture is not supported on web.");
      return;
    }

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to take photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageURI(uri);
      } else {
        Alert.alert("Photo capture canceled or failed", "Please try again.");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handleChooseImage = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Not supported", "Image picking is not supported on web.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImageURI(uri);
      } else {
        Alert.alert("Image selection canceled or failed", "Please try again.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleSubmit = () => {
    if (!name) {
      return Alert.alert("Validation Error", "Give your potion a name");
    }

    if (!days) {
      return Alert.alert(
        "Validation Error",
        `How often does ${name} need to be stirred?`
      );
    }

    if (Number.isNaN(Number(days))) {
      return Alert.alert(
        "Validation Error",
        "Stirring frequency must be a be a number"
      );
    }

    addPotion(name, Number(days), imageURI);
    router.navigate("/profile");
    console.log("Adding potion", name, days);
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.centered}>
        <Potion imageUri={imageURI} />
        <View style={styles.imagePicker}>
          <TouchableOpacity hitSlop={20} onPress={handleChooseImage}>
            <Entypo name="image" size={24} color={theme.colorGray} />
          </TouchableOpacity>
          <TouchableOpacity hitSlop={20} onPress={handleTakePhoto}>
            <Feather name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="E.g. Potion of Swallow"
        autoCapitalize="words"
      />
      <Text style={styles.label}>Stirring Frequency (every x days)</Text>
      <TextInput
        value={days}
        onChangeText={setDays}
        style={styles.input}
        placeholder="E.g. 6"
        keyboardType="number-pad"
      />
      <WitcherSatchelButton title="Add potion" onPress={handleSubmit} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
  },
  contentContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  input: {
    borderWidth: 2,
    borderColor: theme.colorGray,
    padding: 12,
    borderRadius: 6,
    marginBottom: 24,
    fontSize: 18,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  centered: {
    alignItems: "center",
  },
  imagePicker: {
    position: "relative",
    bottom: 24,
    right: -120,
    gap: 24,
    flexDirection: "row",
    width: 100,
    marginTop: 12,
    marginBottom: 24,
  },
});
