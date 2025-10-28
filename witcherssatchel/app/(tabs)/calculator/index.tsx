import { Calculator } from "@/components/Calculatorr";
import { theme } from "@/theme";
import { View } from "react-native";

export default function CalculatorScreen() {
  return (
    <View
      style={[
        theme.commonStyles.pageContainer,
        { backgroundColor: "black", flex: 1 },
      ]}
    >
      <Calculator />
    </View>
  );
}
