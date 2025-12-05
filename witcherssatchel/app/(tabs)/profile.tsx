import { Text, TouchableOpacity, FlatList } from "react-native";
import { theme } from "@/theme";
import { useUserStore } from "@/store/userStore";
import { usePotionStore } from "@/store/potionStore";
import { PotionCard } from "@/components/PotionCard";
import NoItems from "@/components/NoItems";
import WitcherMediaPlayer from "@/components/WitcherMediaPlayer";

export default function ProfileScreen() {
  const toggleHasOnbaorded = useUserStore((state) => state.toggleHasOnboarded);
  const potions = usePotionStore((state) => state.potions);

  return (
    <>
      <TouchableOpacity
        style={[
          theme.commonStyles.buttonRed,
          {
            marginBottom: 14,
            flex: 0,
            width: 300,
            margin: "auto",
          },
        ]}
        onPress={toggleHasOnbaorded}
      >
        <Text
          style={[
            theme.commonStyles.buttonText,
            { fontSize: 20, textAlign: "center" },
          ]}
        >
          Back to Welcome Screen
        </Text>
      </TouchableOpacity>
      {/* media player for witcher song */}
      <WitcherMediaPlayer />
      <FlatList
        data={potions}
        renderItem={(item) => <PotionCard potion={item.item} />}
        ListEmptyComponent={<NoItems message="No potions added yet!" />}
      />
    </>
  );
}
