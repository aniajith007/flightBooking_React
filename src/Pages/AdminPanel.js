import React from "react";
import Header from "../Components/Header";
import { Box, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Circle } from "@mui/icons-material";

function AdminPanel() {
    const navigate = useNavigate()
  return (
    <div>
      <Header />
      <Card variant="outlined" sx={{m:6}}>
        <Box my={2}>
          <Button startIcon={<Circle/>} onClick={()=>navigate('/admin/locentry')}>
            <Typography>Locations Entry</Typography>
          </Button>
        </Box>
        <Box my={2}>
          <Button startIcon={<Circle/>} onClick={()=>navigate('/admin/flightentry')}>
            <Typography>Flights entry</Typography>
          </Button>
        </Box>
      </Card>
    </div>
  );
}

export default AdminPanel;
