import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
  set,
} from "firebase/database";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { Modal, Text, StyleSheet, View, Dimensions } from "react-native";
import { roomIdAtom } from "../stores/roomAtom";
import { statModalAtom } from "../stores/statModalAtom";
import { Player, StackParamList } from "../types";
import Button from "./Button";

const { height, width } = Dimensions.get("screen");
type StatNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Dashboard"
>;

interface Props {
  navigation: StatNavigationProp;
}

const StatModal = () => {
  const visibility = useAtomValue(statModalAtom);
  const setVisibility = useSetAtom(statModalAtom);
  const roomId = useAtomValue(roomIdAtom);
  const [users, setUsers] = useState<Player[]>([]);

  const navigation = useNavigation();
  const db = getDatabase();
  const usersRef = query(ref(db, "/players/" + roomId), orderByChild("points"));

  const resetRoom = () => {
    set(ref(db, "/rooms/" + roomId + "/round"), null);
    set(ref(db, "/rooms/" + roomId + "/currentIndex"), null);
    set(ref(db, "/rooms/" + roomId + "/currentWord"), null);
    set(ref(db, "/rooms/" + roomId + "/started"), null);
    set(ref(db, "/rooms/" + roomId + "/timer"), null);
  };
  useEffect(() => {
    onValue(usersRef, (snapshot) => {
      if (!snapshot.exists()) return;
      setUsers(
        Object.entries(snapshot.val())
          .map(([uid, payload]) => ({
            ...payload,
            uid,
          }))
          .sort((a, b) => b.points - a.points) as Player[]
      );
      console.log(users);
    });
  }, []);

  if (visibility == false) return null;
  return (
    <View style={styles.centeredView}>
      <Modal visible={visibility} transparent={true} animationType="fade">
        <View style={styles.innerCenteredView}>
          <View style={styles.modalView}>
            <Text style={styles.textHeader}>RESULTS</Text>
            <View style={styles.innerModalContainer}>
              {users.map((c, index) => (
                <View key={c.uid} style={styles.item}>
                  <View style={styles.info}>
                    <Text
                      style={{
                        marginRight: 10,
                        fontWeight: "500",
                        fontSize: 18,
                      }}
                    >
                      {index + 1}
                    </Text>
                    <Text style={{ fontSize: 18 }}>{c.username}</Text>
                  </View>
                  <Text style={{ fontSize: 18 }}>{c.points} Pts</Text>
                </View>
              ))}
              <View style={styles.btnContainer}>
                <Button
                  title="Done"
                  onPress={() => {
                    setVisibility(false);
                    resetRoom();
                    navigation.navigate("Dashboard", {});
                  }}
                  variant="green"
                  size="sm"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height,
    width,
    backgroundColor: "black",
    opacity: 0.2,
    // left: 0,
    // top: 0,
    // right: 0,
    // bottom: 0,
    zIndex: 10,
  },
  innerCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    // height: 100,
    // width: 200,
    // padding: 20,
    zIndex: 10,
    width: 200,
  },
  item: {
    flexDirection: "row",
    fontWeight: "bold",
    justifyContent: "space-between",
    fontSize: 18,
    // borderBottomWidth: 2,
    // borderBottomColor: "gray",
    // opacity: 0.5,
    paddingVertical: 5,
  },
  info: {
    // width: "50%",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  textHeader: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
    backgroundColor: "#00cccc",
    color: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 10,
    // borderRadius: 10,
  },
  innerModalContainer: {
    padding: 10,
  },
  btnContainer: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default StatModal;
