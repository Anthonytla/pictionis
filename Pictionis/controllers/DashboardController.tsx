import { getDatabase, ref, onValue, get } from "firebase/database";
import { View } from "react-native";
import DashboardScreen from "../screens/DashboardScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { useEffect, useState } from "react";
import {useAtomValue} from "jotai/index";
import {authUserAtom} from "../stores/authUserAtom";

type GameScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Game"
>;

interface Props {
  navigation: GameScreenNavigationProp;
}
const DashboardController = ({ navigation }: Props) => {

  const authUser=useAtomValue(authUserAtom);
  const db = getDatabase();
  const [rooms, setRooms] = useState({});
  useEffect(() => {
    onValue(ref(db, "rooms/"), (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      setRooms(
        Object.entries(data).map(([roomId, payload]) => ({
          ...payload,
          roomId,
        }))
      );
    });
  }, []);

  return <DashboardScreen rooms={rooms} navigation={navigation} />;
};

export default DashboardController;
