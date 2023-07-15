import {useAtom} from "jotai/react/useAtom";
import {roomAtom} from "../stores/roomAtom";

const useRoomAtom = () => useAtom(roomAtom);