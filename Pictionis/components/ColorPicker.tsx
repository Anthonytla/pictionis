import { useState } from "react";
import { View } from "react-native";
import ColorPickerButton from "./ColorPickerButton";

export type Color =
  | "red"
  | "black"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "brown";

export const colorsMap: Record<Color, string> = {
  black: "#000000",
  blue: "#0099ff",
  green: "#00cc00",
  red: "#ff0000",
  yellow: "#ffff00",
  orange: "#ff9900",
  brown: "#996633",
} as const;

interface Props {
  selectedColor: Color;
  onSelect: (color: Color) => void;
}

const ColorPicker = ({ selectedColor, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={{ backgroundColor: "red", position: "relative" }}>
      <View style={{ position: "absolute", top: 0, right: 20 }}>
        <ColorPickerButton
          color={selectedColor}
          onPress={() => setIsOpen(!isOpen)}
        />
        {isOpen &&
          Object.keys(colorsMap)
            .filter((color) => color !== selectedColor)
            .map((color) => (
              <ColorPickerButton
                key={color}
                color={color as Color}
                onPress={() => {
                  onSelect(color as Color);
                  setIsOpen(false);
                }}
              />
            ))}
      </View>
    </View>
  );
};

export default ColorPicker;
