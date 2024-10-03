import React, { useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, Grid, Button, Box, Paper, Slider, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, FormControl, FormLabel,
    Container
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import BookingPage from '../Components/Booking2';



// Helper function to convert time to 24-hour format
const convertTimeTo24Hour = (time) => {
    const [hour, minute] = time.split(/[: ]/);
    const period = time.includes('PM') ? 'PM' : 'AM';
    let adjustedHour = parseInt(hour, 10);
    if (period === 'PM' && adjustedHour !== 12) adjustedHour += 12;
    if (period === 'AM' && adjustedHour === 12) adjustedHour = 0;
    return adjustedHour;
};

const Least_by_month = () => {
    const [tripType, setTripType] = useState('one-way'); // "one-way" or "round-trip"
    const [priceRange, setPriceRange] = useState([200, 500]);
    const [selectedFlight, setSelectedFlight] = useState(null); // State to manage selected flight
    const [isBooking, setIsBooking] = useState(false); // State to manage booking view
    const [timeFilters, setTimeFilters] = useState({
        before6am: false,
        sixAmToNoon: false,
        noonTo6pm: false,
        after6pm: false,
    });
    const [returnTimeFilters, setReturnTimeFilters] = useState({
        before6am: false,
        sixAmToNoon: false,
        noonTo6pm: false,
        after6pm: false,
    });

    const location = useLocation();
    const { flights } = location.state || { flights: [] };
    console.log(flights)
    // Handle trip type change (one-way or round-trip)
    const handleTripTypeChange = (event) => {
        setTripType(event.target.value);
    };

    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    const handleTimeFilterChange = (event) => {
        setTimeFilters({
            ...timeFilters,
            [event.target.name]: event.target.checked,
        });
    };

    const handleReturnTimeFilterChange = (event) => {
        setReturnTimeFilters({
            ...returnTimeFilters,
            [event.target.name]: event.target.checked,
        });
    };

    const clearFilters = () => {
        setPriceRange([200, 500]);
        setTimeFilters({
            before6am: false,
            sixAmToNoon: false,
            noonTo6pm: false,
            after6pm: false,
        });
        setReturnTimeFilters({
            before6am: false,
            sixAmToNoon: false,
            noonTo6pm: false,
            after6pm: false,
        });
    };

    const filterFlights = () => {
        return flights.filter((flight) => {
            // Only show flights based on selected trip type (one-way or round-trip)
            if ((tripType === 'one-way' && !flight.oneWay) || (tripType === 'round-trip' && flight.oneWay)) return false;

            // Filter by price
            if (flight.price < priceRange[0] || flight.price > priceRange[1]) return false;

            // Filter by departure time
            const departureHour = convertTimeTo24Hour(flight.departure);
            const matchDepartureTime = (
                (timeFilters.before6am && departureHour < 6) ||
                (timeFilters.sixAmToNoon && departureHour >= 6 && departureHour < 12) ||
                (timeFilters.noonTo6pm && departureHour >= 12 && departureHour < 18) ||
                (timeFilters.after6pm && departureHour >= 18)
            );

            // For round-trip, filter by return time
            if (tripType === 'round-trip') {
                const returnHour = convertTimeTo24Hour(flight.returnDeparture);
                const matchReturnTime = (
                    (returnTimeFilters.before6am && returnHour < 6) ||
                    (returnTimeFilters.sixAmToNoon && returnHour >= 6 && returnHour < 12) ||
                    (returnTimeFilters.noonTo6pm && returnHour >= 12 && returnHour < 18) ||
                    (returnTimeFilters.after6pm && returnHour >= 18)
                );

                const noTimeFiltersSelected = !Object.values(timeFilters).some(Boolean) && !Object.values(returnTimeFilters).some(Boolean);

                return noTimeFiltersSelected || (matchDepartureTime && matchReturnTime);
            }

            // If one-way, return flights matching the departure time filters
            const noTimeFiltersSelected = !Object.values(timeFilters).some(Boolean);
            return noTimeFiltersSelected || matchDepartureTime;
        });
    };

    const filterByTrip = () => {
        return flights.filter((flight) => {
            if (flight.tripType == tripType) return flight.tripType == tripType
            if (flight.tripType == tripType) return flight.tripType == tripType
            if ('all' == tripType) return flight
        })
    }

    const filteredFlights = filterByTrip();
    const handleBookNow = (flight) => {
        setSelectedFlight(flight); // Store the selected flight
        setIsBooking(true); // Switch to the booking page
    };

    const handleBack = () => {
        setIsBooking(false); // Go back to the flight selection
        setSelectedFlight(null); // Clear selected flight
    };

    useEffect(() => {
        //console.log("flights least : ", flights)
        console.log('f', filteredFlights)
    }, [])
    return (<>
        <Header />

        <Container>
            {isBooking ? (
                <BookingPage flight={selectedFlight} onBack={handleBack} /> // Render the BookingPage
            ) : (
                <Box sx={{ p: 4 }}>
                    <Grid container spacing={4}>
                        {/* Filter Section */}
                        <Grid item xs={12} sm={4} md={3}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Filter Flights
                                </Typography>

                                {/* Trip Type Radio Buttons (One-way / Round-trip) */}
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Trip Type</FormLabel>
                                    <RadioGroup
                                        aria-label="trip-type"
                                        name="trip-type"
                                        value={tripType}
                                        onChange={handleTripTypeChange}
                                        row
                                    >
                                        <FormControlLabel value="one-way" control={<Radio />} label="One-way" />
                                        <FormControlLabel value="round-trip" control={<Radio />} label="Round-trip" />
                                        <FormControlLabel value="all" control={<Radio />} label="Show all" />
                                    </RadioGroup>
                                </FormControl>
                            </Paper>
                        </Grid>

                        {/* Results Section */}
                        <Grid item xs={12} sm={8} md={9}>
                            <Typography variant="h4" gutterBottom>
                                Top 10 Flights ({filteredFlights[0]?.from + ' - ' + filteredFlights[0]?.to})
                            </Typography>
                            <Grid container spacing={4}>
                                {filteredFlights.length ? (
                                    filteredFlights.map((flight) => (
                                        <Grid item xs={12} sm={6} md={4} key={flight.id}>
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" component="div">
                                                        {flight.airline}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Departure: {new Date(flight.departure).toLocaleString()} | Arrival: {new Date(flight.arrival).toLocaleString()}
                                                    </Typography>
                                                    {tripType === 'round-trip' && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Return: {new Date(flight.returnDeparture).toLocaleString()} | Return Arrival: {new Date(flight.returnArrival).toLocaleString()}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                                        Duration: {flight.duration}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                                        Price: {flight.price}₹
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                                        Available Seats: {flight.seatCount}
                                                    </Typography>                                                    
                                                    <Button variant="contained" onClick={() => handleBookNow(flight)} color="primary" sx={{ mt: 2 }}>
                                                        Book Now
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        No flights found for the selected filters.
                                    </Typography>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>)}
        </Container>
    </>
    );
};

export default Least_by_month;
