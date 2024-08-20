import Login from "./components/Login";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Main from "./components/Main";
import Home from "./components/Home";
import Customers from "./components/Customers";
import Leads from "./components/Leads";
import Sales from "./components/Sales";
import Feedbacks from "./components/Feedbacks";
import ModifyCustomer from "./components/ModifyCustomer";
import ProtectedRoute from "./components/ProtectedRoute";
import Notfound from "./components/Notfound";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/" element={<Main />}>
              <Route path="/home" element={<Home />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/add" element={<ModifyCustomer />} />
              <Route
                path="/customers/update/:id"
                element={<ModifyCustomer />}
              />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/add" element={<ModifyCustomer />} />
              <Route path="/leads/update/:id" element={<ModifyCustomer />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/feedbacks" element={<Feedbacks />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="not-found" element={<Notfound />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
