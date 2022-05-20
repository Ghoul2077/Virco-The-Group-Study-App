import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
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
      querySnapshot = onSnapshot(communitiesRef, (querySnapshot) => {
        if (!querySnapshot.exists()) {
          toast.error("Room does not exist");
          navigate(`/`);
        } else {
          const data = querySnapshot.data();
          setServerInfo(data);
          if (data?.public) {
            setIsUserValidated(true);
          } else {
            const isMember = data?.members.some(
              (member) => member === user?.uid
            );

            if (isMember) {
              setIsUserValidated(true);
            } else {
              toast.error("User not authorized to join the room");
              // navigate(`/`);
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
    return <Loader loaderText="Connecting to the server" />
  }

  return <Room open={open} serverInfo={serverInfo} />;
}

export default UserAndRoomValidator;
