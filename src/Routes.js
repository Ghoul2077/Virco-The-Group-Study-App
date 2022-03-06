import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import animationData from "./assets/lottie/loader.json";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "./config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { logout, setUser, stopAuthLoading } from "./store/reducers/auth";
import toast from "react-hot-toast";

const Router = () => {
  const { data: userData, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanup = onAuthStateChanged(auth, async (user) => {
      console.log("Called");
      if (user != null && !user.emailVerified) {
        toast.success(
          user.email + " please check your inbox for verification mail"
        );
        dispatch(logout());
      } else if (user != null && user.emailVerified) {
        let userData = Object.assign({}, user.providerData[0]);

        const firestoreData = await getDoc(doc(firestore, "users", user.uid));
        if (firestoreData.exists()) {
          userData = { ...userData, ...firestoreData?.data() };
        }
        userData.uid = user.uid;
        dispatch(setUser({ userData }));
      } else {
        dispatch(stopAuthLoading());
      }
    });

    return () => cleanup();
  }, [dispatch]);

  const animationOption = {
    loop: true,
    autoplay: true,
    src: animationData,
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex flex-col space-y-2 items-center justify-center">
        <div className="pointer-events-none mb-5">
          <Player
            style={{ height: "300px", width: "300px" }}
            {...animationOption}
          />
        </div>
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  } else if (userData) {
    return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    );
  }

  return <Login />;
};

export default Router;
