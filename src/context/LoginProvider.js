import toast from "react-hot-toast";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "@firebase/auth";
import { doc, onSnapshot, setDoc } from "@firebase/firestore";
import { auth, firestore } from "../config/firebase";

export const LoginContext = createContext(null);
export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChanging, setAuthChanging] = useState(true);

  async function handleLoginWithEmail({ email, password }) {
    setAuthChanging(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch ({ message }) {
      console.log(message);
      setAuthChanging(false);
    }
  }

  async function handleLogout() {
    setTimeout(() => auth.signOut(), 50);
  }

  async function handleSignupWithEmailAndPassword({ email, password, name, username }) {
    setAuthChanging(true);
    
    try {
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
    } catch({ message }) {
      toast.error(message);
    }

    setAuthChanging(false);
  }

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, async (user) => {
      if (user != null && !user.emailVerified) {
        toast.success(
          user.email + " please check your inbox for verification mail"
        );
        auth.signOut();
      } else if (user != null && user.emailVerified) {
        let userData = Object.assign({}, user.providerData[0]);

        onSnapshot(doc(firestore, "users", user.uid), (firestoreData) => {
          if (firestoreData.exists()) {
            userData = { ...userData, ...firestoreData?.data() };
          }
          userData.uid = user.uid;
          setUser(userData);
          setAuthChanging(false);
        });
      } else {
        setUser(null);
        setAuthChanging(false);
      }
    });

    return () => cleanup();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        handleLogout,
        handleLoginWithEmail,
        handleSignupWithEmailAndPassword,
        isLoading: authChanging,
        user,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
