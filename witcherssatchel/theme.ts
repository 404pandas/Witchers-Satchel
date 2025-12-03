import { ViewStyle } from "react-native";

export const theme = {
  colorRed: "#ff0000",
  colorWhite: "#ffffff",
  colorBlack: "#000000",
  colorLightRed: "#ff4d4d",
  colorDarkBlue: "#014285",
  colorGray: "#404040",
  colorDarkerRed: "#cc0000",
  commonStyles: {
    pageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffffff",
      paddingHorizontal: 20,
      color: "hsl(0 0% 96%)",
      marginTop: 10,
    } as ViewStyle,
    link: {
      textAlign: "center",
      marginBottom: 18,
      fontSize: 18,
      color: "#014285",
      fontStyle: "italic",
    } as ViewStyle,
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 8,
    } as ViewStyle,
    buttonRed: {
      backgroundColor: "#ff0000",
      marginTop: 48,
      paddingHorizontal: 48,
      paddingVertical: 12,
      borderRadius: 6,
    } as ViewStyle,

    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    } as ViewStyle,
    boldTitle: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 12,
      marginTop: 12,
      color: "#000000",
    } as ViewStyle,
    textInput: {
      borderWidth: 1,
      borderColor: "#ff4d4d",
      borderRadius: 8,
      padding: 10,
      width: "100%",
      marginBottom: 20,
    } as ViewStyle,
    textShadow: {
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "black",
      shadowOpacity: 0.8,
      shadowRadius: 2,
      marginBottom: 12,
    } as ViewStyle,
    scriptText: {
      fontFamily: "StoryScript-Regular",
    } as ViewStyle,
    buttonRow: {
      row: {
        flexDirection: "row",
        marginBottom: 24,
      },
    } as ViewStyle,
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // light gray
      backgroundColor: "#bebebe",
      paddingVertical: 8,
    } as ViewStyle,

    keyName: {
      fontSize: 20,
      color: "#000000",
      textAlign: "center",
      marginBottom: 4,
    } as ViewStyle,
    value: {
      fontWeight: "bold",
      color: "#ff4d4d",
      fontSize: 24,
    } as ViewStyle,
  },
};
