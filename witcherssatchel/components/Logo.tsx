import { Image, useWindowDimensions } from "react-native";

export function Logo() {
  const { width } = useWindowDimensions();

  const imageSize = Math.min(width / 3, 400);

  return (
    <Image
      source={require("@/assets/logo.png")}
      style={{ width: imageSize, height: imageSize, marginBottom: 12 }}
    />
  );
}
