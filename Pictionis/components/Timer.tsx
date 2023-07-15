import { Text, View, StyleSheet, Button } from "react-native";

interface Props {
  timer: number;
}

const Timer = ({ timer }: Props) => {
  return (
    <View style={styles.timer}>
      <Text style={styles.text}>
        {new Date(timer * 1000).toISOString().substring(14, 19)}
      </Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  timer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 4,
    marginBottom: 3,
    color: "white",
    borderRadius: 10,
  },
  text: {
    textAlign: "center",
    color: "#00cccc",
    fontWeight: "800",
    fontSize: 20,
  },
});
