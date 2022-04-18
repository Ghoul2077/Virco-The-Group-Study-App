import React, { useState } from "react";
import { useLogin } from "../context/LoginProvider";

const Login = () => {
  const { handleLoginWithEmail } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      style={{ display: "flex", flexDirection: "column", width: "300px" }}
      onSubmit={(event) => {
        handleLoginWithEmail({ email, password });
        event.preventDefault();
      }}
    >
      <label htmlFor="email">Email</label>
      <input
        onChange={(e) => setEmail(e.target.value)}
        id="email"
        name="email"
        type="email"
      />
      <label htmlFor="password">Password</label>
      <input
        onChange={(e) => setPassword(e.target.value)}
        id="password"
        name="password"
        type="password"
      />
      <button style={{ marginTop: "20px" }} type="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
