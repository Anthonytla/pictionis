import { getDatabase, onValue, set, ref, get } from "firebase/database";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { roomAtom, roomIdAtom } from "../stores/roomAtom";
import { useCallback, useEffect, useState } from "react";
import GameScreen from "../screens/GameScreen";
import { Player } from "../types";
import { authUserAtom } from "../stores/authUserAtom";
import { foundWordAtom } from "../stores/gameAtom";
import { revealedWordModalAtom } from "../stores/revealedWordModalAtom";
import { statModalAtom } from "../stores/statModalAtom";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const GameController = () => {
  const db = getDatabase();
  const roomId = useAtomValue(roomIdAtom);
  const [room, setRoom] = useAtom(roomAtom);
  const [users, setUsers] = useState<Player[]>([]);
  const currentUser = useAtomValue(authUserAtom);
  const [timer, setTimer] = useState(0);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState("");

  const [roundNb, setRoundNb] = useState(room?.maxRound);
  const setFoundWord = useSetAtom(foundWordAtom);
  const setRevealedWordModal = useSetAtom(revealedWordModalAtom);
  const revealedWordModal = useAtomValue(revealedWordModalAtom).visibility;
  const setStatModal = useSetAtom(statModalAtom);
  const [step, setStep] = useState("initTimer");
  const [words, setWords] = useState<string[]>([]);
  const canStartGame = users.length === room?.playerNumber && words.length > 0;
  const adminUser = users.find((user) => user.isAdmin);
  const isAdmin = currentUser?.uid === adminUser?.uid;
  const connectedPlayers = users.filter((player) => player.connected);
  const isCurrentPlayer =
    connectedPlayers.length &&
    currentUser?.uid == users[currentIndex % users.length].uid;

  const getCurrentUser = () => {
    onValue(
      ref(db, `/rooms/${roomId}/currentIndex`),
      (res) => {
        setCurrentIndex(res.val());
      },
      { onlyOnce: true }
    );
  };

  useEffect(() => {
    setFoundWord(false);

    onValue(
      ref(db, "/rooms/" + roomId),
      (snapshot) => {
        const data = snapshot.val();
        setRoom(data);
        if (!data.started) {
          set(ref(db, "/rooms/" + roomId + "/timer"), data.countDown);
          set(ref(db, "/rooms/" + roomId + "/round"), data.maxRound);
          set(ref(db, "/rooms/" + roomId + "/currentIndex"), currentIndex);
        }
      },
      { onlyOnce: true }
    );
    onValue(ref(db, "/players/" + roomId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        setUsers(
          Object.entries(data).map(([uid, payload]) => ({
            ...payload,
            uid,
          })) as Player[]
        );
      }
    });
    onValue(ref(db, "/rooms/" + roomId + "/currentWord"), (snapshot) => {
      if (snapshot.exists()) {
        setCurrentWord(snapshot.val());
      }
    });
    onValue(ref(db, "/rooms/" + roomId + "/timer"), (snapshot) => {
      if (snapshot.exists()) {
        setTimer(snapshot.val());
      }
    });
    onValue(ref(db, "/rooms/" + roomId + "/words"), (snapshot) => {
      if (snapshot.exists()) {
        setWords(snapshot.val());
      }
    });
    onValue(ref(db, "/rooms/" + roomId + "/started"), (snapshot) => {
      if (snapshot.exists()) {
        setStarted(snapshot.val());
      }
    });
    getStep();
    getRound();
  }, []);

  const getRound = () => {
    onValue(ref(db, "/rooms/" + roomId + "/round"), (snapshot) => {
      if (snapshot.exists()) {
        setRoundNb(snapshot.val());
      }
    });
  };

  const initCurrentWord = async () => {
    const randomIdx = Math.floor(Math.random() * words.length);
    // setWords((prev) => prev.filter((word) => word !== prev[randomIdx]));
    if (isCurrentPlayer) {
      set(
        ref(db, "/rooms/" + roomId + "/currentWord"),
        words[randomIdx].trim().toLowerCase()
      );
      set(
        ref(db, "/rooms/" + roomId + "/words"),
        words.filter((word) => word !== words[randomIdx])
      );
    }
  };

  const initTimer = () => {
    onValue(
      ref(db, "/rooms/" + roomId),
      (snapshot) => {
        const data = snapshot.val();

        if (isCurrentPlayer) {
          set(ref(db, "/rooms/" + roomId + "/timer"), data.countDown);
          setTimer(data.countDown);
        }
      },
      { onlyOnce: true }
    );
  };
  const decreasingTimer = () => {
    if (isCurrentPlayer && timer > 0) {
      setTimeout(() => {
        set(ref(db, "/rooms/" + roomId + "/timer"), timer - 1);
      }, 1000);
    } else if (timer == 0) {
      setRevealedWordModal({ visibility: true, word: currentWord });
      if (revealedWordModal) {
        saveStep("initTimer");
        updateCurrentUser();
        nextRound();
        setTimeout(() => {
          setRevealedWordModal({ visibility: false, word: "" });
        }, 2000);
      }
    }
  };

  const resetPlayer = () => {
    set(
      ref(db, "/players/" + roomId + "/" + currentUser?.uid + "/foundWord"),
      null
    );
  };
  const checkWinner = () => {
    let timeout;

    onValue(
      ref(db, "/players/" + roomId),
      (snapshot) => {
        const winners = (
          Object.entries(snapshot.val()).map(([uid, payload]) => ({
            ...payload,
            uid,
          })) as Player[]
        ).filter((p) => p.foundWord == true);

        if (winners.length && winners.length == connectedPlayers.length - 1) {
          setRevealedWordModal({ visibility: true, word: currentWord });

          saveStep("initTimer");
          updateCurrentUser();
          nextRound();

          timeout = setTimeout(() => {
            setRevealedWordModal({ visibility: false, word: "" });
            resetPlayer();
            initTimer();
          }, 2000);
          return;
        }
      },
      { onlyOnce: true }
    );
  };

  const initUser = () => {
    setCurrentUserId(users[currentIndex % users.length]?.uid as string);
  };

  const updateCurrentUser = async () => {
    if (isCurrentPlayer || !users[currentIndex % users.length].connected) {
      set(ref(db, "/rooms/" + roomId + "/currentIndex"), currentIndex + 1);
    }
  };

  const saveStep = (step: string) => {
    if (users.length && isCurrentPlayer) {
      set(ref(db, "/rooms/" + roomId + "/step"), step);
    }
  };
  const getStep = () => {
    onValue(ref(db, "/rooms/" + roomId + "/step"), (snapshot) => {
      if (snapshot.exists()) {
        setStep(snapshot.val());
      }
    });
  };

  const nextRound = () => {
    if (
      currentIndex % connectedPlayers.length === connectedPlayers.length - 1 &&
      isCurrentPlayer &&
      roundNb! > 0
    ) {
      set(ref(db, "/rooms/" + roomId + "/round"), roundNb! - 1);
    }
  };

  useEffect(() => {
    if (!started) {
      return;
    }
    if (!users[currentIndex % users.length].connected) {
      updateCurrentUser();
    }
    if (roundNb === 0) {
      setStatModal(true);
      return;
    }
    getCurrentUser();
    initUser();

    if (step == "initTimer") {
      initTimer();
      saveStep("initWord");
    } else if (step == "initWord") {
      initCurrentWord();
      saveStep("afterInit");
    } else if (step === "afterInit") {
      setTimeout(() => {
        saveStep("gameStart");
      }, 5000);
    } else if (step == "gameStart") {
      checkWinner();
      decreasingTimer();
    }
  }, [
    step,
    currentIndex,
    currentUserId,
    started,
    timer,
    revealedWordModal,
    roundNb,
  ]);

  useFocusEffect(
    useCallback(() => {
      set(
        ref(db, "/players/" + roomId + "/" + currentUser?.uid + "/connected"),
        true
      );

      return () => {
        set(
          ref(db, "/players/" + roomId + "/" + currentUser?.uid + "/connected"),
          false
        );
      };
    }, [])
  );
  return (
    <View>
      <GameScreen
        currentWord={currentWord}
        timer={timer}
        currentUserId={currentUserId}
        players={connectedPlayers}
        started={step == "gameStart"}
        isAdmin={isAdmin}
        showStartButton={!started}
        canStartGame={canStartGame}
      />
    </View>
  );
};

export default GameController;
