import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Variant = "green" | "white";

const variantMap: Record<
  Variant,
  { buttonVariant: string; textVariant: string }
> = {
  green: { buttonVariant: "#00cccc", textVariant: "white" },
  white: { buttonVariant: "white", textVariant: "#00cccc" },
};

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, number> = {
  sm: 100,
  md: 200,
  lg: 300,
};

interface Props {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disable ?: boolean
}

const Button = ({ title, onPress, variant = "white", size = "lg", disable = false }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disable}
      style={{
        ...styles.button,
        opacity: disable ? 0.5 : 1,
        backgroundColor: variantMap[variant].buttonVariant,
        width: sizeMap[size],
      }}
    >
      <Text style={{ ...styles.text, color: variantMap[variant].textVariant }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    // backgroundColor: "white",
    borderRadius: 75,
    padding: 8,
    marginBottom: 8,
    // width: 300,
    // borderColor: "blue",
    // borderWidth: 2,
  },
  text: {
    fontWeight: "500",
    // color: "#00cccc",
    textAlign: "center",
    fontSize: 20,
  },
});
