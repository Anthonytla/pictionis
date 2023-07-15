import { View, Text, StyleSheet } from "react-native";
import { Player } from "../types";
import Icon from "react-native-vector-icons/FontAwesome";

interface Props {
  players: Player[];
}

const PlayersScreen = ({ players }: Props) => {
  return (
    <View style={styles.playersContainer}>
      {players.map((player) => (
        <View style={styles.playerItem}>
          <View style={styles.playerItem}>
            <Text> {player.username} </Text>
            <Text>({player.points} pts)</Text>
          </View>

          {player.connected ? (
            <Icon name="circle" color="green" size={15}></Icon>
          ) : (
            <Icon name="circle" color="red" size={15}></Icon>
          )}
        </View>
      ))}
    </View>
  );
};

export default PlayersScreen;

const styles = StyleSheet.create({
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  playersContainer: {
    padding: 15,
    backgroundColor: "white",
    height: "100%",
  },
  points: {
    fontWeight: "700",
    color: "white",
    fontSize: 20,
  },
});
