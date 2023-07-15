import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  View,
  Text,
} from "react-native";
import React, { Dispatch } from "react";
import Button from "../components/Button";
import RoomFormModel, { RoomForm } from "../models/room-form.model";
import { RoomFormAction } from "../controllers/RoomFormController";
import MyInput from "../components/MyInput";

interface Props {
  model: RoomForm;
  onFieldChange: Dispatch<RoomFormAction>;
  onCreate: () => Promise<void>;
  roomName: string;
}

const RoomScreen = ({ model, onFieldChange, onCreate, roomName }: Props) => {
  const { playerNumber, countDown, maxRound } = model;

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View>
        <Text style={styles.header}>{roomName}</Text>

        <MyInput
          placeholder="Number of players"
          value={!playerNumber ? "" : playerNumber.toString()}
          onChangeText={(playerNumber) =>
            onFieldChange({
              type: "UPDATE_PLAYER_NUMBER",
              payload: parseInt(playerNumber),
            })
          }
        />
        <MyInput
          placeholder="Number of rounds"
          value={!maxRound ? "" : maxRound.toString()}
          onChangeText={(maxRound) =>
            onFieldChange({ type: "UPDATE_ROUND", payload: parseInt(maxRound) })
          }
        />
        <MyInput
          placeholder="Timeout"
          value={!countDown ? "" : countDown.toString()}
          onChangeText={(countDown) =>
            onFieldChange({
              type: "UPDATE_COUNTDOWN",
              payload: parseInt(countDown),
            })
          }
        />
      </View>
      <View>
        <Button title="Créer" onPress={onCreate} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00cccc",
  },
  header: {
    fontWeight: "800",
    fontSize: 30,
    textAlign: "center",
    color: "white",
    marginBottom: 30,
  },
});
