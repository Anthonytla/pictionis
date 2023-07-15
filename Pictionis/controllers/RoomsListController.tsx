import { useEffect, useState } from "react";
import { StyleSheet, Dimensions, GestureResponderEvent } from "react-native";
import CanvasScreen from "../screens/CanvasScreen";
import { auth } from "../firebase";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useAtomValue } from "jotai";
import { roomIdAtom } from "../stores/roomAtom";
import RoomsListScreen from "../screens/RoomsListScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Room, StackParamList } from "../types";

type GameScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "RoomsList"
>;

interface Props {
  navigation: GameScreenNavigationProp;
}

const RoomsListController = ({ navigation }: Props) => {
  const db = getDatabase();
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    onValue(ref(db, "/rooms/"), (res) => {
      if (!res.exists()) return;
      const roomsList = Object.entries(res.val()).map(
        ([roomId, room]: [string, any]) => ({ ...room, roomId })
      ) as Room[];
      setRooms(roomsList);
    });
  }, []);
  return <RoomsListScreen rooms={rooms} navigation={navigation} />;
};

export default RoomsListController;
