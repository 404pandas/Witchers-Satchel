import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import { WitcherSatchelButton } from "@/components/WitcherSatchelButton";
export default function OnboardingScreen() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handlePress = () => {
    toggleHasOnboarded();
    router.replace("/");
  };
  return (
    <View style={styles.container}>
      <Text style={[theme.commonStyles.boldTitle, styles.onboardingText]}>
        Welcome to Witcher's Satchel!
      </Text>
      <Text style={styles.text}>
        This is an experimental app for me to learn React Native.
      </Text>
      <Text style={styles.text}>Press the button to continue.</Text>
      <TouchableOpacity
        style={theme.commonStyles.buttonRed}
        onPress={handlePress}
      >
        <Text style={[theme.commonStyles.buttonText, { fontSize: 20 }]}>
          Continue
        </Text>
      </TouchableOpacity>
      <WitcherSatchelButton
        title="Continue, but prettier"
        onPress={handlePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorBlack,
  },
  text: {
    color: theme.colorWhite,
    fontSize: 24,
    textAlign: "center",
  },
  onboardingText: {
    marginVertical: 24,
    textAlign: "center",
    color: theme.colorWhite,
  },
});
