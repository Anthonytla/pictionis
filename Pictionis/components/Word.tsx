import { Text, View, StyleSheet, Button } from "react-native";

interface Props {
  word: string;
}

const Word = ({ word }: Props) => {
  return (
    <View style={styles.word}>
      <Text style={{ color: "white", fontSize: 20 }}>Your word is : </Text>
      <Text style={styles.text}>{word}</Text>
    </View>
  );
};

export default Word;

const styles = StyleSheet.create({
  word: {
    alignItems: "center",
    // backgroundColor: "orange",
    padding: 4,
    marginBottom: 3,
    marginTop: 5,
    color: "white",
    flexDirection: "row",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
    fontSize: 20,
  },
});
