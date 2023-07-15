import { StackParamList } from "../types";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getDatabase, ref, child, get } from "firebase/database";
import RoomItem from "../components/RoomItem";
import Button from "../components/Button";

type GameScreenNavigationProp = NativeStackNavigationProp<
  StackParamList,
  "Game"
>;

interface Props {
  rooms: any;
  navigation: GameScreenNavigationProp;
}

const DashboardScreen = ({ rooms, navigation }: Props) => {
  const renderItem = (item) => {
    return (
      <View>
        <RoomItem item={item} navigation={navigation} />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/logo.png")}
        resizeMode="cover"
        style={styles.image}
      ></ImageBackground>
      {/* <FlatList
        data={rooms}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
      /> */}
      <Button
        title="Create a room"
        onPress={() => navigation.navigate("RoomForm")}
      />
      <Button
        title="Join a room"
        onPress={() => navigation.navigate("RoomsList")}
      />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00cccc",
    // flexWrap: 'wrap',
  },
  image: {
    margin: 50,
    width: 220,
    height: 50,
  },
});
