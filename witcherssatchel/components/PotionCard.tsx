import { StyleSheet, View, Text } from "react-native";
import { theme } from "@/theme";
import { PotionType } from "@/store/potionStore";
import { Potion } from "./Potion";

export function PotionCard({ potion }: { potion: PotionType }) {
  return (
    <View style={styles.potionCard}>
      <View style={{ width: 80, height: 50 }}>
        <Potion size={30} imageUri={potion.imageUri} />
      </View>
      <View style={styles.details}>
        <Text numberOfLines={1} style={styles.potionName}>
          {potion.name}
        </Text>
        <Text style={styles.subtitle}>
          Water every {potion.stiringFrequencyDays} days
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  potionCard: {
    flexDirection: "row",
    shadowColor: theme.colorBlack,
    backgroundColor: theme.colorWhite,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  details: {
    padding: 14,
    justifyContent: "center",
  },
  potionName: {
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colorGray,
  },
});
