import { StyleSheet, Text, TextInput, View } from "react-native";
import { theme } from "../theme";
import SatchelItem from "../components/SatchelItem";
import { Link } from "expo-router";
import { useState } from "react";

type SatchelItemType = {
  id: string;
  name: string;
};

const initialList: SatchelItem[] = [
  { id: "1", name: "Potion", isCompleted: false },
  { id: "2", name: "Antidote", isCompleted: true },
  { id: "3", name: "Bomb", isCompleted: false },
];

export default function App() {
  const [satchelItem, setSatchelItem] = useState("");
  const [satchelList, setSatchelList] =
    useState<SatchelItemType[]>(initialList);

  const handleSubmit = () => {
    if (satchelItem) {
      const newSatchList = [
        {
          id: new Date().toTimeString(),
          name: satchelItem,
        },
        ...satchelList,
      ];
      setSatchelList(newSatchList);
      setSatchelItem("");
    }
  };
  return (
    <>
      <View style={theme.commonStyles.pageContainer}>
        <Text style={styles.subtitle}>Need to talley your trophies?</Text>
        <Link href="/talley" style={theme.commonStyles.link}>
          Go to monster talley
        </Link>
        <TextInput
          style={theme.commonStyles.textInput}
          placeholder="E.g. Potion"
          value={satchelItem}
          onChangeText={setSatchelItem}
          onSubmitEditing={handleSubmit}
        />
        {satchelList.map((item) => (
          <SatchelItem key={item.id} name={item.name} />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subtitle: { textAlign: "center", marginBottom: 18, fontSize: 24 },
});
