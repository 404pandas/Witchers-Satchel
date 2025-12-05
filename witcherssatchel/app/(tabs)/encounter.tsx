import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bestiary from "@/assets/beastiary.json";
import { theme } from "@/theme";

export default function EncounterScreen() {
  const [potions, setPotions] = useState<any[]>([]);
  const [monster, setMonster] = useState<any | null>(null);
  const [result, setResult] = useState<null | {
    win: boolean;
    message: string;
  }>(null);
  const [selectedPotions, setSelectedPotions] = useState<any[]>([]);

  useEffect(() => {
    loadPotions();
    rollMonster();
  }, []);

  const loadPotions = async () => {
    try {
      const data = await AsyncStorage.getItem(
        "witchers-satchell-potions-store"
      );

      if (data) {
        const parsed = JSON.parse(data);
        const potionList = parsed?.state?.potions ?? [];
        setPotions(potionList);
      }
    } catch (err) {
      console.error("Error loading potions:", err);
    }
  };

  const rollMonster = () => {
    setResult(null);
    const random = bestiary[Math.floor(Math.random() * bestiary.length)];
    setMonster(random);
  };

  // Toggle potion selection
  const togglePotion = (potion: any) => {
    setSelectedPotions((prev) =>
      prev.includes(potion)
        ? prev.filter((p) => p.id !== potion.id)
        : [...prev, potion]
    );
  };

  /** ✔ SIGN COMBAT: win if sign matches vulnerability */
  const handleSign = (sign: string) => {
    if (!monster) return;

    const vuln =
      monster?.signVulnerability ||
      monster?.sign_weakness ||
      monster?.signWeakness ||
      monster?.weakness ||
      monster?.vulnerability ||
      monster?.stats?.signVulnerability ||
      null;

    if (!vuln) {
      alert("⚠️ This monster has no sign vulnerability listed.");
      return;
    }

    const win = vuln.toLowerCase() === sign.toLowerCase();
    alert(
      win
        ? "🎉 Victory! Correct sign!"
        : `💀 Defeated! Correct sign was ${vuln}.`
    );

    setResult({
      win,
      message: win ? "You succeeded!" : `Monster's weakness was ${vuln}`,
    });

    if (selectedPotions.length > 0) {
      // Consume potions: remove selected potions from state
      const remainingPotions = potions.filter(
        (p) => !selectedPotions.find((sp) => sp.id === p.id)
      );
      setPotions(remainingPotions);
      setSelectedPotions([]);

      // Update AsyncStorage
      try {
        AsyncStorage.setItem(
          "witchers-satchell-potions-store",
          JSON.stringify({ state: { potions: remainingPotions } })
        );
      } catch (err) {
        console.error("Error updating potions:", err);
      }
    }
  };

  if (!monster) return null;

  const SIGNS = ["Aard", "Igni", "Yrden", "Quen", "Axii"];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={[theme.commonStyles.boldTitle, styles.header]}>
        Random Encounter
      </Text>

      {/* Monster */}
      <View style={styles.monsterCard}>
        <Text style={[theme.commonStyles.scriptText, styles.monsterName]}>
          {monster.beastName}
        </Text>
        <Image
          source={{ uri: monster.imageUrl }}
          style={styles.monsterImage}
          resizeMode="contain"
        />

        <View style={styles.stats}>
          {Object.entries(monster.stats).map(([key, value]) => {
            if (key === "loot") return null;
            return (
              <Text key={key} style={styles.statLine}>
                {key.toUpperCase()}:{" "}
                <Text style={styles.statValue}>{String(value)}</Text>
              </Text>
            );
          })}
        </View>
      </View>

      {/* Potions */}
      <Text style={[theme.commonStyles.boldTitle, styles.sectionTitle]}>
        Your Potions
      </Text>
      <View style={styles.potionList}>
        {potions.length === 0 ? (
          <Text style={styles.noPotions}>No potions stored.</Text>
        ) : (
          potions.map((potion) => (
            <TouchableOpacity
              key={potion.id}
              onPress={() => togglePotion(potion)}
              style={{
                backgroundColor: selectedPotions.includes(potion)
                  ? "#555"
                  : "transparent",
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 8,
                marginVertical: 2,
              }}
            >
              <Text style={styles.potionItem}>• {potion.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {selectedPotions.length > 0 && (
        <Text style={{ color: "#F2C800", marginLeft: 20, marginBottom: 10 }}>
          Potions being used: {selectedPotions.map((p) => p.name).join(", ")}
        </Text>
      )}

      {/* Signs */}
      <Text style={[theme.commonStyles.boldTitle, styles.sectionTitle]}>
        Cast a Sign
      </Text>
      <View style={styles.signList}>
        {SIGNS.map((sign) => (
          <TouchableOpacity
            key={sign}
            style={styles.signButton}
            onPress={() => handleSign(sign)}
          >
            <Text style={styles.signText}>{sign}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result */}
      {result && (
        <View
          style={[
            styles.resultBox,
            { borderColor: result.win ? "#4CAF50" : "#E53935" },
          ]}
        >
          <Text
            style={[
              styles.resultTitle,
              { color: result.win ? "#4CAF50" : "#E53935" },
            ]}
          >
            {result.win ? "Victory!" : "Defeat"}
          </Text>
          <Text style={styles.resultText}>{result.message}</Text>
        </View>
      )}

      {/* Re-Roll */}
      <TouchableOpacity
        style={theme.commonStyles.buttonRed}
        onPress={rollMonster}
      >
        <Text style={theme.commonStyles.buttonText}>Roll New Encounter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#010302" },
  header: {
    textAlign: "center",
    color: "#F2C800",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 32,
  },
  monsterCard: {
    backgroundColor: theme.colorWhite,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  monsterName: {
    fontSize: 28,
    color: theme.colorRed,
    marginBottom: 10,
  },
  monsterImage: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  stats: {
    marginTop: 14,
    width: "100%",
  },
  statLine: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  statValue: {
    color: theme.colorRed,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 20,
    marginLeft: 16,
    color: "#F2C800",
  },
  potionList: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
  },
  potionItem: {
    color: "#FFF",
    fontSize: 18,
    marginVertical: 2,
  },
  noPotions: {
    color: "#AAA",
    fontSize: 16,
  },

  /* Signs */
  signList: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  signButton: {
    backgroundColor: "#222",
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  signText: {
    color: "#F2C800",
    fontSize: 20,
    textAlign: "center",
  },

  /* Result Box */
  resultBox: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#111",
  },
  resultTitle: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
    color: "#DDD",
    textAlign: "center",
  },
});
