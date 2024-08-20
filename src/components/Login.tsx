import { FormEvent, useEffect, useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginCredentials } from "../types/types";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ServerError from "./ServerError";
import Loader from "./Loader";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/login`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get("jwtToken");
    if (authToken !== undefined) {
      navigate("/", { replace: true });
    }
  });

  const loginUser = async () => {
    setIsLoading(true);
    const userDetails: LoginCredentials = {
      username: username,
      password: password,
    };

    const configData = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(baseUrl, configData);
      const data = await response.json();
      if (data.access_token == null) {
        setErrorMessage(data.message);
      } else if (data.access_token != null) {
        Cookies.set("jwtToken", data.access_token, { expires: 7 });
        navigate("/", { replace: true });
        setIsLoading(false);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValidEmail = emailRegex.test(username);
    if (isValidEmail) {
      loginUser();
      setUsername("");
      setPassword("");
    }
  };

  return (
    <div className="login-main-container">
      {isServerError && <ServerError />}
      {isLoading && !isServerError && <Loader />}
      {!isServerError && !isLoading && (
        <form className="login-form-container" onSubmit={handleFormSubmit}>
          <h1 className="login-head">Admin</h1>
          <TextField
            id="outlined-basic"
            label="username"
            variant="outlined"
            type="email"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
          />
          <FormControl className="login-input" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <button type="submit" className="login-btn">
            Login
          </button>
          {errorMessage && <p className="login-error-msg">{errorMessage}</p>}
          <p className="signup-text">
            Not a user?{" "}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
