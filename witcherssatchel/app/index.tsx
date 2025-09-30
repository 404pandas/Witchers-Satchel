import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  FlatList,
} from "react-native";
import { theme } from "../theme";
import SatchelItem from "../components/SatchelItem";
import { Link } from "expo-router";
import { useState } from "react";

type SatchelItemType = {
  id: string;
  name: string;
  completedAtTimeStamp?: number;
};

const initialList: SatchelItemType[] = [
  { id: "1", name: "Potion" },
  { id: "2", name: "Antidote" },
  { id: "3", name: "Bomb" },
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

  const handleDelete = (id: string) => {
    const newSatchelList = satchelList.filter((item) => item.id !== id);
    setSatchelList(newSatchelList);
  };

  const handleToggleComplete = (id: string) => {
    const newSatchelList = satchelList.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completedAtTimeStamp: item.completedAtTimeStamp
            ? undefined
            : Date.now(),
        };
      }
      return item;
    });
    setSatchelList(newSatchelList);
  };
  return (
    <>
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
      <FlatList
        data={satchelList}
        ListEmptyComponent={<Text>No items</Text>}
        renderItem={({ item }) => (
          <SatchelItem
            key={item.id}
            name={item.name}
            onDelete={() => handleDelete(item.id)}
            onToggleComplete={() => handleToggleComplete(item.id)}
            isCompleted={Boolean(item.completedAtTimeStamp)}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  subtitle: { textAlign: "center", marginBottom: 18, fontSize: 24 },
  contentContainer: { paddingBottom: 100 },
});
