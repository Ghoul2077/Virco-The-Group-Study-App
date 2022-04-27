import { Button, TextField } from "@mui/material";
import React, { Component, useState, useEffect } from "react";

const Login = (props) => {
  const [style, setStyle] = useState(props);

  return (
    <form style={style.formStyle}>
      <h1>LOGIN</h1>
      <TextField
        style={style.fieldStyle}
        value={style.fields.username}
        name="username"
        variant="standard"
        placeholder="Username"
        type="text"
        margin="normal"
        onChange={style.handleChange}
        error={!!style.errors.username}
        helperText={style.errors.username}
        required
      />
      <TextField
        style={style.fieldStyle}
        value={style.fields.password}
        name="password"
        variant="standard"
        placeholder="Password"
        type="password"
        margin="normal"
        onChange={style.handleChange}
        error={!!style.errors.password}
        helperText={style.errors.password}
        required
      />
      <a href="#!" style={{ marginBottom: "1rem" }}>
        Forgot Password
      </a>
      <div style={style.btnStyle}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={style.handleSubmit}
        >
          Log In
        </Button>
      </div>
    </form>
  );
};

export default Login;
