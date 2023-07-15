import { TextInput, StyleSheet } from "react-native";
import { TextInputProps } from "react-native-paper";

const MyInput = (props: TextInputProps) => {
  return <TextInput style={styles.input} {...props} />;
};

export default MyInput;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#00b3b3",
    borderRadius: 75,
    padding: 8,
    marginBottom: 8,
    width: 300,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "700",
  },
});
