import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import PDF from "../components/PDF";
import { useLogin } from "../context/LoginProvider";

const socket = socketIOClient(`http://localhost:4000`);

const Room = () => {
  const { user } = useLogin();
  const { room } = useParams();

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState("");

  function handleSend(event) {
    socket.emit(
      "sendMessage",
      {
        message: msg,
      },
      () => setMsg("")
    );
    event.preventDefault();
  }

  useEffect(() => {
    socket.emit("joinRoom", { roomId: room, username: user.displayName });

    socket.on("newJoinee", (username) =>
      toast.success(`${username} just joined the room`)
    );

    socket.on("roomData", (users) => {
      setUsers(users);
    });

    socket.on("newHost", (newHostUsername) => {
      console.log("Called");
      setHost(newHostUsername);
    });

    socket.on("messagesBroadcast", (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.emit("leaveRoom", socket.removeAllListeners);
    };
  }, [room, user.displayName]);

  useEffect(() => {
    if (host) {
      toast.success(`${host} is the host`);
    }
  }, [host]);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ marginRight: "30px" }}>
        <p style={{ fontWeight: "bold" }}>Room : {room}</p>
        <p>Current host : {host}</p>
        <div>Connected Users : </div>
        {users.map((username, index) => (
          <p key={index}>{username}</p>
        ))}
      </div>
      <PDF socket={socket} />
      <div>
        <p>Chat</p>
        <div
          style={{
            height: "300px",
            width: "300px",
            border: "1px solid black",
            marginBottom: "5px",
            borderRadius: "3px",
          }}
        >
          {messages.map(({ sender, message }, index) => (
            <div key={index}>
              {sender} : {message}
            </div>
          ))}
        </div>
        <form>
          <input
            style={{ width: "250px", marginRight: "5px" }}
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
            type="string"
          />
          <button onClick={handleSend} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Room;
