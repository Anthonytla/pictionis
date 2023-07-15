import uuid from "react-native-uuid";
import roomFormModel, { RoomForm } from "../models/room-form.model";
import { useReducer, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getDatabase, ref, set } from "firebase/database";
import LoginScreen from "../screens/LoginScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import RoomScreen from "../screens/RoomScreen";
import { faker } from "@faker-js/faker";
import { useAtomValue, useSetAtom } from "jotai";
import { authUserAtom } from "../stores/authUserAtom";
import { roomIdAtom } from "../stores/roomAtom";
import { useChatGpt } from "../hooks/useChatGpt";
import LoadingScreen from "../screens/LoadingScreen";
import { useFocusEffect } from "@react-navigation/native";
type LoginScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Canvas"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}
export type RoomFormAction =
  | { type: "UPDATE_PLAYER_NUMBER"; payload: number }
  | { type: "UPDATE_COUNTDOWN"; payload: number }
  | { type: "UPDATE_ROUND"; payload: number };

const roomFormReducer = (formState: RoomForm, action: RoomFormAction) => {
  const newFormState = { ...formState };
  switch (action.type) {
    case "UPDATE_PLAYER_NUMBER":
      newFormState.playerNumber = action.payload;
      break;
    case "UPDATE_COUNTDOWN":
      newFormState.countDown = action.payload;
      break;
    case "UPDATE_ROUND":
      newFormState.maxRound = action.payload;
      break;
    default:
      throw new Error("Unauthorized action !");
  }
  return newFormState;
};

const RoomFormController = ({ navigation }: Props) => {
  const [model, dispatch] = useReducer(roomFormReducer, {
    playerNumber: 0,
    countDown: 0,
    maxRound: 0,
  } as RoomForm);

  const { fetchingWords, getRandomWords } = useChatGpt();

  const { playerNumber, countDown, maxRound } = model;

  const [name] = useState(faker.address.city());
  const user = useAtomValue(authUserAtom);
  const db = getDatabase();
  const setRoomId = useSetAtom(roomIdAtom);

  const join = async () => {
    if (!user) return;
    await set(ref(db, `/players/${name}/${user.uid}`), {
      username: user.username,
      points: 0,
      connected: false,
      isAdmin: true,
    });
    setRoomId(name);
    navigation.navigate("Game");
  };

  const createRoom = async () => {
    try {
      roomFormModel.parse(model);
      const words = await getRandomWords();
      await set(ref(db, "rooms/" + name), {
        playerNumber,
        countDown,
        maxRound,
        words,
      });
      await join();
      // navigation.navigate("RoomsList");
    } catch (err: any) {
      console.error(err.message);
    }
  };
  if (fetchingWords) return <LoadingScreen />;
  return (
    <RoomScreen
      model={model}
      onFieldChange={dispatch}
      onCreate={createRoom}
      roomName={name}
    />
  );
};

export default RoomFormController;
