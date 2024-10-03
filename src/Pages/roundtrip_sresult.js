import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Paper,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Container,
} from "@mui/material";
import BookingPage from "../Components/Booking"; // Import the BookingPage component
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";

// Helper function to convert time to 24-hour format
const convertTimeTo24Hour = (time) => {
  const [hour, minute, period] = time.split(/[: ]/);
  let adjustedHour = parseInt(hour, 10);
  if (isNaN(adjustedHour)) return 0; // Return a default value if parsing fails
  if (period === "PM" && adjustedHour !== 12) adjustedHour += 12;
  if (period === "AM" && adjustedHour === 12) adjustedHour = 0;
  return adjustedHour;
};

const Roundtrip = ({ flightData }) => {
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

  // Handle price change
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handle departure time filter change
  const handleTimeFilterChange = (event) => {
    setTimeFilters({
      ...timeFilters,
      [event.target.name]: event.target.checked,
    });
  };

  // Handle return time filter change
  const handleReturnTimeFilterChange = (event) => {
    setReturnTimeFilters({
      ...returnTimeFilters,
      [event.target.name]: event.target.checked,
    });
  };

  // Clear all filters
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
    return flightData.filter((flight) => {
      

      // Filter by price
      if (flight.price < priceRange[0] || flight.price > priceRange[1])
        return false;

      // Filter by departure time
      const departureHour = convertTimeTo24Hour(flight.departure);
      const matchDepartureTime =
        (timeFilters.before6am && departureHour < 6) ||
        (timeFilters.sixAmToNoon && departureHour >= 6 && departureHour < 12) ||
        (timeFilters.noonTo6pm && departureHour >= 12 && departureHour < 18) ||
        (timeFilters.after6pm && departureHour >= 18);

      const noTimeFiltersSelected = !Object.values(timeFilters).some(Boolean);
      return noTimeFiltersSelected || matchDepartureTime;
    });
  };

  const filteredFlights = filterFlights();
  const formatDateTime = (dateTimeString) => {
    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  const handleBookNow = (flight) => {
    setSelectedFlight(flight); // Store the selected flight
    setIsBooking(true); // Switch to the booking page
  };
  const navigate = useNavigate();
  const handleBack = () => {
    setIsBooking(false); // Go back to the flight selection
    setSelectedFlight(null); // Clear selected flight
    navigate("/");
  };
  return (
    <>
      <Header />
      <Container>
        <Box my={2}>
          {isBooking ? (
            <BookingPage flight={selectedFlight} onBack={handleBack} /> // Render the BookingPage
          ) : (
            <Grid container spacing={4}>
              {/* Filter Section */}
              <Grid item xs={12} sm={4} md={3}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Filter Flights
                  </Typography>

                  {/* Price Slider */}
                  <Typography gutterBottom>Price Range</Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={200}
                    max={500}
                    step={10}
                    marks={[
                      { value: 200, label: "200" },
                      { value: 500, label: "500" },
                    ]}
                  />

                  {/* Departure Time Filters */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Departure Time
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timeFilters.before6am}
                          onChange={handleTimeFilterChange}
                          name="before6am"
                        />
                      }
                      label="Before 6 AM"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timeFilters.sixAmToNoon}
                          onChange={handleTimeFilterChange}
                          name="sixAmToNoon"
                        />
                      }
                      label="6 AM - 12 PM"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timeFilters.noonTo6pm}
                          onChange={handleTimeFilterChange}
                          name="noonTo6pm"
                        />
                      }
                      label="12 PM - 6 PM"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timeFilters.after6pm}
                          onChange={handleTimeFilterChange}
                          name="after6pm"
                        />
                      }
                      label="After 6 PM"
                    />
                  </FormGroup>

                  

                  {/* Clear Filter Button */}
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={clearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              </Grid>

              {/* Results Section */}
              <Grid item xs={12} sm={8} md={9}>
                <Typography variant="h4" gutterBottom>
                  Search Results - RoundTrip (
                  {filteredFlights[0]?.from + " - " + filteredFlights[0]?.to})
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
                              Departure: {formatDateTime(flight.departure)} |
                              Arrival: {formatDateTime(flight.arrival)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Return: {formatDateTime(flight.returnDeparture)} |
                              Return Arrival:{" "}
                              {formatDateTime(flight.returnArrival)}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              Duration: {flight.duration}
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                              Price: {flight.price}inr
                            </Typography>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                              Available Seats: {flight.seatCount}
                            </Typography>
                            <Button
                              variant="contained"
                              color="primary"
                              sx={{ mt: 2 }}
                              onClick={() => handleBookNow(flight)}
                            >
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
          )}
        </Box>
      </Container>
    </>
  );
};

export default Roundtrip;
