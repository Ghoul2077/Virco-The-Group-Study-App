import React, { Component , useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const SignUp = props => {
   
    const [style,setStyle] = useState(props);
    const history = useHistory()

    useEffect(()=>{
        setStyle(props);
    },[props])

    return (
      <form style={style.formStyle}>
        <h1>SIGN UP</h1>
        <TextField
          style={style.fieldStyle}
          value={style.fields.email}
          name="email"
          variant="standard"
          placeholder="Email"
          type="text"
          margin="normal"
          onChange={style.handleChange}
          error={!!style.errors.email}
          helperText={style.errors.email}
          required
        />
        <TextField
          style={style.fieldStyle}
          value={style.fields.username}
          name="username"
          variant="standard"
          placeholder="username"
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
        <div style={style.btnStyle}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={style.handleSubmit}
          >
            Continue
          </Button>
        </div>
      <a href="#!" style={{marginBottom: "1rem"}} onClick ={()=>history.push('/')}>Already have an account?</a>
      </form>
    );
}

export default SignUp;
