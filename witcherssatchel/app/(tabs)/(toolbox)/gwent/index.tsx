import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";
import { useGwentStore } from "@/store/gwentStore";

export default function GwentCardList() {
  const { cards, loading, error, fetchCards } = useGwentStore();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // ⏳ Debounce the search input — prevents crashes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchCards();
  }, []);

  // 🔍 Memoized and debounced search (fast & safe)
  const filteredCards = useMemo(() => {
    if (!debouncedQuery.trim()) return cards;

    const lower = debouncedQuery.toLowerCase();

    return cards.filter((c) => c.name.toLowerCase().includes(lower));
  }, [cards, debouncedQuery]);

  if (loading) return <Text style={styles.loading}>Loading cards…</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <FlatList
      data={filteredCards}
      keyExtractor={(card) => card.id.card.toString()}
      contentContainerStyle={styles.container}
      initialNumToRender={12}
      maxToRenderPerBatch={8}
      windowSize={10}
      ListEmptyComponent={<Text style={styles.noResults}>No cards found</Text>}
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
          <View style={styles.card}>
            <Image source={{ uri: artUrl }} style={styles.art} />

            <Text style={styles.name}>{card.name}</Text>
            <Text style={styles.faction}>{card.attributes.faction}</Text>

            <Text style={styles.meta}>
              {card.attributes.type} • {card.attributes.rarity} •{" "}
              {card.attributes.color}
            </Text>

            <Text style={styles.ability}>{card.ability}</Text>

            {card.flavor ? (
              <Text style={styles.flavor}>“{card.flavor}”</Text>
            ) : null}
          </View>
        );
      }}
    />
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
  ability: {
    color: "#ddd",
    marginTop: 6,
  },
  flavor: {
    color: "#999",
    fontStyle: "italic",
    marginTop: 6,
  },
});
