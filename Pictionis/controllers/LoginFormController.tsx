import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useReducer } from "react";
import loginFormModel, { LoginForm } from "../models/login-form.model";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginScreen from "../screens/LoginScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { auth } from "../firebase"

import { getDatabase, ref, set } from "firebase/database";
import firebase from "firebase/compat";
import {useAtomValue} from "jotai";
import {authUserAtom} from "../stores/authUserAtom";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Canvas"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export type LoginFormAction =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string };

const loginFormReducer = (formState: LoginForm, action: LoginFormAction) => {
  const newFormState = { ...formState };
  switch (action.type) {
    case "UPDATE_EMAIL":
      newFormState.email = action.payload;
      break;
    case "UPDATE_PASSWORD":
      newFormState.password = action.payload;
      break;
    default:
      throw new Error("Unauthorized action !");
  }
  return newFormState;
};

const LoginFormController = ({ navigation }: Props) => {
  const [model, dispatch] = useReducer(loginFormReducer, {
    email: "",
    password: "",
  } as LoginForm);

  const { email, password } = model;

  const handleLogin = async () => {
    try {
      loginFormModel.parse(model);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          const db: any = getDatabase();
          await set(
            ref(db, "users/" + uid + "/loginAt"),
            new Date().toISOString()
          );
          navigation.navigate("Dashboard");
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
      console.log(`${userCredentials.user.email} is logged in !`);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <LoginScreen model={model} onFieldChange={dispatch} onLogin={handleLogin} />
  );
};

export default LoginFormController;
