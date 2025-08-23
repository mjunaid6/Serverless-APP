import React, { useState, useMemo } from "react";
import {
  Checkbox,
  IconButton,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

// Sample rows
function createData(id, name, calories, fat, carbs, protein) {
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Cheesecake", 400, 20.0, 55, 6.5),
  createData(7, "Brownie", 320, 18.0, 40, 5.1),
  createData(8, "Apple Pie", 300, 12.0, 42, 2.8),
  createData(9, "Ice Cream", 275, 14.0, 30, 3.6),
  createData(10, "Pudding", 250, 10.0, 28, 3.2),
  createData(11, "Muffin", 380, 15.0, 48, 4.7),
  createData(12, "Tart", 290, 13.0, 36, 3.4),
  createData(13, "Macaron", 220, 9.0, 25, 2.0),
  createData(14, "Croissant", 450, 21.0, 50, 5.0),
  createData(15, "Strudel", 330, 17.0, 44, 4.1),
];

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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
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
            <IconButton>
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
                indeterminate={
                  selected.length > 0 && selected.length < rows.length
                }
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
