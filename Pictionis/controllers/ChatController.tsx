import { getDatabase, onValue, ref, set } from "firebase/database";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { roomIdAtom } from "../stores/roomAtom";
import uuid from "react-native-uuid";
import { authUserAtom } from "../stores/authUserAtom";
import ChatScreen from "../screens/ChatScreen";
import { Player, User } from "../types";
import { foundWordAtom } from "../stores/gameAtom";

interface Props {
  players: Player[];
  currentWord: string;
  timer: number;
  started: boolean;
  currentUserId: string;
}

const ChatController = ({
  players,
  currentWord,
  timer,
  started,
  currentUserId,
}: Props) => {
  const roomId = useAtomValue(roomIdAtom);
  const [messages, setMessages] = useState({});
  const currentUser = useAtomValue(authUserAtom);
  const db = getDatabase();
  const [messageInput, setMessageInput] = useState("");
  const [foundWord, setFoundWord] = useAtom(foundWordAtom);
  const currentPlayer = players.find(
    (player) => player.uid === currentUser?.uid
  );

  const calculatePoints = () => {
    const pointsGained = 100 * timer;
    set(
      ref(db, `/players/${roomId}/${currentUser?.uid}/points`),
      (currentPlayer?.points ?? 0) + pointsGained
    );
  };

  const sendMessage = (messageContent: string) => {

    if (
      currentWord &&
      messageContent.toLocaleLowerCase() === currentWord &&
      !foundWord &&
      started
    ) {
      set(ref(db, `/players/${roomId}/${currentUser?.uid}/foundWord`), true);
      calculatePoints();
    }
    onValue(
      ref(db, `/players/${roomId}/${currentUser?.uid}/foundWord`),
       (snapshot) => {
        if (messageContent === "" || currentUserId === currentUser?.uid) {
          console.log('IN');
          
          return;
        }
        if (snapshot.val()) {
            set(ref(db, "/messages/" + roomId + "/" + uuid.v4()), {
            content: currentUser?.username + " has found the word",
            author: currentUser?.uid,
            timestamp: new Date().toISOString(),

          }); return;
        }
        else{
          set(ref(db, "/messages/" + roomId + "/" + uuid.v4()), {
          content: messageContent,
          author: currentUser?.uid,
          timestamp: new Date().toISOString(),
        });
      }
    }
    );


    
    
    setMessageInput("");
    messageContent="";
  };

  useEffect(() => {
    onValue(ref(db, "/messages/" + roomId), (snapshot) => {
      if (snapshot.exists()) setMessages(snapshot.val() ?? {});
    });
  }, []);

  return (
    <ChatScreen
      messages={messages}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      handleSendMessage={sendMessage}
      players={players}
    />
  );
};

export default ChatController;
