import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import jsPDF from "jspdf"; // Import jsPDF
import logo from "../logo192.png"; // Import your logo image

const BookingPage = ({ flight, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [passengers, setPassengers] = useState([
    { name: "", age: "", email: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAddPassenger = () => {
    setPassengers([...passengers, { name: "", age: "", email: "" }]);
  };

  const handleRemovePassenger = (index) => {
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = passengers.map((passenger, i) =>
      i === index ? { ...passenger, [field]: value } : passenger
    );
    setPassengers(newPassengers);
  };

  const handleSubmit = async () => {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneNumber) {
      setError("Phone number is required");
      return;
    } else if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    for (const passenger of passengers) {
      if (!passenger.name || !passenger.age || !passenger.email) {
        setError("Please fill out all passenger information");
        return;
      }
    }

    setLoading(true);

    const bookingDetails = {
      flight,
      phoneNumber,
      passengers,
    };

    try {
      const response = await fetch("http://localhost:3005/users/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      if (response.ok) {
        setOpenDialog(true);
        setError("");
      } else {
        setSnackbarMessage("Failed to confirm booking");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbarMessage("An error occurred while booking");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    onBack(); // Navigate back to flights after closing the dialog
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const logoWidth = 10; // Width of the logo
    const logoHeight = 10; // Height of the logo

    // Add logo
    doc.addImage(logo, "PNG", 10, 10, logoWidth, logoHeight);
    doc.setDrawColor(0);
    doc.setLineWidth(2);
    doc.rect(5, 5, 200, 250); // (x, y, width, height)

    // Title
    doc.setFontSize(16);
    doc.text("Invoice", 100, 30, { align: "center" });

    // GST Information
    doc.setFontSize(12);
    doc.text("GST Registration Number: 123456789", 10, 50);
    doc.text("GST Amount: $35.00", 10, 60);

    // Booking Details
    doc.text(`Airline: ${flight.airline}`, 10, 80);
    doc.text(`Price: ${flight.price}inr`, 10, 90);
    doc.text(`Phone Number: ${phoneNumber}`, 10, 100);
    doc.text(
      `Departure: ${new Date(flight.departure).toLocaleString()}`,
      10,
      110
    );
    doc.text(
      `Arrival: ${new Date(flight.arrival).toLocaleString()}`,
      10,
      120
    );
    passengers.forEach((passenger, index) => {
      doc.text(
        `Passenger ${index + 1}: ${passenger.name}, Age: ${
          passenger.age
        }, Email: ${passenger.email}`,
        10,
        140 + index * 10
      );
    });
    doc.text(
      `Total Price :
      ${flight.price * passengers.length}inr`,
      10,
      180
    );
    // Save the PDF
    doc.save("booking_invoice.pdf");

    doc.save("ticket.pdf"); // Save the PDF
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking Details
      </Typography>
      <Typography variant="h6">{flight.airline}</Typography>
      <Typography>Price: {flight.price}inr</Typography>
      <Typography>Departure: {flight.departure}</Typography>
      <Typography>Arrival: {flight.arrival}</Typography>
      {flight.tripType === "round-trip" && (
        <>
          <Typography>Return Departure: {flight.returnDeparture}</Typography>
          <Typography>Return Arrival: {flight.returnArrival}</Typography>
        </>
      )}

      <TextField
        label="Phone Number"
        variant="outlined"
        fullWidth
        value={phoneNumber}
        onChange={(e) => {
          setPhoneNumber(e.target.value);
          setError(""); // Clear error on input change
        }}
        error={!!error}
        helperText={error}
        sx={{ mt: 2 }}
      />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Passenger Information
      </Typography>
      {passengers.map((passenger, index) => (
        <Box key={index} sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={passenger.name}
            onChange={(e) =>
              handlePassengerChange(index, "name", e.target.value)
            }
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Age"
            type="number"
            value={passenger.age}
            onChange={(e) =>
              handlePassengerChange(index, "age", e.target.value)
            }
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Email"
            value={passenger.email}
            onChange={(e) =>
              handlePassengerChange(index, "email", e.target.value)
            }
            variant="outlined"
            fullWidth
          />
          <IconButton
            color="secondary"
            onClick={() => handleRemovePassenger(index)}
          >
            <RemoveCircle />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddPassenger}
        sx={{ mt: 2 }}
        startIcon={<AddCircle />}
      >
        Add Passenger
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={onBack}
        sx={{ mt: 2, ml: 2 }}
      >
        Back to Flights
      </Button>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Booking Confirmed</DialogTitle>
        <DialogContent>
          <Typography>Your booking has been confirmed successfully!</Typography>
          <Typography>Flight: {flight.airline}</Typography>
          <Typography>Phone Number: {phoneNumber}</Typography>
          <Typography>Passengers:</Typography>
          {passengers.map((passenger, index) => (
            <Typography key={index}>
              {passenger.name} - {passenger.age} years old - {passenger.email}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={generatePDF} color="primary">
            Print Ticket
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        autoHideDuration={6000}
      />
    </Box>
  );
};

export default BookingPage;
