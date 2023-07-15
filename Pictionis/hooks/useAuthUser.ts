import { useEffect, useState } from "react";
import { onValue, ref, getDatabase, set, Unsubscribe } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useAtom, useAtomValue } from "jotai";
import { authUserAtom } from "../stores/authUserAtom";
import { roomIdAtom } from "../stores/roomAtom";

const useAuthUser = () => {
  const db = getDatabase();
  const roomId = useAtomValue(roomIdAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribe = onValue(ref(db, `users/${user.uid}`), (snapshot) => {
          const data = snapshot.val();

          setAuthUser({ ...data, uid: user.uid });
        });
      } else {
        setAuthUser(null);
        const playerRef = ref(db, `players/${roomId}/${authUser?.uid}`);
        set(playerRef, null);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [authUser?.uid, roomId]);

  // useEffect(() => {
  //   if (!user) return;
  //   console.log("hiiiii");
  //   const unsubscribe = onValue(ref(db, `users/${user.uid}`), (snapshot) => {
  //     const data = snapshot.val();
  //     console.log("authUser : ", data);
  //     setAuthUser({ ...data, uid: user.uid });
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [user, roomId]);
};

export default useAuthUser;
