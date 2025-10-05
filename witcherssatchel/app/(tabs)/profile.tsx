import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";

export default function ProfileScreen() {
  const toggleHasOnbaorded = useUserStore((state) => state.toggleHasOnboarded);
  return (
    <View style={theme.commonStyles.pageContainer}>
      <TouchableOpacity
        style={theme.commonStyles.buttonRed}
        onPress={toggleHasOnbaorded}
      >
        <Text style={[theme.commonStyles.buttonText, { fontSize: 20 }]}>
          Back to Welcome Screen
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
});
