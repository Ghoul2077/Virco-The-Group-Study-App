import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/reducers/auth";

const Dashboard = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col min-h-screen min-w-full">
      <button
        className="self-center justify-self-center"
        onClick={() => dispatch(logout())}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
