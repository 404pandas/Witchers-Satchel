import { StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";
import SatchelItem from "../components/SatchelItem";
import { Link } from "expo-router";

export default function App() {
  return (
    <>
      <View style={theme.commonStyles.pageContainer}>
        <Text style={styles.subtitle}>Need to talley your trophies?</Text>
        <Link href="/talley" style={theme.commonStyles.link}>
          Go to monster talley
        </Link>
        <SatchelItem name={"potion"} isCompleted />
        <SatchelItem name={"test"} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subtitle: { textAlign: "center", marginBottom: 18, fontSize: 24 },
});
