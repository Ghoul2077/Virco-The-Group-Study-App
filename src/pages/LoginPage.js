import React, { useState } from "react";
import { useLogin } from "../context/LoginProvider";
import { Button, Stack, TextField, Typography } from "@mui/material";

const LoginPage = () => {
  const { handleLoginWithEmail, handleSignupWithEmailAndPassword } = useLogin();
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUp, setSignUp] = useState(false);

  return (
    <div>
      <img
        src="/images/Artboard.png"
        alt="background"
        style={{
          position: "fixed",
          top: "0",
          bottom: "0",
          left: "0",
          // height: "100%",
          width: "100%",
          zIndex: "-1",
          // maxHeight: "250px",
          objectFit: "cover",
          transition: "left 0.3s",
        }}
      />
      <Stack textAlign="center" paddingTop={"10vh"} paddingLeft={"53vw"}>
        {!signUp && (
          <Typography variant="h3" color="#34BED4">
            Welcome Back!
          </Typography>
        )}
        {signUp ? (
          <Typography variant="h3" color={"white"} fontWeight="300">
            Create an account!
          </Typography>
        ) : (
          <Typography variant="h4" color={"white"} fontWeight="300">
            We are excited to see you again!
          </Typography>
        )}
      </Stack>
      {signUp ? (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            marginLeft: "60vw",
            marginTop: "5vh",
          }}
          onSubmit={(event) => {
            handleSignupWithEmailAndPassword({ email: signupEmail, password: signupPassword, name: signupName, username: signupUsername });
            event.preventDefault();
          }}
        >
          <Typography
            color={"white"}
            variant="h4"
            fontWeight={"600"}
            paddingBottom="30px"
          >
            SIGN UP
          </Typography>

          <Typography color={"white"} variant="h6" paddingBottom={"10px"}>
            Email
          </Typography>

          <TextField
            onChange={(e) => setSignupEmail(e.target.value)}
            placeholder="Email"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            size="small"
            id="email"
            name="email"
            type="email"
          />

          <Typography color={"white"} variant="h6" paddingBottom={"10px"}>
            Name
          </Typography>

          <TextField
            onChange={(e) => setSignupName(e.target.value)}
            placeholder="Name"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            size="small"
            id="name"
            name="name"
            type="name"
          />
          <Typography
            color={"white"}
            variant="h6"
            paddingBottom={"10px"}
            paddingTop={"10px"}
          >
            Username
          </Typography>

          <TextField
            onChange={(e) => setSignupUsername(e.target.value)}
            placeholder="Username"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            size="small"
            id="username"
            name="username"
          />
          <Typography
            color={"white"}
            variant="h6"
            paddingBottom={"10px"}
            paddingTop="15px"
          >
            Password
          </Typography>
          <TextField
            onChange={(e) => setSignupPassword(e.target.value)}
            placeholder="Password"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            id="password"
            name="password"
            type="password"
            size="small"
          />
          <Button
            variant="contained"
            sx={{ marginTop: "20px", bgcolor: "#34BED4" }}
            type="submit"
          >
            SIGN UP
          </Button>
          <Stack
            display={"flex"}
            direction={"row"}
            paddingTop="10px"
            alignItems={"center"}
          >
            <Button
              variant="text"
              sx={{
                padding: "0px",
                marginBottom: "7px",
                marginLeft: "5px",
                color: "white",
              }}
              onClick={() => setSignUp(false)}
            >
              Already have an account?
            </Button>
          </Stack>
        </form>
      ) : (
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            width: "500px",
            marginLeft: "60vw",
            marginTop: "5vh",
          }}
          onSubmit={(event) => {
            handleLoginWithEmail({ email, password });
            event.preventDefault();
          }}
        >
          <Typography
            color={"white"}
            variant="h2"
            fontWeight={"600"}
            paddingBottom="30px"
          >
            LOGIN
          </Typography>

          <Typography color={"white"} variant="h6" paddingBottom={"10px"}>
            Email
          </Typography>

          <TextField
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            size="small"
            id="email"
            name="email"
            type="email"
          />
          <Typography
            color={"white"}
            variant="h6"
            paddingBottom={"10px"}
            paddingTop="15px"
          >
            Password
          </Typography>
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            InputProps={{
              sx: { color: "black" },
            }}
            sx={{ bgcolor: "white", borderRadius: "5px" }}
            id="password"
            name="password"
            type="password"
            size="small"
          />
          <Button
            variant="contained"
            sx={{ marginTop: "20px", bgcolor: "#34BED4" }}
            type="submit"
          >
            Login
          </Button>
          <Stack
            display={"flex"}
            direction={"row"}
            paddingTop="10px"
            alignItems={"center"}
          >
            <Typography color={"white"} variant="h6" paddingBottom={"10px"}>
              Don't have an account?
            </Typography>
            <Button
              variant="text"
              sx={{
                padding: "0px",
                marginBottom: "7px",
                marginLeft: "5px",
                color: "#FF006C",
              }}
              onClick={() => setSignUp(true)}
            >
              SIGN UP
            </Button>
          </Stack>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
