import React, { useState, useMemo, useEffect } from "react";
import { Checkbox, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { API_URL } from "../assets/URLs";
import axios from "axios";

// Comparator functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const UserTable = () => {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch API data
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(API_URL);
        const body = JSON.parse(res.data.body);

        const formatted = body.map((item) => ({
          id: Number(item.id.N),
          name: item.name.S,
          calories: Number(item.calories.N),
          fat: Number(item.fat.N),
          carbs: Number(item.carbs.N),
          protein: Number(item.protein.N),
        }));

        setRows(formatted);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    getData();
  }, []);

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, order, orderBy, page, rowsPerPage]
  );

  const handleSelectAllClick = (e) => {
    if (e.target.checked) {
      setSelected(rows.map((n) => n.id));
    } else {
      setSelected([]);
    }
  };

  const handleClick = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // ✅ Delete selected rows
  const handleDelete = async () => {
    try {
      await Promise.all(
        selected.map((id) =>
          axios.delete(API_URL, {
            headers: { "Content-Type": "application/json" },
            data: { id }, // DELETE body
          })
        )
      );

      // Remove deleted items from UI
      setRows((prev) => prev.filter((row) => !selected.includes(row.id)));
      setSelected([]);
    } catch (err) {
      console.error("Error deleting items:", err);
    }
  };


  return (
    <div className="w-4/5 mx-auto mt-15">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-t-lg">
        {selected.length > 0 ? (
          <span className="text-blue-600 font-medium">{selected.length} selected</span>
        ) : (
          <span className="font-semibold">Nutrition</span>
        )}
        <div>
          {selected.length > 0 ? (
            <IconButton onClick={handleDelete}>
              <DeleteIcon className="text-red-600" />
            </IconButton>
          ) : (
            <IconButton>
              <FilterListIcon className="text-gray-600" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-semibold text-gray-700">
            <th className="p-3">
              <Checkbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < rows.length}
                checked={rows.length > 0 && selected.length === rows.length}
                onChange={handleSelectAllClick}
              />
            </th>
            {["Dessert", "Calories", "Fat", "Carbs", "Protein"].map((head, i) => (
              <th
                key={i}
                className="p-3 cursor-pointer hover:text-blue-600"
                onClick={() =>
                  handleRequestSort(
                    ["name", "calories", "fat", "carbs", "protein"][i]
                  )
                }
              >
                {head}{" "}
                {orderBy === ["name", "calories", "fat", "carbs", "protein"][i] &&
                  (order === "asc" ? "▲" : "▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const isSelected = selected.includes(row.id);
            return (
              <tr
                key={row.id}
                onClick={() => handleClick(row.id)}
                className={`border-b hover:bg-gray-100 ${
                  isSelected ? "bg-blue-50" : ""
                }`}
              >
                <td className="p-3">
                  <Checkbox color="primary" checked={isSelected} />
                </td>
                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.calories}</td>
                <td className="p-3">{row.fat}</td>
                <td className="p-3">{row.carbs}</td>
                <td className="p-3">{row.protein}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-b-lg text-sm">
        <div>
          Rows per page:{" "}
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            className="ml-2 border rounded px-2 py-1"
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="ml-3 px-2 py-1 border rounded hover:bg-gray-200"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setPage((p) => Math.min(Math.ceil(rows.length / rowsPerPage) - 1, p + 1))
            }
            className="ml-2 px-2 py-1 border rounded hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
