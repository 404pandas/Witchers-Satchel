import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { theme } from "./theme";
import SatchelItem from "./components/SatchelItem";

export default function App() {
  return (
    <>
      <View style={styles.container}>
        {" "}
        <SatchelItem name={"potion"} isCompleted />
        <SatchelItem name={"test"} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
