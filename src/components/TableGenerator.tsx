import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { BasicTableProps } from "../types/types";
import Cookies from "js-cookie";
import "../styles/TableGenerator.css";
import { Link } from "react-router-dom";
import { IconButton, SnackbarContent, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ServerError from "./ServerError";

const deleteBaseUrl = `${import.meta.env.VITE_API_BASE_URL}`;

const TableGenerator = ({
  data,
  columns,
  dataCallback,
  target,
}: BasicTableProps) => {
  const [filtering, setFiltering] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState<string>("");
  const [isServerError, setIsServerError] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },

    onGlobalFilterChange: setFiltering,
  });

  const handleCustomerDelete = async (targetId: number) => {
    const deleteApi = `${deleteBaseUrl}/${target}/${targetId}`;
    const jwtToken = Cookies.get("jwtToken");

    const config = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      setIsServerError(false);
      const response = await fetch(deleteApi, config);
      const msg = await response.text();
      setSnackOpen(true);
      setApiErrorMsg(msg);
      dataCallback();
    } catch (error) {
      setIsServerError(true);
    }
  };

  const handleSnackClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  return (
    <>
      {isServerError && <ServerError />}
      {!isServerError && (
        <div className="w3-container customer-table">
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
          <TextField
            label="Search data"
            type="search"
            variant="outlined"
            className="data-search-input"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />

          <table className="w3-table-all">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </>
                      )}
                    </th>
                  ))}
                  <th>{}</th>
                  <th>{}</th>
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                  <td
                    className="customer-action-btn"
                    onClick={() => handleCustomerDelete(row.original.id)}
                  >
                    <MdDelete />
                  </td>
                  <td>
                    <Link
                      to={`/${target}/update/${row.original.id}`}
                      className="customer-action-btn"
                    >
                      <FaUserEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="page-btn-container">
            <button onClick={() => table.setPageIndex(0)} className="page-btn">
              <FirstPageIcon />
            </button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="page-btn"
            >
              <ArrowBackIosIcon />
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="page-btn"
            >
              <ArrowForwardIosIcon />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              className="page-btn"
            >
              <LastPageIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TableGenerator;
