import { Image, useWindowDimensions } from "react-native";

type Props = {
  size?: number;
};

export function Potion({ size }: Props) {
  const { width } = useWindowDimensions();

  const imageSize = size ?? Math.min(width / 3, 400);

  return (
    <Image
      source={require("@/assets/potion.png")}
      style={{
        width: imageSize + 10,
        height: imageSize + 90,
        marginBottom: 12,
      }}
    />
  );
}
