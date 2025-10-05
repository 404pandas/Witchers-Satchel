import { Text, View, StyleSheet } from "react-native";
import { theme } from "@/theme";

export default function ProfileScreen() {
  return (
    <View style={theme.commonStyles.pageContainer}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
  },
});
