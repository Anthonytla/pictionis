import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import LoginFormController from "./controllers/LoginFormController";
import CanvasController from "./controllers/CanvasController";
import { StackParamList, User } from "./types";
import RegisterFormController from "./controllers/RegisterFormController";
import RoomFormController from "./controllers/RoomFormController";
import DashboardController from "./controllers/DashboardController";
import GameController from "./controllers/GameController";
import useAuthUser from "./hooks/useAuthUser";
import { useEffect, useState } from "react";
import { atom } from "jotai/index";
import "react-native-url-polyfill/auto";
import RoomsListController from "./controllers/RoomsListController";
// import { LogBox } from "react-native";
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createNativeStackNavigator<StackParamList>();
const authUserAtom = atom<User | null>(null);
export default function App() {
  useAuthUser();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoomForm" component={RoomFormController} />
        <Stack.Screen name="Game" component={GameController} />
        <Stack.Screen name="Dashboard" component={DashboardController} />
        <Stack.Screen name="Login" component={LoginFormController} />
        <Stack.Screen name="Register" component={RegisterFormController} />
        <Stack.Screen name="RoomsList" component={RoomsListController} />
        {/* <Stack.Screen name="Canvas" component={CanvasController} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
