import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import { CalculatorButton } from "@/components/CalculatorButton";
import { getFromStorage, saveToStorage } from "@/utils/storage";
import { theme } from "@/theme";
import { useRouter } from "expo-router";
import { CalcRecord } from "@/types/calculatorTypes";

export const calcStorageKey = "calcHistory";

export function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState<CalcRecord[]>([]);
  const router = useRouter();

  const nums = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];
  const ops = ["+", "-", "*", "/"];

  useEffect(() => {
    const init = async () => {
      const stored: CalcRecord[] = (await getFromStorage(calcStorageKey)) || [];
      setHistory(stored);
    };
    init();
  }, []);

  const handleInput = (val: string) => {
    const lastChar = expression.slice(-1);

    // Operator logic
    if (ops.includes(val)) {
      if (expression.length === 0) return; // cannot start with operator
      if (ops.includes(lastChar)) return; // prevent consecutive operators
    }

    // Decimal logic
    if (val === ".") {
      const segments = expression.split(new RegExp(`[\\+\\-\\*/]`));
      const currentNumber = segments[segments.length - 1];
      if (currentNumber.includes(".")) return; // prevent multiple decimals
    }

    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression("");
    setResult("0");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = async () => {
    if (!expression.trim()) return;

    try {
      const safeExpr = expression.replace(/[^0-9+\-*/.]/g, "");
      const lastChar = safeExpr.slice(-1);

      if (ops.includes(lastChar)) {
        setResult("Error");
        return;
      }

      const calcResult = eval(safeExpr);
      const formatted = calcResult.toString();
      setResult(formatted);

      const newRecord: CalcRecord = {
        expression: expression,
        result: formatted,
        calculatedAt: Date.now(),
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      await saveToStorage(calcStorageKey, updatedHistory);

      Keyboard.dismiss();
    } catch {
      setResult("Error");
    }
  };

  return (
    <View
      style={[
        theme.commonStyles.pageContainer,
        styles.container,
        { backgroundColor: "black" },
      ]}
    >
      {/* Display */}
      <View style={styles.displayContainer}>
        <TextInput
          style={styles.input}
          value={expression}
          onChangeText={setExpression}
          placeholder="Enter calculation..."
          placeholderTextColor="#777"
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleCalculate}
          blurOnSubmit={false}
        />
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      </View>

      {/* Buttons */}
      <ScrollView contentContainerStyle={styles.buttonGrid}>
        {/* Numbers + decimal */}
        <View style={styles.buttonRow}>
          {nums.map((num) => (
            <CalculatorButton
              key={num}
              numOrOp={num}
              onPress={() => handleInput(num)}
            />
          ))}
        </View>

        {/* Operators + equals */}
        <View style={styles.buttonRow}>
          {ops.map((op) => (
            <CalculatorButton
              key={op}
              numOrOp={op}
              onPress={() => handleInput(op)}
            />
          ))}
          <CalculatorButton numOrOp="=" onPress={handleCalculate} />
        </View>

        {/* Clear / Backspace / History */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[theme.commonStyles.button, styles.clearButton]}
            onPress={handleClear}
          >
            <Text style={{ color: "white" }}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[theme.commonStyles.button, styles.clearButton]}
            onPress={handleBackspace}
          >
            <Text style={{ color: "white" }}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[theme.commonStyles.button, styles.historyButton]}
            onPress={() => router.push("/(tabs)/calculator/history")}
          >
            <Text style={{ color: theme.colorYellow }}>History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-start" },
  displayContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  input: {
    color: "white",
    fontSize: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingBottom: 8,
    marginBottom: 12,
  },
  resultContainer: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "flex-end",
    height: 48,
  },
  resultText: { color: theme.colorDarkerRed, fontSize: 28, fontWeight: "600" },
  buttonGrid: { padding: 16 },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  clearButton: {
    backgroundColor: "#d33",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  historyButton: {
    backgroundColor: "#222",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});
