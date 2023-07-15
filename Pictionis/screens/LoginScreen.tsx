import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Dispatch } from "react";
import { LoginForm } from "../models/login-form.model";
import { LoginFormAction } from "../controllers/LoginFormController";
import Button from "../components/Button";
import MyInput from "../components/MyInput";

interface Props {
  model: LoginForm;
  onFieldChange: Dispatch<LoginFormAction>;
  onLogin: () => Promise<void>;
}

const LoginScreen = ({ model, onFieldChange, onLogin }: Props) => {
  const { email, password } = model;

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require("../assets/logo.png")}
            resizeMode="cover"
            style={styles.image}
          ></ImageBackground>
        </View>
        <MyInput
          placeholder="Email"
          value={email}
          onChangeText={(email) =>
            onFieldChange({ type: "UPDATE_EMAIL", payload: email })
          }
        />
        <MyInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(password) =>
            onFieldChange({ type: "UPDATE_PASSWORD", payload: password })
          }
        />
      </View>
      <View>
        <Button title="Login" onPress={onLogin} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 100,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    paddingLeft: 8,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    margin: 10,
    width: 220,
    height: 50,
  },
});
