import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Container, Typography } from '@mui/material';
import Header from '../Components/Header';

const LocationEntry = () => {
  const { control, handleSubmit, reset } = useForm();
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing locations
  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:3005/users/locations');
      const data = await response.json();
      console.log(data)
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // On form submit
  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:3005/users/admin/locationentry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data).toLowerCase(),
      });

      if (response.ok) {
        fetchLocations(); // Refresh the locations list
        reset(); // Reset the form
        setErrorMessage(''); // Clear error message if successful
      } else {
        const result = await response.json();
        setErrorMessage(result.message); // Set error message if exists
      }
    } catch (error) {
      console.error('Error submitting location:', error);
    }
  };

  return (
    <>
    <Header/>
    <Container>
      <Typography variant="h5" gutterBottom>Location Entry</Typography>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Location Name" fullWidth required />
          )}
        />
        <Button type="submit" sx={{my:1}} variant="contained" color="primary">
          Add Location
        </Button>
      </form>

      <Typography variant="h5" style={{ marginTop: '20px' }}>Existing Locations</Typography>
      <ul>
        {locations.map((location) => (
          <li key={location._id}>{location.name}</li>
        ))}
      </ul>
    </Container>
    </>
  );
};

export default LocationEntry;
