// BookingPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

const BookingPage = ({ flight, onBack }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false); // State to control the dialog

    const handleSubmit = async () => {
        if (!phoneNumber) {
            setError('Phone number is required');
            return;
        }

        const bookingDetails = {
            flight,
            phoneNumber,
        };

        try {
            const response = await fetch('http://localhost:3005/users/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });

            if (response.ok) {
                setOpenDialog(true); // Open dialog on successful booking
                // Optionally, reset form or redirect
            } else {
                alert('Failed to confirm booking');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while booking');
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        onBack(); // Navigate back to flights after closing the dialog
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Booking Details
            </Typography>
            <Typography variant="h6">{flight.airline}</Typography>
            <Typography>Price: ${flight.price}</Typography>
            <Typography>Departure: {flight.departure}</Typography>
            <Typography>Arrival: {flight.arrival}</Typography>
            <Typography>Return Departure: {flight.returnDeparture}</Typography>
            <Typography>Return Arrival: {flight.returnArrival}</Typography>

            <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={!!error}
                helperText={error}
                sx={{ mt: 2 }}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                Confirm Booking
            </Button>
            <Button variant="outlined" color="secondary" onClick={onBack} sx={{ mt: 2, ml: 2 }}>
                Back to Flights
            </Button>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Booking Confirmed</DialogTitle>
                <DialogContent>
                    <Typography>Your booking has been confirmed successfully!</Typography>
                    <Typography>Flight: {flight.airline}</Typography>
                    <Typography>Phone Number: {phoneNumber}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingPage;
