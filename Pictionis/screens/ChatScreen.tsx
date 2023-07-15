import { useRef } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import MessageItem from "../components/MessageItem";
import { Message, Player } from "../types";
import { getMillisecondsDiff } from "../utils/dates";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/Ionicons";

interface Props {
  messages: Record<string, Message>;
  messageInput: string;
  setMessageInput: (val: string) => void;
  handleSendMessage: (val: string) => void;
  players: Player[];
}

const ChatScreen = ({
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage,
  players,
}: Props) => {
  const { height, width } = Dimensions.get("window");
  const listRef = useRef<FlatList>(null);
  return (
    <View
      style={{
        height: 0.25 * height,
        paddingHorizontal: 10,
        // backgroundColor: "red",
      }}
    >
      <FlatList
        style={{
          width: "100%",
          backgroundColor: "#008080",
          borderRadius: 20,
          // opacity: 0.8,
          // padding: 20,
          paddingHorizontal: 20,
          marginBottom: 15,
        }}
        ref={listRef}
        data={Object.values(messages).sort((m1, m2) =>
          getMillisecondsDiff(m1.timestamp, m2.timestamp)
        )}
        renderItem={({ item }) => {
          const player = players.find((player) => player.uid === item.author);
          if (!player?.connected) {return null;}
          return <MessageItem message={item} player={player} />;
        }}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: true })
        }
      />
      <View
        style={{
          flexDirection: "row",
          // width: width * 0.9,
          justifyContent: "center",
        }}
      >
        <TextInput
          style={styles.input}
          value={messageInput}
          onChangeText={setMessageInput}
          placeholder="Entrez un message..."
        />
        <TouchableOpacity
          onPress={() => handleSendMessage(messageInput)}
          style={styles.button}
        >
          <Icon name="send" color="#00cccc" size={35} />
          {/* <Text style={styles.text}>Send</Text> */}
        </TouchableOpacity>
        {/* <Button title="Send" onPress={() => handleSendMessage(messageInput)} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#00b3b3",
    borderRadius: 75,
    padding: 8,
    marginBottom: 8,
    // width: 300,
    textAlign: "center",
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    flex: 3,
    opacity: 0.7,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 75,
    padding: 15,
    marginBottom: 8,
    marginLeft: 10,
    // width: 300,
    // borderColor: "blue",
    // borderWidth: 2,
  },
  text: {
    fontWeight: "500",
    color: "#00cccc",
    textAlign: "center",
    fontSize: 20,
  },
});

export default ChatScreen;
