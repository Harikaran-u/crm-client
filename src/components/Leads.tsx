import { useEffect, useState } from "react";
import "../styles/Leads.css";
import Cookies from "js-cookie";
import TableGenerator from "./TableGenerator";
import { Lead, LeadSummary, UserSummary } from "../types/types";
import { Link } from "react-router-dom";
import ServerError from "./ServerError";
import Loader from "./Loader";
import NoData from "./NoData";

const leadsUrl = `${import.meta.env.VITE_API_BASE_URL}/leads/all`;

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
    header: "Qualified",
    accessorKey: "qualified",
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

const Leads = () => {
  const [leadsData, setLeadsData] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerError, setServerError] = useState(false);
  const [isNoData, setIsNoData] = useState(false);

  const token = Cookies.get("jwtToken");

  const getAllLeads = async () => {
    setIsLoading(true);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(leadsUrl, config);
      if (response.ok) {
        const data = await response.json();
        if (data.length != 0) {
          const userData: LeadSummary[] = data.map((eachData: Lead) => {
            return {
              id: eachData.id,
              name: eachData.name,
              email: eachData.email,
              phone: eachData.phone,
              qualified: eachData.qualified,
              city: eachData.address.city,
              district: eachData.address.district,
              state: eachData.address.state,
              pincode: eachData.address.pincode,
            };
          });
          setLeadsData(userData);
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
    getAllLeads();
  }, []);

  return (
    <>
      {isServerError && <ServerError />}
      {isNoData && <NoData />}
      {!isServerError && (
        <div className="customer-main-container">
          <Link to="/leads/add" className="add-customer-link">
            <button className="add-new-customer-btn">Add Leads</button>
          </Link>
          {isLoading && <Loader />}
          {!isLoading && !isNoData && (
            <TableGenerator
              data={leadsData}
              columns={tableContent}
              dataCallback={getAllLeads}
              target="leads"
            />
          )}
        </div>
      )}
    </>
  );
};

export default Leads;
