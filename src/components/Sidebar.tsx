import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { SiGoogleadsense } from "react-icons/si";
import { SlGraph } from "react-icons/sl";
import { MdFeedback } from "react-icons/md";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import "../styles/Sidebar.css";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("home");
  const location = useLocation();
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const desiredPart = pathParts[1];
    setSelectedTab(desiredPart);
  }, []);

  const handleToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleTab = (value: string) => {
    setSelectedTab(value);
  };

  return (
    <div
      className={`side-bar-main-container ${!isMenuOpen && "side-bar-closed "}`}
    >
      <button type="button" className="menu-bar-btn" onClick={handleToggle}>
        {isMenuOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
      </button>

      <Link
        to="/home"
        className={`page-link ${selectedTab === "home" && "selected-tab"}`}
        onClick={() => handleTab("home")}
      >
        <FaHome className="nav-icon" />
        {isMenuOpen && <span className="page-nav-text">Home</span>}
      </Link>
      <Link
        to="/customers"
        className={`page-link ${selectedTab === "customers" && "selected-tab"}`}
        onClick={() => handleTab("customers")}
      >
        <IoIosPeople className="nav-icon" />
        {isMenuOpen && <span className="page-nav-text">Customers</span>}
      </Link>
      <Link
        to="/leads"
        className={`page-link ${selectedTab === "leads" && "selected-tab"}`}
        onClick={() => handleTab("leads")}
      >
        <SiGoogleadsense className="nav-icon" />
        {isMenuOpen && <span className="page-nav-text">Leads</span>}
      </Link>
      <Link
        to="/sales"
        className={`page-link ${selectedTab === "sales" && "selected-tab"}`}
        onClick={() => handleTab("sales")}
      >
        <SlGraph className="nav-icon" />
        {isMenuOpen && <span className="page-nav-text">Sales</span>}
      </Link>
      <Link
        to="/feedbacks"
        className={`page-link ${selectedTab === "feedbacks" && "selected-tab"}`}
        onClick={() => handleTab("feedbacks")}
      >
        <MdFeedback className="nav-icon" />
        {isMenuOpen && <span className="page-nav-text">Feedbacks</span>}
      </Link>
    </div>
  );
};

export default Sidebar;
