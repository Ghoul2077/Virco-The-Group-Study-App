import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import { startAuthLoading, stopAuthLoading } from "../reducers/auth";
import { auth, firestore } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

const api = (store) => (next) => async (action) => {
  switch (action.type) {
    case "user/login":
      store.dispatch(startAuthLoading());
      const { email = "", password = "", onFailure } = action.payload;
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch ({ message }) {
        if (onFailure) onFailure(message);
        store.dispatch(stopAuthLoading());
        toast.error(message);
      }
      break;
    case "user/logout":
      store.dispatch(startAuthLoading());
      try {
        setTimeout(() => auth.signOut(), 50);
      } catch ({ message }) {
        toast.error(message);
      }
      store.dispatch(stopAuthLoading());
      return next(action);
    case "user/createAccount":
      store.dispatch(startAuthLoading());
      try {
        const { email, password, name, username } = action.payload;
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await sendEmailVerification(user);
        const userDataDoc = doc(firestore, "users", user?.uid);
        await setDoc(userDataDoc, {
          displayName: name,
          username: username,
        });
      } catch ({ message }) {
        store.dispatch(stopAuthLoading());
        toast.error(message);
      }
      break;
    default:
      return next(action);
  }
};

export default api;
