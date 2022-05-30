import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";
import Room from "../pages/Room";

function UserAndRoomValidator({ open }) {
  const { user } = useLogin();
  const { room, roomId } = useParams();
  const navigate = useNavigate();
  const [serverInfo, setServerInfo] = useState();
  const [isUserValidated, setIsUserValidated] = useState(false);
  // console.log(roomId);

  useEffect(() => {
    let querySnapshot;
    (async function () {
      const communitiesRef = doc(firestore, "communities", roomId);
      // const q = query(communitiesRef, doc(roomId));
      querySnapshot = onSnapshot(communitiesRef, async (querySnapshot) => {
        if (!querySnapshot.exists() || querySnapshot.data().community_name !== room) {
          const userDoc = doc(firestore, "users", user.uid);
          const privateColl = collection(userDoc, "private_server");
          const publicColl = collection(userDoc, "public_server");
          const publicDocRef = doc(publicColl, roomId);
          const privateDocRef = doc(privateColl, roomId);

          if (publicDocRef.length !== 0) {
            await deleteDoc(publicDocRef);
          }
          if (privateDocRef.length !== 0) {
            await deleteDoc(privateDocRef);
          }
          toast.error("Room does not exist");
          navigate(`/`);
        } else {
            const data = querySnapshot.data();
            setServerInfo(data);
            if (data?.public) {
              setIsUserValidated(true);
              const docRef = doc(firestore, "users", user.uid);
              const collRef = collection(docRef, "public_server");
              const serverDoc = doc(collRef, querySnapshot.id);
              const serverExists = await getDoc(serverDoc);
              if (!serverExists.exists()) {
                await setDoc(doc(collRef, querySnapshot.id), {
                  community_name: data.community_name,
                  createdAt: data.createdAt,
                  public: data.public,
                  tags: data.tags,
                  createdBy: data.createdBy,
                  host: data.host,
                  joinedOn: serverTimestamp(),
                });
              }
            } else {
              const isMember = data?.members.some(
                (member) => member === user?.uid
              );

              if (isMember) {
                setIsUserValidated(true);
              } else {
                toast.error("User not authorized to join the room");
                navigate(`/`);
              }
            }
        }
      });
    })();
    return () => {
      if (querySnapshot) {
        querySnapshot();
      }
    };
  }, [user, roomId]);

  if (!isUserValidated) {
    return <Loader loaderText="Connecting to the server" />;
  }

  return <Room open={open} serverInfo={serverInfo} />;
}

export default UserAndRoomValidator;
