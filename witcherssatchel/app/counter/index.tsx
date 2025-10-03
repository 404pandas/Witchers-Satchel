import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function CountdownTimer() {
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsElapsed((value) => value + 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <Text>{secondsElapsed}</Text>;
}
