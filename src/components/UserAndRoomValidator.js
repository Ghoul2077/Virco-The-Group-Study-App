import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { firestore } from '../config/firebase';
import { useLogin } from '../context/LoginProvider';
import Room from '../pages/Room';

function UserAndRoomValidator({ open }) {
  const { user } = useLogin();
  const { room } = useParams();
  const navigate = useNavigate();
  const [isUserValidated, setIsUserValidated] = useState(false);

  useEffect(() => {
    (async function () {
        const communitiesRef = collection(firestore, "communities");
        const q = query(communitiesRef, where("community_name", "==", room));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length == 0) {
            toast.error("Room does not exist");
            navigate(`/`);
        } else {
            const data = querySnapshot.docs[0].data();
            if(data?.public) {
                setIsUserValidated(true);
            } else {
                const isMember = data?.members.some(member => member == user?.id);
                if(isMember) {
                    setIsUserValidated(true);                    
                } else {
                    toast.error("User not authorized to join the room");
                    navigate(`/`);
                }
            }
        }
    })()
  }, [user, room])

  if(!isUserValidated) {
      return <div>Connecting to the server...</div>
  }

  return (
    <Room open={open} />
  )
}

export default UserAndRoomValidator
