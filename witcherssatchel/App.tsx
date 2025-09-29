import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { theme } from "./theme";

export default function App() {
  const handleDelete = () => {
    Alert.alert("Hmm...", "Are you sure you want to destroy this item?", [
      {
        text: "Yes",
        onPress: () => console.log("Item destroyed"),
        style: "destructive",
      },
      { text: "No", style: "cancel" },
    ]);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          {" "}
          <Text style={styles.itemText}>Potion</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Destroy</Text>
          </TouchableOpacity>
        </View>
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
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "red",
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: { fontSize: 18, fontWeight: "200" },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
