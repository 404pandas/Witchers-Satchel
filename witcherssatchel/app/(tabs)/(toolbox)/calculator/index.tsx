import { Calculator } from "@/components/Calculatorr";
import { theme } from "@/theme";
import { KeyboardAvoidingView } from "react-native";

export default function CalculatorScreen() {
  return (
    <KeyboardAvoidingView
      style={[
        theme.commonStyles.pageContainer,
        { backgroundColor: "black", flex: 1 },
      ]}
    >
      <Calculator />
    </KeyboardAvoidingView>
  );
}
