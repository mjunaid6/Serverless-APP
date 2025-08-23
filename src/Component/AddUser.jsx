import { useState } from "react";
import axios from "axios";
import { API_URL } from "../assets/URLs";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function AddUser() {
  const [open, setOpen] = useState(false);
  const [newRow, setNewRow] = useState({
    id: "",
    name: "",
    calories: "",
    fat: "",
    carbs: "",
    protein: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset all form fields
    setNewRow({
        id: "",
        name: "",
        calories: "",
        fat: "",
        carbs: "",
        protein: "",
    });
  };

  const saveRow = async (row) => {
    try {
      const res = await axios.put(API_URL, row);
      console.log("Saved:", res.data);
      alert("Item saved successfully!");
      handleClose(); // close after saving
    } catch (err) {
      console.error("Error saving row:", err);
      alert("Error saving row");
    }
  };

  return (
    <div className="w-full flex justify-around mt-10">
      {/* Button to open dialog */}
      <Button
        variant="contained"
        className="!bg-cyan-700 !hover:bg-cyan-800 text-white"
        onClick={handleOpen}
      >
        Add / Update Item
      </Button>

      {/* Modal/Dialog */}
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
            rounded : '2xl',
        }}
        disableEnforceFocus={false} // default is false
        disableRestoreFocus={false} // default is false
        >
        <DialogTitle className="!bg-cyan-700 !hover:bg-cyan-800 text-white">Add / Update Item</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="ID"
            type="text"
            value={newRow.id}
            onChange={(e) => setNewRow({ ...newRow, id: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            type="text"
            value={newRow.name}
            onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Calories"
            type="number"
            value={newRow.calories}
            onChange={(e) => setNewRow({ ...newRow, calories: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Fat"
            type="number"
            value={newRow.fat}
            onChange={(e) => setNewRow({ ...newRow, fat: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Carbs"
            type="number"
            value={newRow.carbs}
            onChange={(e) => setNewRow({ ...newRow, carbs: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Protein"
            type="number"
            value={newRow.protein}
            onChange={(e) => setNewRow({ ...newRow, protein: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => saveRow(newRow)}
            variant="contained"
            className="!bg-cyan-700 !hover:bg-cyan-800 text-white"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
