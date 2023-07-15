import { getDatabase, onValue, ref } from "firebase/database"
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react"
import { roomIdAtom } from "../stores/roomAtom";
import { Player } from "../types";
import PlayersScreen from "../screens/PlayersScreen";

const PlayersController = () => {

    const roomId = useAtomValue(roomIdAtom);
    const db = getDatabase();
    const [users, setUsers] = useState<Player[]>([]);

    useEffect(() => {
        onValue(ref(db, "/players/" + roomId), (snapshot) => {
            if (!snapshot.exists()) { return; }
            const data = snapshot.val();
            setUsers(
                Object.entries(data).map(([uid, payload]) => ({
                    ...payload,
                    uid,
                })) as Player[]
            );
        })
    }, [])

    return <PlayersScreen players={users} />
}

export default PlayersController;