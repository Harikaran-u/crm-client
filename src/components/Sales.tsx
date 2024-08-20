import { useEffect, useState } from "react";
import "../styles/Sales.css";
import {
  MonthlySalesList,
  QuarterlySalesRecord,
  RegionalRecord,
  YearlySalesRecord,
} from "../types/types";

import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

import Cookies from "js-cookie";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Loader from "./Loader";
import ServerError from "./ServerError";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

const yearlySalesApi = `${baseUrl}/sales_reports/yearly`;

const monthlySalesApi = `${baseUrl}/sales_reports/monthly`;

const regionalSalesApi = `${baseUrl}/sales_reports/regional`;

const quarterSalesApi = `${baseUrl}/sales_reports/quarterly`;

const colors = ["#AD49E1", "#FF8A8A", "#FF4E88", "#36BA98"];

const availableYears = [2021, 2022, 2023, 2024];

const Sales = () => {
  const [yearlySalesData, setYearlySalesData] = useState<YearlySalesRecord>();
  const [monthlySalesList, setMonthlySalesList] = useState<MonthlySalesList>(
    []
  );

  const [regionalData, setRegionalData] = useState<RegionalRecord>();

  const [quarterSalesList, setQuarterSalesList] = useState<
    QuarterlySalesRecord[]
  >([]);

  const [selectedYear, setSelectedYear] = useState(2024);

  const [isLoading, setIsLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const [dataErrorMsg, setDataErrorMsg] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  const token = Cookies.get("jwtToken");

  const config = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getYearlyTarget = async () => {
    setIsLoading(true);
    try {
      const yearlyUrl = `${yearlySalesApi}/${selectedYear}`;
      const yearlyResponse = await fetch(yearlyUrl, config);
      if (yearlyResponse.ok) {
        const data = await yearlyResponse.json();
        setYearlySalesData(data);
      } else {
        const errorMsg = await yearlyResponse.text();
        setDataErrorMsg(errorMsg);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const getMonthlyTarget = async () => {
    setIsLoading(true);
    try {
      const monthlyUrl = `${monthlySalesApi}/${selectedYear}`;
      const response = await fetch(monthlyUrl, config);
      if (response.ok) {
        const data = await response.json();
        setMonthlySalesList(data);
      } else {
        const errorMsg = await response.text();
        setDataErrorMsg(errorMsg);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const getRegionalData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(regionalSalesApi, config);
      if (response.ok) {
        const data = await response.json();
        setRegionalData(data);
      } else {
        const errorMsg = await response.text();
        setDataErrorMsg(errorMsg);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const getQuarterSales = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(quarterSalesApi, config);
      if (response.ok) {
        const data = await response.json();
        setQuarterSalesList(data);
      } else {
        const errorMsg = await response.text();
        setDataErrorMsg(errorMsg);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const getAllStats = async () => {
    getYearlyTarget();
    getMonthlyTarget();
    getRegionalData();
    getQuarterSales();
  };

  useEffect(() => {
    getAllStats();
  }, []);

  useEffect(() => {
    getYearlyTarget();
    getMonthlyTarget();
  }, [selectedYear]);

  const getQuarterDataModified = () => {
    return quarterSalesList?.map((each) => ({
      name: each.quarter,
      value: parseInt(each.saleValue),
    }));
  };

  const getModifiedRegionalData = () => {
    const dataList = [
      { name: "East", value: regionalData?.["east"] },
      { name: "West", value: regionalData?.["west"] },
      { name: "North", value: regionalData?.["north"] },
      { name: "South", value: regionalData?.["south"] },
    ];
    return dataList;
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
    <div className="sales-main-container">
      <Snackbar
        open={snackOpen}
        autoHideDuration={10000}
        onClose={handleSnackClose}
        message={dataErrorMsg}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <SnackbarContent
          style={{ backgroundColor: "red" }}
          message={dataErrorMsg}
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
      {isServerError && <ServerError />}

      {isLoading && !isServerError && <Loader />}

      {!isLoading && !isServerError && (
        <div className="monthly-sales-container">
          <div className="yearly-data-input-container">
            <div className="target-box">
              <p className="target-label">
                Target-{" "}
                <span className="target-value">
                  {yearlySalesData?.targetAmount}
                </span>
              </p>
              <p className="target-label">
                Achieved-{" "}
                <span className="target-value-achived">
                  {yearlySalesData?.achievedAmount}
                </span>
              </p>
            </div>
            <FormControl className="year-input">
              <InputLabel id="state-label">Year</InputLabel>
              <Select
                labelId="state-label"
                value={selectedYear}
                label="Age"
                onChange={(e) => setSelectedYear(e.target.value as number)}
              >
                {availableYears.map((eachYear) => (
                  <MenuItem value={eachYear} key={eachYear}>
                    {eachYear}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <h2 className="customer-chart-head">
            Monthly Sales - {selectedYear}
          </h2>
          <BarChart
            className="bar-chart-md"
            width={730}
            height={250}
            data={monthlySalesList}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="targetAmount" fill="#874CCC" />
            <Bar dataKey="achievedAmount" fill="#36BA98" />
          </BarChart>
          <BarChart
            className="bar-chart-sm"
            width={280}
            height={180}
            data={monthlySalesList}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="targetAmount" fill="#874CCC" />
            <Bar dataKey="achievedAmount" fill="#36BA98" />
          </BarChart>
        </div>
      )}

      {isLoading && !isServerError && <Loader />}

      {!isLoading && !isServerError && (
        <div className="regional-quarter-sales-container">
          <div className="custom-charts-container">
            <h2 className="customer-chart-head">Regional Sales</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={getModifiedRegionalData()}
                dataKey={"value"}
                nameKey={"name"}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {getModifiedRegionalData().map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
          {quarterSalesList.length > 0 && (
            <div className="custom-charts-container">
              <h2 className="customer-chart-head">Quarter Sales</h2>
              <PieChart width={300} height={300}>
                <Pie
                  data={getQuarterDataModified()}
                  dataKey={"value"}
                  nameKey={"name"}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {getQuarterDataModified().map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;
