import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Dispatch } from "react";
import { LoginFormAction } from "../controllers/LoginFormController";
import { RegisterForm } from "../models/register-form.model";
import { RegisterFormAction } from "../controllers/RegisterFormController";
import MyInput from "../components/MyInput";
import Button from "../components/Button";

interface Props {
  model: RegisterForm;
  onFieldChange: Dispatch<RegisterFormAction>;
  onSubmit: () => Promise<void>;
}

const RegisterScreen = ({ model, onFieldChange, onSubmit }: Props) => {
  const { email, password, username } = model;

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
          placeholder="Username"
          value={username}
          onChangeText={(username) =>
            onFieldChange({ type: "UPDATE_USERNAME", payload: username })
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
        <Button title="Register" onPress={onSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 100,
    backgroundColor: "#00cccc",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "black",
    paddingLeft: 8,
  },
  image: {
    margin: 10,
    width: 220,
    height: 50,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
