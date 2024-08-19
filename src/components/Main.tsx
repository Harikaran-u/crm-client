import { Outlet } from "react-router-dom";
import "../styles/Main.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Main = () => {
  return (
    <div className="main-page-main-container">
      <Navbar />
      <div className="main-details-container">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
