import { FormEvent, useEffect, useState } from "react";
import "../styles/AddCustomer.css";
import { City, State } from "country-state-city";
import { Customer, TransformedState } from "../types/types";
import Cookies from "js-cookie";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SnackbarContent,
  TextField,
} from "@mui/material";

import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import "react-phone-input-2/lib/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";

const addCustomerUrl = `${import.meta.env.VITE_API_BASE_URL}/customers/create`;
const addLeadsUrl = `${import.meta.env.VITE_API_BASE_URL}/leads/create`;
const updateLeadUrl = `${import.meta.env.VITE_API_BASE_URL}/leads/update`;

const updateCustomerUrl = `${
  import.meta.env.VITE_API_BASE_URL
}/customers/update`;

const getLeadUrl = `${import.meta.env.VITE_API_BASE_URL}/leads`;

const getCustomerUrl = `${import.meta.env.VITE_API_BASE_URL}/customers`;

const states = State.getStatesOfCountry("IN").map((state) => ({
  value: state.name,
  stateCode: state.isoCode,
}));

const regionList = [
  { value: "EAST", displayValue: "EAST" },
  { value: "WEST", displayValue: "WEST" },
  { value: "NORTH", displayValue: "NORTH" },
  { value: "SOUTH", displayValue: "SOUTH" },
];

