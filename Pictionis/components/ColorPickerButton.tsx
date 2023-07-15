import { GestureResponderEvent, TouchableOpacity } from "react-native";
import { Color } from "./ColorPicker";

interface Props {
  color: Color;
  onPress: (event: GestureResponderEvent) => void;
}

const SIZE = 30;

const ColorPickerButton = ({ color, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: color,
        height: SIZE,
        width: SIZE,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "gray",
        marginBottom: 5,
      }}
      onPress={onPress}
    />
  );
};

export default ColorPickerButton;
