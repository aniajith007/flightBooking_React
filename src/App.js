import logo from './logo.svg';
import './App.css';
import FlightBooking from './Pages/searchpage';
import { Route, Routes } from 'react-router-dom';
import FlightSearchResults from './Pages/resultpage';
import Least_by_month from './Pages/least_by_month';
import BookingsPage from './Pages/Bookings';
import AdminFlightEntry from './Pages/Admin_Entry';
import LocationsEntry from './Pages/LocationsEntry';
import AdminPanel from './Pages/AdminPanel';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FlightBooking />} />
      <Route path="/locEntry" element={<LocationsEntry />} />
      <Route path="/sresult" element={<FlightSearchResults />} />
      <Route path="/sresult_lm" element={<Least_by_month />} />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/locentry" element={<LocationsEntry />} />
      <Route path="/admin/flightentry" element={<AdminFlightEntry />} />

    </Routes>
  );
}

export default App;


