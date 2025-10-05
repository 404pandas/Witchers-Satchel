import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "expo-router";
import { WitcherSatchelButton } from "@/components/WitcherSatchelButton";
import { LinearGradient } from "expo-linear-gradient";

import { Logo } from "@/components/Logo";

export default function OnboardingScreen() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handlePress = () => {
    toggleHasOnboarded();
    router.replace("/");
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["gray", "black", "gray"]}
      style={styles.container}
    >
      <View
        style={[
          styles.onboardingContainer,
          { backgroundColor: theme.colorDarkerRed },
        ]}
      >
        <Text
          style={[
            theme.commonStyles.boldTitle,
            styles.onboardingText,
            theme.commonStyles.textShadow,
          ]}
        >
          Welcome to Witcher&apos;s Satchel!
        </Text>
        <Logo />
        <Text style={[styles.text, theme.commonStyles.textShadow]}>
          This is an experimental app for me to learn React Native.
        </Text>

        <Text style={[styles.text, theme.commonStyles.textShadow]}>
          Press the button to continue.
        </Text>

        <TouchableOpacity
          style={theme.commonStyles.buttonRed}
          onPress={handlePress}
        >
          <Text style={[theme.commonStyles.buttonText, { fontSize: 20 }]}>
            Continue
          </Text>
        </TouchableOpacity>

        <WitcherSatchelButton
          title="Continue, but a cylon"
          onPress={handlePress}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  onboardingContainer: {
    width: "80%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    borderColor: theme.colorGray,
    borderWidth: 1,
    padding: 24,
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
