import { useAtomValue } from "jotai";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import RevealedWordModal from "../components/RevealedWordModal";
import Solution from "../components/Solution";
import StatModal from "../components/StatModal";
import Timer from "../components/Timer";
import Word from "../components/Word";
import CanvasController from "../controllers/CanvasController";
import ChatController from "../controllers/ChatController";
import { authUserAtom } from "../stores/authUserAtom";
import { Player, User } from "../types";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import PlayersController from "../controllers/PlayersController";
import Button from "../components/Button";
import { getDatabase, ref, set } from "firebase/database";
import { roomIdAtom } from "../stores/roomAtom";

interface Props {
  currentWord: string;
  timer: number | undefined;
  currentUserId: string;
  players: Player[];
  started: boolean;
  showStartButton: boolean;
  isAdmin: boolean;
  canStartGame: boolean
}

const GameScreen = ({
  currentWord,
  timer,
  currentUserId,
  players,
  started,
  showStartButton,
  isAdmin,
  canStartGame
}: Props) => {
  const currentUser = useAtomValue(authUserAtom);
  const { height, width } = Dimensions.get("window");
  const [consult, setConsult] = useState(false);
  const db = getDatabase();
  const roomId = useAtomValue(roomIdAtom);
  const startGame = () => {
    set(ref(db, "/rooms/" + roomId + "/started"), true);
  };

  return (
    <View
      style={{
        // borderWidth: 2,
        // borderColor: "red",
        backgroundColor: "#00cccc",
        position: "relative",
        height: "100%",
        paddingTop: 20,
        // margin: 10,
      }}
    >
      <RevealedWordModal />
      <View style={styles.timer}>
        {currentUser ? (
          <Text style={styles.points}>
            {players.find((player) => player.uid === currentUser.uid)?.points ??
              0}{" "}
            Pts
          </Text>
        ) : null}
        <Timer timer={timer as number} />
        {consult ? (
          <Icon
            name="pencil"
            color="white"
            size={35}
            onPress={() => setConsult(!consult)}
          />
        ) : (
          <Icon
            name="people"
            color="white"
            size={35}
            onPress={() => setConsult(!consult)}
          />
        )}
      </View>

      <StatModal />
      {currentUser && currentUser.uid === currentUserId ? (
        <View style={{ alignItems: "center" }}>
          <Word word={currentWord} />
        </View>
      ) : (
        <View style={styles.solution}>
          <Solution word={currentWord} timer={timer as number} />
        </View>
      )}
      <View style={{ height: height * 0.5, paddingTop: 20 }}>
        {consult ? (
          <PlayersController />
        ) : (
          <CanvasController currentUserId={currentUserId} />
        )}
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0.03 * height,
          right: 0,
          left: 0,
        }}
      >
        {showStartButton ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {isAdmin ? (
              <Button title="Start"  variant="white" onPress={startGame} disable={!canStartGame} />
            ) : (
              <Text style={{ color: "white", fontSize: 20 }}>
                Waiting for the admin...
              </Text>
            )}
          </View>
        ) : (
          <ChatController
            currentUserId={currentUserId}
            players={players}
            currentWord={currentWord}
            timer={timer!}
            started={started}
          />
        )}
      </View>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  timer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  solution: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  revealedWord: {
    fontWeight: "bold",
  },
  points: {
    fontWeight: "700",
    color: "white",
    fontSize: 20,
  },
});
