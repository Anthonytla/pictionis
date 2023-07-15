import {
  FlatList,
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import useAuthUser from "../hooks/useAuthUser";
import { useAtomValue, useSetAtom } from "jotai";
import { roomIdAtom } from "../stores/roomAtom";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { authUserAtom } from "../stores/authUserAtom";
import { faker } from "@faker-js/faker";
import { IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import { useEffect, useState } from "react";

type GameScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "RoomsList"
>;
interface Props {
  item: { item: { roomId: string; playerNumber: string } };
  navigation: GameScreenNavigationProp;
}
const RoomItem = ({ item, navigation }: Props) => {
  const { roomId, playerNumber } = item.item;
  const user = useAtomValue(authUserAtom);
  const db = getDatabase();
  const setRoomId = useSetAtom(roomIdAtom);
  const [nbPlayers, setNbPlayers] = useState(0);

  // const image = { uri: faker.image.dataUri() };
  // console.log(image.uri);

  const join = () => {
    if (!user) return;
    set(ref(db, `/players/${roomId}/${user.uid}`), {
      username: user.username,
      points: 0,
      connected: false,
    });
    setRoomId(roomId);
    navigation.navigate("Game");
  };

  useEffect(() => {
    onValue(ref(db, "/players/" + roomId), (res) => {
      if (res.exists()) {
        const numberPlayersRaw = Object.keys(res.val()).length;
        setNbPlayers(numberPlayersRaw);
      }
    });
  }, []);
  return (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.text}>{roomId}</Text>
        <Text style={styles.text}>
          {nbPlayers}/{playerNumber}
        </Text>
      </View>
      <View>
        <TouchableOpacity style={styles.bottomRightIcon} onPress={join}>
          <Icon name="play" color="#00cccc" size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RoomItem;

const styles = StyleSheet.create({
  itemContainer: {
    // flex: 1,
    flexDirection: "row",
    height: 100,
    width: 300,
    // borderWidth: 2,
    // borderColor: "#3e7196",
    margin: 5,
    borderRadius: 20,
    // justifyContent: "flex-end",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 30,
    backgroundColor: "white",
  },
  image: {
    width: 20,
    height: 20,
  },
  buttonContainer: {},
  bottomRightIcon: {},
  text: {
    fontSize: 25,
    color: "#00cccc",
    textAlign: "left",
    fontWeight: "600",
  },
});
