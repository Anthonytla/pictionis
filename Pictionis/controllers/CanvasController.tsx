import { useEffect, useRef, useState } from "react";
import { StyleSheet, Dimensions, GestureResponderEvent } from "react-native";
import CanvasScreen from "../screens/CanvasScreen";
import { auth } from "../firebase";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useAtomValue } from "jotai";
import { roomIdAtom } from "../stores/roomAtom";
import { Color } from "../components/ColorPicker";

export interface TPath {
  path: string[];
  color: Color;
}

const { height, width } = Dimensions.get("window");
interface Props {
  currentUserId: string;
}
const CanvasController = ({ currentUserId }: Props) => {
  const db = getDatabase();
  const roomId = useAtomValue(roomIdAtom);
  const [paths, setPaths] = useState<TPath[]>([]);
  const user = auth.currentUser;
  const [selectedColor, setSelectedColor] = useState<Color>("black");
  const [currentPath, setCurrentPath] = useState<TPath>({
    path: [],
    color: selectedColor,
  });

  const isCurrentPlayer = user?.uid === currentUserId;
  const onTouchMove = (event: GestureResponderEvent) => {
    if (user?.uid != currentUserId) return;
    const newPath = currentPath.path ? [...currentPath.path] : [];

    //get current user touches position
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;

    // create new point
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(
      0
    )},${locationY.toFixed(0)} `;

    // add the point to older points
    newPath.push(newPoint);
    const newCurrentPath = { path: newPath, color: selectedColor };
    setCurrentPath(newCurrentPath);
    set(ref(db, `/drawings/${roomId}/currentPath`), newCurrentPath);
  };

  const onTouchEnd = (e: GestureResponderEvent) => {
    const currentPaths = [...paths];
    // const newPath = {...currentPath};
    //push new path with old path and clean current path state
    currentPaths.push(currentPath);
    setPaths(currentPaths);
    setCurrentPath({ path: [], color: selectedColor });
    set(ref(db, `/drawings/${roomId}/currentPath`), []);
    set(ref(db, `/drawings/${roomId}/paths`), currentPaths);
  };

  const resetDrawing = () => {
    setPaths([]);
    setCurrentPath({ path: [], color: selectedColor });
    set(ref(db, `/drawings/${roomId}/currentPath`), {
      path: [],
      color: selectedColor,
    });
    set(ref(db, `/drawings/${roomId}/paths`), []);
  };

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, `/drawings/${roomId}/currentPath`),
      (snapshot) => {
        //if (user?.uid === currentUserId) return;
        setCurrentPath(snapshot.val() ?? { path: [], color: selectedColor });
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, user, currentUserId, selectedColor]);

  useEffect(() => {
    const unsubscribe = onValue(
      ref(db, `/drawings/${roomId}/paths`),
      (snapshot) => {
        
       // if (user?.uid === currentUserId) return;
        setPaths(snapshot.val() ?? []);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, user, currentUserId]);

  const [prevCurrentUserId, setPrevCurrentUserId] = useState(currentUserId);

  const justMounted = useRef(true);
  useEffect(() => {
    if (justMounted.current){
      justMounted.current = false;
      return;
    }
    set(ref(db, `/drawings/${roomId}/currentPath`), {
      path: [],
      color: selectedColor,
    });
    console.log("IN", currentUserId);
    
    set(ref(db, `/drawings/${roomId}/paths`), []);
  }, [currentUserId, roomId]);

  // if (prevCurrentUserId !== currentUserId) {
  //   setPaths([]);
  //   setCurrentPath({ path: [], color: selectedColor });
  //   setPrevCurrentUserId(currentUserId);
  // }

  return (
    <CanvasScreen
      paths={paths}
      currentPath={currentPath}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchMove}
      isCurrentPlayer={isCurrentPlayer}
      resetDrawing={resetDrawing}
      selectedColor={selectedColor}
      onSelectColor={setSelectedColor}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    height: height * 0.7,
    width,
    borderColor: "black",
    backgroundColor: "white",
    borderWidth: 1,
  },
});

export default CanvasController;
