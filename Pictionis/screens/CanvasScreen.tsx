import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import Button from "../components/Button";
import Icon from "react-native-vector-icons/AntDesign";
import ColorPicker, { Color, colorsMap } from "../components/ColorPicker";
import { TPath } from "../controllers/CanvasController";
interface Props {
  paths: TPath[];
  currentPath: TPath;
  onTouchMove: (e: GestureResponderEvent) => void;
  onTouchEnd: (e: GestureResponderEvent) => void;
  isCurrentPlayer: boolean;
  resetDrawing: () => void;
  selectedColor: Color;
  onSelectColor: (color: Color) => void;
}
const { height, width } = Dimensions.get("window");
const CanvasScreen = ({
  paths,
  currentPath,
  onTouchMove,
  onTouchEnd,
  isCurrentPlayer,
  resetDrawing,
  selectedColor,
  onSelectColor,
}: Props) => {
  return (
    <View style={styles.container}>
      {isCurrentPlayer && (
        <View style={styles.buttonContainer}>
          <Icon
            name="delete"
            color="#00cccc"
            size={30}
            onPress={(e) => resetDrawing()}
          />
          <ColorPicker selectedColor={selectedColor} onSelect={onSelectColor} />
        </View>
      )}
      <View
        style={styles.svgContainer}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Svg height={height} width={width}>
          <Path
            d={currentPath.path ? currentPath.path.join("") : ""}
            stroke={colorsMap[currentPath.color]}
            fill={"transparent"}
            strokeWidth={2}
            strokeLinejoin={"round"}
            strokeLinecap={"round"}
          />

          {!!paths &&
            paths.length > 0 &&
            paths.map((path, index) => (
              <Path
                key={`path-${index}`}
                d={path.path ? path.path.join("") : ""}
                stroke={colorsMap[path.color]}
                fill={"transparent"}
                strokeWidth={2}
                strokeLinejoin={"round"}
                strokeLinecap={"round"}
              />
            ))}
        </Svg>
      </View>
    </View>
  );
};

export default CanvasScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    position: "relative",
  },
  svgContainer: {
    height: height * 0.5,
    width,
    // borderColor: "red",
    backgroundColor: "white",
    // borderWidth: 1,
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 0,
    justifyContent: "space-between",
    width: "100%",
    zIndex: 4,
    backgroundColor: "white",
  },
});
