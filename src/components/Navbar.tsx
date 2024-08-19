import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import Logout from "./Logout";

const Navbar = () => {
  return (
    <nav className="main-nav">
      <Link to="/">
        <img
          src="https://res.cloudinary.com/diuvnny8c/image/upload/v1723791747/CRM_SYSTEM_logo.png"
          alt="company-logo"
          className="app-logo"
        />
      </Link>

      <Logout />
    </nav>
  );
};

export default Navbar;
