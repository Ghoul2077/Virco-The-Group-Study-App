import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "@firebase/auth";
import { doc, onSnapshot } from "@firebase/firestore";
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

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, async (user) => {
      if (user != null) {
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
        isLoading: authChanging,
        user,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
