import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useReducer } from "react";
import loginFormModel, { LoginForm } from "../models/login-form.model";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"

import LoginScreen from "../screens/LoginScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { getDatabase, ref, set } from "firebase/database";
import { RegisterForm } from "../models/register-form.model";
import RegisterScreen from "../screens/RegisterScreen";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Canvas"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export type RegisterFormAction =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "UPDATE_USERNAME"; payload: string };

const registerFormReducer = (
  formState: RegisterForm,
  action: RegisterFormAction
) => {
  const newFormState = { ...formState };
  switch (action.type) {
    case "UPDATE_EMAIL":
      newFormState.email = action.payload;
      break;
    case "UPDATE_PASSWORD":
      newFormState.password = action.payload;
      break;
    case "UPDATE_USERNAME":
      newFormState.username = action.payload;
      break;
    default:
      throw new Error("Unauthorized action !");
  }
  return newFormState;
};

const RegisterFormController = ({ navigation }: Props) => {
  const [model, dispatch] = useReducer(registerFormReducer, {
    email: "",
    password: "",
    username: "",
  } as RegisterForm);

  const { email, password, username } = model;

  const handleRegister = async () => {
    try {
      loginFormModel.parse(model);
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          const db: any = getDatabase();
          set(ref(db, "users/" + uid), {
            email,
            username,
            password,
            loginAt: new Date().toISOString(),
          });
          navigation.navigate("Login");
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      console.log(userCredentials.user.email);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <RegisterScreen
      model={model}
      onFieldChange={dispatch}
      onSubmit={handleRegister}
    />
  );
};

export default RegisterFormController;
