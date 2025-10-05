import { Text, StyleSheet, TextInput, Alert, View } from "react-native";
import { theme } from "@/theme";
import { WitcherSatchelButton } from "@/components/WitcherSatchelButton";
import { useState } from "react";
import { Potion } from "@/components/Potion";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { usePotionStore } from "@/store/potionStore";
import { useRouter } from "expo-router";

export default function NewScreen() {
  const [name, setName] = useState<string>();
  const [days, setDays] = useState<string>();
  const addPotion = usePotionStore((state) => state.addPotion);
  const router = useRouter();

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

    addPotion(name, Number(days));
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
        <Potion />
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
});
