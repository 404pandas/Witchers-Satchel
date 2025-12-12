import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { GwentCard, useGwentStore } from "@/store/gwentStore";

export default function GwentCardList() {
  const { cards, loading, error, fetchCards } = useGwentStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<GwentCard | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredCards = useMemo(() => {
    if (!debouncedQuery.trim()) return cards;
    const lower = debouncedQuery.toLowerCase();
    return cards.filter((c) => c.name?.toLowerCase().includes(lower));
  }, [cards, debouncedQuery]);

  if (loading) return <Text style={styles.loading}>Loading cards…</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <>
      {/* --- MODAL POPUP --- */}
      <Modal
        visible={!!selectedCard}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedCard(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectedCard(null)}
        >
          <Pressable style={styles.modalContent}>
            {selectedCard && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{
                    uri: `https://gwent.one/image/gwent/assets/card/art/high/${selectedCard.id.art}.jpg`,
                  }}
                  style={styles.modalArt}
                />

                <Text style={styles.modalName}>{selectedCard.name}</Text>

                <Text style={styles.modalMeta}>
                  {selectedCard.attributes.faction} •{" "}
                  {selectedCard.attributes.type} •{" "}
                  {selectedCard.attributes.rarity}
                </Text>

                <Text style={styles.modalAbility}>{selectedCard.ability}</Text>

                {selectedCard.flavor ? (
                  <Text style={styles.modalFlavor}>
                    “{selectedCard.flavor}”
                  </Text>
                ) : null}

                <Pressable
                  onPress={() => setSelectedCard(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeText}>Close</Text>
                </Pressable>
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* --- MAIN CARD LIST --- */}
      <FlatList
        data={filteredCards}
        keyExtractor={(card) => card.id.card.toString()}
        contentContainerStyle={styles.container}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={10}
        ListEmptyComponent={
          <Text style={styles.noResults}>No cards found</Text>
        }
        ListHeaderComponent={
          <TextInput
            style={styles.search}
            placeholder="Search cards by name…"
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
          />
        }
        renderItem={({ item: card }) => {
          const artUrl = `https://gwent.one/image/gwent/assets/card/art/high/${card.id.art}.jpg`;

          return (
            <Pressable onPress={() => setSelectedCard(card)}>
              <View style={styles.card}>
                <Image source={{ uri: artUrl }} style={styles.art} />

                <Text style={styles.name}>{card.name}</Text>
                <Text style={styles.faction}>{card.attributes.faction}</Text>

                <Text style={styles.meta}>
                  {card.attributes.type} • {card.attributes.rarity} •{" "}
                  {card.attributes.color}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 12,
  },
  search: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    marginTop: 12,
  },
  loading: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 18,
  },
  error: {
    marginTop: 40,
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
  noResults: {
    marginTop: 20,
    color: "#aaa",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    marginBottom: 26,
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 12,
  },
  art: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  faction: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 6,
  },
  meta: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 8,
  },

  /* --- MODAL STYLES --- */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    maxHeight: "85%",
  },
  modalArt: {
    width: "100%",
    height: 340,
    borderRadius: 10,
  },
  modalName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },
  modalMeta: {
    color: "#aaa",
    marginTop: 4,
  },
  modalAbility: {
    color: "#ddd",
    marginTop: 12,
    fontSize: 15,
  },
  modalFlavor: {
    color: "#bbb",
    fontStyle: "italic",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});
