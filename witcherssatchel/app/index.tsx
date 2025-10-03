import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  FlatList,
  LayoutAnimation,
} from "react-native";
import { theme } from "../theme";
import SatchelItem from "../components/SatchelItem";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { getFromStorage, saveToStorage } from "../utils/storage";
import * as Haptics from "expo-haptics";

const storageKey = "satchelItems";

type SatchelItemType = {
  id: string;
  name: string;
  completedAtTimeStamp?: number;
  lastUpdatedTimestamp: number;
};

export default function App() {
  const [satchelItem, setSatchelItem] = useState("");
  const [satchelList, setSatchelList] = useState<SatchelItemType[]>([]);

  useEffect(() => {
    const fetchInitial = async () => {
      const data = await getFromStorage(storageKey);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSatchelList(data);
      }
    };
    fetchInitial();
  }, []);

  const handleSubmit = () => {
    if (satchelItem) {
      const newSatchList = [
        {
          id: new Date().toTimeString(),
          lastUpdatedTimestamp: Date.now(),
          name: satchelItem,
        },
        ...satchelList,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setSatchelList(newSatchList);
      saveToStorage(storageKey, newSatchList);
      setSatchelItem("");
    }
  };

  const handleDelete = (id: string) => {
    const newSatchelList = satchelList.filter((item) => item.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSatchelList(newSatchelList);

    saveToStorage(storageKey, newSatchelList);
  };

  const handleToggleComplete = (id: string) => {
    const newSatchelList = satchelList.map((item) => {
      if (item.id === id) {
        if (item.completedAtTimeStamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          completedAtTimeStamp: item.completedAtTimeStamp
            ? undefined
            : Date.now(),
          lastUpdatedTimestamp: Date.now(),
        };
      }
      return item;
    });
    saveToStorage(storageKey, newSatchelList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        data={orderSatchelList(satchelList)}
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

function orderSatchelList(satchelList: SatchelItemType[]) {
  return satchelList.sort((item1, item2) => {
    if (item1.completedAtTimeStamp && item2.completedAtTimeStamp) {
      return item2.completedAtTimeStamp - item1.completedAtTimeStamp;
    }

    if (item1.completedAtTimeStamp && !item2.completedAtTimeStamp) {
      return 1;
    }

    if (!item1.completedAtTimeStamp && item2.completedAtTimeStamp) {
      return -1;
    }

    if (!item1.completedAtTimeStamp && !item2.completedAtTimeStamp) {
      return item2.lastUpdatedTimestamp - item1.lastUpdatedTimestamp;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  subtitle: { textAlign: "center", marginBottom: 18, fontSize: 24 },
});
