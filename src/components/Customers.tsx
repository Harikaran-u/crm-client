import { useEffect, useState } from "react";
import "../styles/Customers.css";
import Cookies from "js-cookie";
import TableGenerator from "./TableGenerator";
import { Customer, UserSummary } from "../types/types";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import ServerError from "./ServerError";
import NoData from "./NoData";

const customerUrl = `${import.meta.env.VITE_API_BASE_URL}/customers/all`;

const tableContent = [
  { header: "Id", accessorKey: "id" },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "City",
    accessorKey: "city",
  },
  {
    header: "District",
    accessorKey: "district",
  },
  {
    header: "State",
    accessorKey: "state",
  },
  {
    header: "Pincode",
    accessorKey: "pincode",
  },
];

const Customers = () => {
  const [customerData, setCustomerData] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerError, setServerError] = useState(false);
  const [isNoData, setIsNoData] = useState(false);

  const token = Cookies.get("jwtToken");
  // console.log(token);

  const getAllCustomers = async () => {
    setIsLoading(true);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(customerUrl, config);
      if (response.ok) {
        const data = await response.json();

        if (data.length != 0) {
          const userData: UserSummary[] = data.map((eachData: Customer) => {
            return {
              id: eachData.id,
              name: eachData.name,
              email: eachData.email,
              phone: eachData.phone,
              city: eachData.address.city,
              district: eachData.address.district,
              state: eachData.address.state,
              pincode: eachData.address.pincode,
            };
          });
          setCustomerData(userData);
          setIsLoading(false);
          setServerError(false);
        }
      } else {
        setIsLoading(false);
        setIsNoData(true);
      }
    } catch (error) {
      setIsLoading(false);
      setServerError(true);
    }
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  return (
    <>
      {isServerError && <ServerError />}
      {isNoData && <NoData />}
      {!isServerError && (
        <div className="customer-main-container">
          <Link to="/customers/add" className="add-customer-link">
            <button className="add-new-customer-btn">Add customer</button>
          </Link>
          {isLoading && <Loader />}
          {!isLoading && !isNoData && (
            <TableGenerator
              data={customerData}
              columns={tableContent}
              dataCallback={getAllCustomers}
              target="customers"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Customers;