const ModifyCustomer = () => {
  const [stateId, setStateId] = useState(states[0].value);
  const [cities, setCities] = useState<TransformedState[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerDoorNo, setCustomerDoorNo] = useState<number>(0);
  const [customerStreetName, setCustomerStreetName] = useState<string>("");
  const [customerStateName, setCustomerStateName] = useState<string>("");
  const [customerDistrictName, setCustomerDistrictName] = useState<string>("");
  const [customerCityName, setCustomerCityName] = useState<string>("");
  const [customerPincode, setCustomerPincode] = useState<string>("");
  const [regionName, setRegionName] = useState<string>("");
  const [pathName, setPathName] = useState<string>("");
  const [parentPath, setParentPath] = useState<string>("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const jwtToken = Cookies.get("jwtToken");
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const desiredPart = pathParts[2];
    const parentPart = pathParts[1];
    setPathName(desiredPart);
    setParentPath(parentPart);
    if (desiredPart === "update") {
      getUser(parentPart);
    }
  }, []);

  useEffect(() => {
    const cityData = City.getCitiesOfState("IN", stateId).map((city) => ({
      value: city.name,
      displayValue: city.name,
    }));
    setCities(cityData);
  }, [stateId]);

  const addNewUser = async () => {
    setIsLoading(true);
    const customerData: Customer = {
      name: customerName,
      email: customerEmail,
      phone: parseInt(customerPhone),
      address: {
        doorNo: customerDoorNo || 0,
        streetName: customerStreetName,
        city: customerCityName,
        district: customerDistrictName,
        state: customerStateName,
        region: regionName,
        pincode: parseInt(customerPincode),
      },
    };
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(customerData),
    };
    try {
      const finalUrl =
        parentPath === "customers" ? addCustomerUrl : addLeadsUrl;
      const response = await fetch(finalUrl, config);
      if (response.ok) {
        // const data = await response.text();
        setIsLoading(false);
        navigate(`/${parentPath}`, { replace: true });
      } else {
        const errorMessage = await response.text();
        setApiErrorMsg(errorMessage);
        setSnackOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const updateUser = async () => {
    setIsLoading(true);
    const customerData: Customer = {
      name: customerName,
      email: customerEmail,
      phone: parseInt(customerPhone),
      address: {
        doorNo: customerDoorNo || 0,
        streetName: customerStreetName,
        city: customerCityName,
        district: customerDistrictName,
        state: customerStateName,
        region: regionName,
        pincode: parseInt(customerPincode),
      },
    };
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(customerData),
    };
    try {
      const finalUrl =
        parentPath === "leads" ? updateLeadUrl : updateCustomerUrl;
      const response = await fetch(`${finalUrl}/${id}`, config);
      if (response.ok) {
        setIsLoading(false);
        navigate(`/${parentPath}`, { replace: true });
        // const data = await response.text();
        // console.log(data);
      } else {
        const errorMessage = await response.text();
        setApiErrorMsg(errorMessage);
        setSnackOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getUser = async (path: string) => {
    setIsLoading(true);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const finalUrl = path === "customers" ? getCustomerUrl : getLeadUrl;
      const response = await fetch(`${finalUrl}/${id}`, config);
      if (response.ok) {
        setIsLoading(false);
        const data = await response.json();
        setCustomerName(data.name);
        setCustomerEmail(data.email);
        setCustomerPhone(data.phone + "");
        setCustomerDoorNo(data.address.doorNo);
        setCustomerStreetName(data.address.streetName);
        // setCustomerStateName(data.address.stateName);
        // setCustomerDistrictName(data.address.districtName);
        // setCustomerCityName(data.address.city);
        setCustomerPincode(data.address.pincode + "");
        setRegionName(data.address.region);
        // console.log(data);
      } else {
        const msg = await response.text();
        setIsLoading(false);
        setSnackOpen(true);
        setApiErrorMsg(msg);
        navigate(`/${parentPath}`, { replace: true });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    pathName === "update" ? updateUser() : addNewUser();
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerDoorNo(0);
    setCustomerStreetName("");
    setCustomerStateName("");
    setCustomerDistrictName("");
    setCustomerCityName("");
    setCustomerPincode("");
  };

  const handleCustomerPhone = (phone: string) => {
    if (/^[6-9]\d{0,9}$/.test(phone)) {
      setCustomerPhone(phone);
    } else {
      setCustomerPhone("");
    }
  };

  const handleStateId = (stateName: string) => {
    states.forEach(
      (each) => each.value === stateName && setStateId(each.stateCode)
    );
    setCustomerStateName(stateName);
  };

  const handleCityName = (city: string) => {
    setCustomerCityName(city);
  };

  const handleDistrictName = (district: string) => {
    setCustomerDistrictName(district);
  };

  const handleRegionName = (region: string) => {
    setRegionName(region);
  };

  const handlePincode = (pincode: string) => {
    if (/^\d{0,6}$/.test(pincode)) {
      setCustomerPincode(pincode);
    }
  };

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      console.log(event);
      return;
    }

    setSnackOpen(false);
  };

  return (
    <div className="add-customer-main-container">
      <Snackbar
        open={snackOpen}
        autoHideDuration={10000}
        onClose={handleSnackClose}
        message={apiErrorMsg}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <SnackbarContent
          style={{ backgroundColor: "red" }}
          message={apiErrorMsg}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackClose}
            >
              <NotificationsActiveIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
      <img
        src="https://res.cloudinary.com/diuvnny8c/image/upload/v1723780632/79310663_9846829.jpg"
        alt="add-customer-logo"
        className="add-customer-img"
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <form onSubmit={handleSubmit} className="add-new-customer-form">
          <TextField
            label="Name"
            variant="outlined"
            type="text"
            value={customerName}
            required
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={customerEmail}
            required
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <TextField
            label="Phone Number"
            variant="outlined"
            type="text"
            value={customerPhone}
            required
            onChange={(e) => handleCustomerPhone(e.target.value as string)}
            inputProps={{ maxLength: 10, inputMode: "numeric" }}
          />

          <TextField
            label="Door No"
            variant="outlined"
            type="number"
            value={customerDoorNo}
            required
            onChange={(e) => setCustomerDoorNo(parseInt(e.target.value))}
          />
          <TextField
            label="Street Name"
            variant="outlined"
            type="text"
            value={customerStreetName}
            required
            onChange={(e) => setCustomerStreetName(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              // id="demo-simple-select"
              value={customerStateName}
              label="Age"
              onChange={(e) => handleStateId(e.target.value as string)}
            >
              {states.map((eachState) => (
                <MenuItem value={eachState.value} key={eachState.stateCode}>
                  {eachState.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="city-label">District</InputLabel>
            <Select
              labelId="city-label"
              // id="demo-simple-select"
              value={customerDistrictName}
              label="Age"
              onChange={(e) => handleDistrictName(e.target.value as string)}
            >
              {cities.map((eachCity) => (
                <MenuItem value={eachCity.value} key={eachCity.value}>
                  {eachCity.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              labelId="city-label"
              // id="demo-simple-select"
              value={customerCityName}
              label="Age"
              onChange={(e) => handleCityName(e.target.value as string)}
            >
              {cities.map((eachCity) => (
                <MenuItem value={eachCity.value} key={eachCity.value}>
                  {eachCity.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="pincode"
            variant="outlined"
            type="text"
            value={customerPincode}
            required
            onChange={(e) => handlePincode(e.target.value as string)}
            inputProps={{ maxLength: 6, inputMode: "numeric" }}
          />

          <FormControl fullWidth>
            <InputLabel id="city-label">Region</InputLabel>
            <Select
              labelId="city-label"
              // id="demo-simple-select"
              value={regionName}
              label="Age"
              onChange={(e) => handleRegionName(e.target.value as string)}
            >
              {regionList.map((eachRegion) => (
                <MenuItem value={eachRegion.value} key={eachRegion.value}>
                  {eachRegion.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button className="add-customer-submit-btn">submit</button>
        </form>
      )}
    </div>
  );
};

export default ModifyCustomer;
