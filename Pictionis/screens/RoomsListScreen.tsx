import { StackParamList } from "../types";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RoomItem from "../components/RoomItem";

type GameScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "RoomsList"
>;

interface Props {
  rooms: any;
  navigation: GameScreenNavigationProp;
}

const RoomsListScreen = ({ rooms, navigation }: Props) => {
  const renderItem = (item: any) => {
    return (
      <View>
        <RoomItem item={item} navigation={navigation} />
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          {rooms.length === 0 ? (
            <Text style={styles.noRoomText}>No rooms yet !</Text>
          ) : (
            <FlatList
              data={rooms}
              renderItem={renderItem}
              // contentContainerStyle={styles.container}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default RoomsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00cccc",
    // flexWrap: 'wrap',
    height: "100%",
    paddingTop: 20,
  },
  image: {
    margin: 50,
    width: 220,
    height: 50,
  },
  headerContainer: {
    height: 100,
  },
  header: {
    fontSize: 40,
    height: 100,
    fontWeight: "600",
    color: "red",
  },
  noRoomText: {
    fontWeight: "700",
    color: "white",
    fontSize: 35,
  },
});
