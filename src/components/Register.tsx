import { FormEvent, useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../types/types";
import { TextField } from "@mui/material";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/register`;

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    const userDetails: User = {
      firstName: firstname,
      lastName: lastname,
      username: email,
      password: createPassword,
      role: "ADMIN",
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
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isPasswordValid: boolean = createPassword === confirmPassword;
    const isEmailValid = emailRegex.test(email);

    if (isEmailValid && isPasswordValid) {
      registerUser();
      setFirstname("");
      setLastname("");
      setCreatePassword("");
      setConfirmPassword("");
      setEmail("");
    }
  };

  return (
    <div className="register-main-container">
      <img
        src="https://res.cloudinary.com/diuvnny8c/image/upload/v1723736298/12217759_4934425.jpg"
        className="register-img"
        alt="register-logo"
      />
      <form onSubmit={handleRegisterSubmit} className="register-form-container">
        <h1 className="register-head">Register</h1>
        <TextField
          label="firstname"
          variant="outlined"
          type="text"
          value={firstname}
          required
          onChange={(e) => setFirstname(e.target.value)}
        />
        <TextField
          label="lastname"
          variant="outlined"
          type="text"
          value={lastname}
          required
          onChange={(e) => setLastname(e.target.value)}
        />
        <TextField
          label="username(email)"
          variant="outlined"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="create password"
          variant="outlined"
          type="password"
          value={createPassword}
          required
          onChange={(e) => setCreatePassword(e.target.value)}
        />

        <TextField
          label="confirm password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {createPassword !== confirmPassword && (
          <p className="password-match-msg">password not matching...</p>
        )}
        <button type="submit" className="register-btn">
          submit
        </button>
        {errorMessage && <p className="register-error-msg">{errorMessage}</p>}
        <p className="signin-text">
          Already an admin?{" "}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
