import { View, StyleSheet, ActivityIndicator } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={100} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00cccc",
    justifyContent: "center",
  },
});

export default LoadingScreen;
