// BookingsPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Snackbar,
  Container,
} from "@mui/material";
import jsPDF from "jspdf";
import logo from "../logo192.png"; // Import your logo image
import Header from "../Components/Header";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Function to fetch bookings based on phone number
  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3005/users/bookings?phoneNumber=${phoneNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("bookings", data);
        if (data.length > 0) {
          setBookings(data);
          setSnackbarMessage("Bookings retrieved successfully!");
        } else {
          setSnackbarMessage("No bookings found for this phone number.");
        }
      } else {
        setSnackbarMessage("Failed to fetch bookings.");
      }
    } catch (error) {
      setSnackbarMessage("Error fetching bookings.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  // Function to generate PDF
  const generatePDF = (booking) => {
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
    doc.text(`Airline: ${booking.flight.airline}`, 10, 80);
    doc.text(`Price: ${booking.flight.price}inr`, 10, 90);
    doc.text(`Phone Number: ${booking.phoneNumber}`, 10, 100);
    doc.text(
      `Departure: ${new Date(booking.flight.departure).toLocaleString()}`,
      10,
      110
    );
    doc.text(
      `Arrival: ${new Date(booking.flight.arrival).toLocaleString()}`,
      10,
      120
    );
    booking.passengers.forEach((passenger, index) => {
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
      ${booking.flight.price * booking.passengers.length}inr`,
      10,
      180
    );
    // Save the PDF
    doc.save("booking_invoice.pdf");
  };

  return (
    <>
      <Header />
      <Container>
        <Box sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            My Bookings
          </Typography>
          <TextField
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            size="small"
            sx={{ m: 1 }}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button
            sx={{ m: 1 }}
            variant="contained"
            color="primary"
            onClick={fetchBookings}
          >
            Fetch Bookings
          </Button>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {bookings.length ? (
              bookings.map((booking, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {booking.flight.airline}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: ${booking.flight.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone Number: {booking.phoneNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Departure:{" "}
                        {new Date(booking.flight.departure).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Arrival:{" "}
                        {new Date(booking.flight.arrival).toLocaleString()}
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => generatePDF(booking)} // Generate PDF on click
                        sx={{ mt: 2 }}
                      >
                        Print Ticket
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography variant="h6" sx={{ mx: 4, my: 4 }}>
                No bookings found.
              </Typography>
            )}
          </Grid>

          <Snackbar
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            message={snackbarMessage}
            autoHideDuration={6000}
          />
        </Box>
      </Container>
    </>
  );
};

export default BookingsPage;
