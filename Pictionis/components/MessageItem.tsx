import { Message, Player } from "../types";
import { Text, View } from "react-native";

interface Props {
  message: Message;
  player: Player | undefined;
}

const MessageItem = ({ message, player }: Props) => {
  // if (!player) return null;
  return (
    <View style={{ flex: 1, flexDirection: "row", marginVertical: 5 }}>
      <Text style={{ fontWeight: "800", color: "white" }}>
        {player?.username} a écrit :{" "}
      </Text>
      <Text style={{ color: "white" }}>{message.content}</Text>
    </View>
  );
};

export default MessageItem;
