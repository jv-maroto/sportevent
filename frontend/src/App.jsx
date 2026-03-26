import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import EventCreate from './pages/EventCreate';
import MyInscriptions from './pages/MyInscriptions';
import Dashboard from './pages/Dashboard';
import InscriptionSuccess from './pages/InscriptionSuccess';

export default function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/inscription/success" element={<InscriptionSuccess />} />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute requiredRole="organizer">
              <EventCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-inscriptions"
          element={
            <ProtectedRoute>
              <MyInscriptions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="organizer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
