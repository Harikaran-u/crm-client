import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {
  IconButton,
  Snackbar,
  SnackbarCloseReason,
  SnackbarContent,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import "../styles/Feedbacks.css";
import { useEffect, useState } from "react";
import { FeedbackRating, FeedbackStats } from "../types/types";
import Cookies from "js-cookie";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Loader from "./Loader";
import ServerError from "./ServerError";

const availableTrends = ["6-months", "1-year", "2-year", "3-year"];
const colors = ["#88D66C", "#FFDB00", "#EE4E4E"];

const feedbacksTrendsBaseUrl = `${
  import.meta.env.VITE_API_BASE_URL
}/feedback/get_trends`;

const feedbackStatsApiUrl = `${
  import.meta.env.VITE_API_BASE_URL
}/feedback/statistics`;

const Feedbacks = () => {
  const [selectedTrend, setSelectedTrend] = useState(availableTrends[0]);
  const [feedbackList, setFeedbackList] = useState<FeedbackRating[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>();
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

  const getFeedBackList = async () => {
    setIsLoading(true);
    try {
      const finalUrl = `${feedbacksTrendsBaseUrl}/${selectedTrend}`;
      const response = await fetch(finalUrl, config);
      if (response.ok) {
        const data = await response.json();
        setFeedbackList(data.reverse());
        setIsLoading(false);
      } else {
        setFeedbackList([]);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  const getFeedbackStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(feedbackStatsApiUrl, config);
      if (response.ok) {
        const data = await response.json();
        setFeedbackStats(data);
        setIsLoading(false);
      } else {
        const errMsg = await response.text();
        setDataErrorMsg(errMsg);
      }
    } catch (error) {
      setIsServerError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getFeedBackList();
  }, [selectedTrend]);

  useEffect(() => {
    getFeedbackStats();
  }, []);

  const getConvertedFeedbackStats = () => {
    const statsList = [
      { name: "Good", value: feedbackStats?.good },
      { name: "Average", value: feedbackStats?.average },
      { name: "Bad", value: feedbackStats?.bad },
    ];
    return statsList;
  };

  return (
    <div className="feedback-main-container">
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
      <FormControl className="trend-input">
        <InputLabel id="trend-label" className="trend-label">
          Trends
        </InputLabel>
        <Select
          labelId="trend-label"
          value={selectedTrend}
          label="Age"
          onChange={(e) => setSelectedTrend(e.target.value as string)}
        >
          {availableTrends.map((eachTrend) => (
            <MenuItem value={eachTrend} key={eachTrend}>
              {eachTrend}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="feedback-charts-container">
        <h2 className="feedback-head">Customer Avg Ratings</h2>
        {isLoading && !isServerError && <Loader />}
        {!isLoading && !isServerError && (
          <LineChart
            width={730}
            height={250}
            data={feedbackList}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timePeriod" />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="averageRating" stroke="#82ca9d" />
          </LineChart>
        )}
      </div>
      <div className="feedback-charts-container-sm">
        <h2 className="feedback-head">Customer Avg Ratings</h2>
        {isLoading && !isServerError && <Loader />}
        {!isLoading && !isServerError && (
          <LineChart
            width={530}
            height={250}
            data={feedbackList}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timePeriod" />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="averageRating" stroke="#82ca9d" />
          </LineChart>
        )}
      </div>
      <div className="feedback-charts-container">
        <h2 className="feedback-head">Customer Satisfaction</h2>
        {isLoading && !isServerError && <Loader />}
        {!isLoading && !isServerError && (
          <PieChart width={400} height={400}>
            <Pie
              data={getConvertedFeedbackStats()}
              dataKey={"value"}
              nameKey={"name"}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {getConvertedFeedbackStats().map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        )}
      </div>
      <div className="feedback-charts-container-sm">
        <h2 className="feedback-head">Customer Satisfaction</h2>
        {isLoading && !isServerError && <Loader />}
        {!isLoading && !isServerError && (
          <PieChart width={280} height={280}>
            <Pie
              data={getConvertedFeedbackStats()}
              dataKey={"value"}
              nameKey={"name"}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {getConvertedFeedbackStats().map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        )}
      </div>
    </div>
  );
};

export default Feedbacks;
