import React, { useState, useEffect } from 'react';
import {
    Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, TextField, Button,
    Select, MenuItem, InputLabel, Autocomplete,
    Container,
    AppBar,
    Toolbar,
    Box
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import { ArrowUpwardTwoTone, DoubleArrow, ImportExport, KeyboardDoubleArrowDown, Search, TrendingDown } from '@mui/icons-material';

const FlightBooking = () => {
    const [tripType, setTripType] = useState('one-way');
    const [fromLocation, setFromLocation] = useState(null);
    const [toLocation, setToLocation] = useState(null);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [flightClass, setFlightClass] = useState('Economy');
    const [locations, setLocations] = useState([]);
    const [flights, setFlights] = useState([]);

    const navigate = useNavigate()

    // Fetch locations and flight data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3005/users/locations');
                setLocations(response.data);
                //setFlights(response.data.flights);

                console.log(response)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        var bookingDetails;
        tripType == 'least_month' ? bookingDetails = {
            fromLocation: fromLocation,
            toLocation: toLocation,
            month: new Date(departureDate).getMonth() + 1
        } : bookingDetails = {
            tripType,
            fromLocation,
            toLocation,
            departureDate,
            returnDate: tripType === 'round-trip' ? returnDate : null,
            flightClass,
        };
        console.log(bookingDetails);

        // Call filter endpoint
        try {
            const response = tripType == "least_month" ? await axios.post('http://localhost:3005/users/month', bookingDetails) : await axios.post('http://localhost:3005/users', bookingDetails);
            setFlights(response.data); // Update flights state with filtered results
            console.log('Filtered Flights:', response.data);
            navigate('/sresult', { state: { flights: response.data } })
            tripType == 'least_month' &&
                navigate('/sresult_lm', { state: { flights: response.data } })

        } catch (error) {
            console.error('Error filtering flights:', error);
        }
    };

    return (
        <>
        <Header />
        <Container>
            
            <form onSubmit={handleSubmit}>
                <Box my={8}>
                    {/* Trip Type Radio Group */}
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel component="legend">Trip Type</FormLabel>
                        <RadioGroup
                            row
                            value={tripType}
                            onChange={(e) => setTripType(e.target.value)}
                        >
                            <FormControlLabel value="one-way" control={<Radio />} label={<Box><ArrowUpwardTwoTone fontSize='small' />One Way</Box>} />
                            <FormControlLabel value="round-trip" control={<Radio />} label={<Box><ImportExport fontSize='small' />Round Trip</Box>} />
                            <FormControlLabel value="least_month" control={<Radio />} label={<Box><TrendingDown  fontSize='small' sx={{mr:1}}/>Least By Month</Box>} />
                        </RadioGroup>
                    </FormControl>

                    {/* From Location Autocomplete */}
                    <Autocomplete
                        options={locations}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => setFromLocation(newValue.name)}
                        renderInput={(params) => (
                            <TextField {...params} label="From Location" variant="outlined" fullWidth margin="normal" required />
                        )}
                    />

                    {/* To Location Autocomplete */}
                    <Autocomplete
                        options={locations.filter((l) => l.name !== fromLocation)}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => setToLocation(newValue.name)}
                        renderInput={(params) => (
                            <TextField {...params} label="To Location" variant="outlined" fullWidth margin="normal" required />
                        )}
                    />

                    {/* Departure Date */}
                    {tripType == "least_month" ? <TextField
                        label="Departure Date"
                        type="month"
                        variant="outlined"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    /> : <TextField
                        label="Departure Date"
                        type="date"
                        variant="outlined"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        required
                    />}

                    {/* Return Date (only if round trip is selected) */}
                    {tripType === 'round-trip' && (
                        <TextField
                            label="Return Date"
                            type="date"
                            variant="outlined"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                    )}

                    {/* Flight Class Dropdown */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Class</InputLabel>
                        <Select
                            value={flightClass}
                            onChange={(e) => setFlightClass(e.target.value)}
                            label="Class"
                            required
                        >
                            <MenuItem value="Economy">Economy</MenuItem>
                            <MenuItem value="Luxury">Luxury</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Submit Button */}
                    <Button startIcon={<Search/>} type="submit" variant="contained" color="primary" fullWidth>
                        Search Flights
                    </Button>
                </Box>
            </form>

        </Container >
        </>
    );
};

export default FlightBooking;
