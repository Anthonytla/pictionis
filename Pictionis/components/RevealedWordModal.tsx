import { useAtomValue } from "jotai";
import { useState } from "react";
import { Modal, Text, StyleSheet, View, Dimensions } from "react-native";
import { revealedWordModalAtom } from "../stores/revealedWordModalAtom";

const { height, width } = Dimensions.get("screen");

const RevealedWordModal = () => {
  const { visibility, word } = useAtomValue(revealedWordModalAtom);
  if (!visibility) return null;
  return (
    <View style={styles.centeredView}>
      <Modal visible={visibility} transparent={true} animationType="fade">
        <View style={styles.innerCenteredView}>
          <View style={styles.modalView}>
            <Text>
              The word was <Text style={styles.revealedWord}>{word}</Text>
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height,
    width,
    backgroundColor: "black",
    opacity: 0.2,
    // left: 0,
    // top: 0,
    // right: 0,
    // bottom: 0,
    zIndex: 10,
  },
  innerCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    // height: 100,
    // width: 200,
    padding: 20,
    zIndex: 10,
  },
  revealedWord: {
    fontWeight: "bold",
  },
});

export default RevealedWordModal;
