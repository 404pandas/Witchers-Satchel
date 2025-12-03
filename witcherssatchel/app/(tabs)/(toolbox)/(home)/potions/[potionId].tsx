import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { usePotionStore } from "@/store/potionStore";
import { differenceInCalendarDays, format } from "date-fns";

import { theme } from "@/theme";
import { useEffect } from "react";
import { Potion } from "@/components/Potion";
import { WitcherSatchelButton } from "@/components/WitcherSatchelButton";

const fullDateFormat = "LLL d yyyy, h:mm aaa";

export default function PotionDetails() {
  const router = useRouter();
  const stirPotion = usePotionStore((store) => store.stirPotion);
  const removePotion = usePotionStore((store) => store.removePotion);
  const params = useLocalSearchParams();
  const potionId = params.potionId;
  const potion = usePotionStore((state) =>
    state.potions.find((potion) => String(potion.id) === potionId)
  );
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: potion?.name,
    });
  }, [potion?.name, navigation]);

  const handleStirPotion = () => {
    if (typeof potionId === "string") {
      stirPotion(potionId);
    }
  };

  const handleDeletePotion = () => {
    if (!potion?.id) {
      return;
    }

    Alert.alert(
      `Are you sure you want to delete ${potion?.name}?`,
      "It will be gone for good",
      [
        {
          text: "Yes",
          onPress: () => {
            removePotion(potion.id);
            router.navigate("/");
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  if (!potion) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          Potion with ID {potionId} not found
        </Text>
        <Link href="/new" asChild>
          <Pressable style={styles.addPotionButton}>
            <Text style={styles.addPotionText}>Add a potion now</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.detailsContainer}>
      <View style={{ alignItems: "center" }}>
        <Potion imageUri={potion.imageUri} />
        <View style={styles.spacer} />
        <Text style={styles.key}>Stir me every</Text>
        <Text style={styles.value}>{potion.stiringFrequencyDays} days</Text>
        <Text style={styles.key}>Last stirred at</Text>
        <Text style={styles.value}>
          {potion.lastStirredAtTimestamp
            ? `${format(potion.lastStirredAtTimestamp, fullDateFormat)}`
            : "Never 😟"}
        </Text>
        <Text style={styles.key}>Days since last stirred</Text>
        <Text style={styles.value}>
          {potion.lastStirredAtTimestamp
            ? differenceInCalendarDays(
                Date.now(),
                potion.lastStirredAtTimestamp
              )
            : "N/A"}
        </Text>
      </View>
      <WitcherSatchelButton title="Stir me!" onPress={handleStirPotion} />
      <Pressable style={styles.deleteButton} onPress={handleDeletePotion}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colorWhite,
  },
  notFoundText: {
    fontSize: 18,
  },
  detailsContainer: {
    padding: 12,
    backgroundColor: theme.colorWhite,
    flex: 1,
    justifyContent: "center",
  },
  key: {
    marginRight: 8,
    fontSize: 16,
    color: theme.colorBlack,
    textAlign: "center",
  },
  value: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  deleteButton: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: theme.colorGray,
    fontWeight: "bold",
  },
  spacer: {
    height: 18,
  },
  addPotionButton: {
    backgroundColor: theme.colorDarkerRed,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  addPotionText: {
    color: theme.colorWhite,
    fontWeight: "bold",
    fontSize: 16,
  },
});
