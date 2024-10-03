import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import {
  LocalizationProvider,
  DesktopDateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { differenceInMinutes } from "date-fns"; // For calculating duration
import Header from "../Components/Header";

const AdminFlightEntry = () => {
  const [flights, setFlights] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [duration, setDuration] = useState("");

  const { control, handleSubmit, reset, watch } = useForm();

  // Watch fields for calculating duration
  const departure = watch("departure");
  const arrival = watch("arrival");
  const returnDeparture = watch("returnDeparture");
  const returnArrival = watch("returnArrival");
  const tripType = watch("tripType"); // Watch the trip type selection

  const flightClassOptions = ["Luxury", "Economy"];

  // Fetch flights from the server
  const fetchFlights = async () => {
    try {
      const response = await fetch("http://localhost:3005/users/admin/flights");
      const data = await response.json();
      console.log(data);
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  // Fetch locations from API
  const fetchLocations = async () => {
    try {
      const response = await fetch("http://localhost:3005/users/locations");
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    fetchLocations();
    fetchFlights();
  }, []);

  // Calculate duration whenever departure or arrival changes
  useEffect(() => {
    if (departure && arrival) {
      const durationMinutes = differenceInMinutes(
        new Date(arrival),
        new Date(departure)
      );
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      setDuration(`${hours}h ${minutes}m`);
    }
  }, [departure, arrival]);

  // Calculate return duration if returnDeparture and returnArrival are available
  useEffect(() => {
    if (returnDeparture && returnArrival) {
      const durationMinutes = differenceInMinutes(
        new Date(returnArrival),
        new Date(returnDeparture)
      );
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      setDuration((prev) => `${prev} / ${hours}h ${minutes}m (Return)`); // Append return duration
    }
  }, [returnDeparture, returnArrival]);

  const onSubmit = async (data) => {
    const flightData = {
      ...data,
      departure: data.departure.toISOString(),
      arrival: data.arrival.toISOString(),
      returnDeparture: data.returnDeparture
        ? data.returnDeparture.toISOString()
        : null,
      returnArrival: data.returnArrival
        ? data.returnArrival.toISOString()
        : null,
      duration,
    };

    try {
      const response = selectedFlight
        ? await fetch(
            `http://localhost:3005/users/admin/flights/${selectedFlight._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(flightData),
            }
          )
        : await fetch("http://localhost:3005/users/admin/flightentry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(flightData),
          });

      if (response.ok) {
        await fetchFlights(); // Refresh flight list after submission
        reset();
        setDuration(""); // Reset duration after submission
        setSelectedFlight(null); // Reset selected flight for new entries
      }
    } catch (error) {
      console.error("Error submitting flight:", error);
    }
  };

  const handleEditFlight = (flight) => {
    setSelectedFlight(flight);
    reset({
      airline: flight.airline,
      from: flight.from,
      to: flight.to,
      departure: dayjs(flight.departure),
      arrival: dayjs(flight.arrival),
      price: flight.price,
      flightClass: flight.flightClass,
      tripType: flight.tripType,
      returnDeparture: flight.returnDeparture
        ? dayjs(flight.returnDeparture)
        : null,
      returnArrival: flight.returnArrival ? dayjs(flight.returnArrival) : null,
    });
    setDuration(flight.duration);
  };

  return (
    <Box m={1}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <Typography variant="h6" gutterBottom>
          Admin Flight Entry
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="airline"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} label="Airline" fullWidth required />
            )}
          />
          <Controller
            name="from"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="From" fullWidth required>
                {locations.map((location, index) => (
                  <MenuItem key={index} value={location.name}>
                    {location.name.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="to"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField {...field} select label="To" fullWidth required>
                {locations.map(
                  (location) =>
                    location.name !== watch("from") && (
                      <MenuItem key={location._id} value={location.name}>
                        {location.name.toUpperCase()}
                      </MenuItem>
                    )
                )}
              </TextField>
            )}
          />
          <Controller
            name="departure"
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <DesktopDateTimePicker
                label="Departure"
                value={value}
                onChange={onChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            )}
          />
          <Controller
            name="arrival"
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <DesktopDateTimePicker
                label="Arrival"
                value={value}
                onChange={onChange}
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            )}
          />

          {/* Conditionally render return fields based on trip type */}
          {watch("tripType") === "round-trip" && (
            <>
              <Controller
                name="returnDeparture"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <DesktopDateTimePicker
                    label="Return Departure"
                    value={value}
                    onChange={onChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                )}
              />

              <Controller
                name="returnArrival"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <DesktopDateTimePicker
                    label="Return Arrival"
                    value={value}
                    onChange={onChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                )}
              />
            </>
          )}

          <TextField
            label="Duration"
            value={duration}
            fullWidth
            readOnly
            margin="normal"
          />
          <Controller
            name="price"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                required
              />
            )}
          />
          <Controller
            name="flightClass"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Flight Class"
                fullWidth
                required
              >
                {flightClassOptions.map((fc, index) => (
                  <MenuItem key={index} value={fc}>
                    {fc}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="tripType"
            control={control}
            defaultValue="one-way"
            render={({ field }) => (
              <TextField {...field} select label="Trip Type" fullWidth>
                <MenuItem value="one-way">One-way</MenuItem>
                <MenuItem value="round-trip">Round-trip</MenuItem>
              </TextField>
            )}
          />
          <Button type="submit" variant="contained" color="primary">
            {selectedFlight ? "Update Flight" : "Add Flight"}
          </Button>
        </form>

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Airline</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Departure</TableCell>
                <TableCell>Arrival</TableCell>
                <TableCell>Return Departure</TableCell>
                <TableCell>Return Arrival</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Flight Class</TableCell>
                <TableCell>Trip Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flights.map((flight) => (
                <TableRow key={flight._id}>
                  <TableCell>{flight.airline}</TableCell>
                  <TableCell>{flight.from}</TableCell>
                  <TableCell>{flight.to}</TableCell>
                  <TableCell>{flight.departure?.toString()}</TableCell>
                  <TableCell>{flight.arrival?.toString()}</TableCell>
                  <TableCell>{flight.returnDeparture?.toString()}</TableCell>
                  <TableCell>{flight.returnArrival?.toString()}</TableCell>
                  <TableCell>{flight.duration}</TableCell>
                  <TableCell>{flight.price}</TableCell>
                  <TableCell>{flight.flightClass}</TableCell>
                  <TableCell>{flight.tripType}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleEditFlight(flight)}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </LocalizationProvider>
    </Box>
  );
};

export default AdminFlightEntry;
