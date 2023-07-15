import { getDatabase, onValue } from "@firebase/database";
import { ref, set } from "firebase/database";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { roomIdAtom } from "../stores/roomAtom";

interface Props {
  word: string;
  timer: number;
}

const Solution = ({ word, timer }: Props) => {
  const roomId = useAtomValue(roomIdAtom);
  const db = getDatabase();
  const [countDown, setCountDown] = useState(0);
  useEffect(() => {
    onValue(ref(db, "/rooms/" + roomId + "/countDown"), (snapshot) => {
      setCountDown(snapshot.val());
    });
  }, []);
  const limit = Math.floor(countDown / word.length);

  const [array, setArray] = useState<string[]>([]);
  useEffect(() => {
    setArray([...Array(word.length)].fill("___"));
  }, [word]);
  useEffect(() => {
    if (array.indexOf("___") == -1) {
      return;
    }
    if (
      (countDown - timer) % limit == 0 &&
      countDown - timer != 0 &&
      timer !== 0
    ) {
      var index = Math.floor(Math.random() * word.length);
      while (array[index] != "___") {
        index = Math.floor(Math.random() * word.length);
      }
      array[index] = "_" + word[index] + "_";
      setArray(array);
    }
  }, [timer, array]);

  return (
    <>
      {array.map((c) => (
        <Text style={styles.hidden}>{c}</Text>
      ))}
    </>
  );
};

export default Solution;

const styles = StyleSheet.create({
  timer: {
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 4,
    width: 50,
    marginBottom: 3,
    color: "white",
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
    fontSize: 20,
  },
  hidden: {
    fontWeight: "600",
    fontSize: 20,
    marginHorizontal: 5,
    color: "white",
  },
});
