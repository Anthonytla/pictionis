import { ImageBackground, StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { useAtom, useAtomValue } from "jotai";
import { auth } from "../firebase";
import { authUserAtom } from "../stores/authUserAtom";
import { getAuth } from "firebase/auth";
import Button from "../components/Button";
import { useEffect } from "react";

type LoginScreenNavigationProp = NativeStackNavigationProp<StackParamList>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  

  const goTo = (screen: keyof StackParamList) => {
    navigation.navigate(screen);
  };

  const authUser = useAtomValue(authUserAtom);
  useEffect(()=>{
    console.log(authUser);
    
  })
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/logo.png")}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      {authUser ? (
        <Button title="Logout" onPress={() => auth.signOut()} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="SIGN-IN" onPress={() => goTo("Login")} />
          <Button title="SIGN-UP" onPress={() => goTo("Register")} />
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    margin: 10,
    height: 50,
    width: 220,
  },
  imageContainer: {
    alignItems: "center",
  },
  buttonContainer: {
    justifyContent: "center",
    margin: 5,
  },
});
