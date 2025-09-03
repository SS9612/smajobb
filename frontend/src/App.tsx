import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Payments from './pages/Payments';
import Reviews from './pages/Reviews';
import Search from './pages/Search';
import Media from './pages/Media';
import Notifications from './pages/Notifications';
import JobPostingForm from './components/JobPostingForm';
import { NotificationProvider } from './hooks/useNotifications';
import JobManagementDashboard from './components/JobManagementDashboard';
import JobDetails from './components/JobDetails';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <NotificationProvider>
          <div className="App min-h-screen bg-gray-50">
            <Navbar />
            <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/create" element={<JobPostingForm />} />
              <Route path="/jobs/manage" element={<JobManagementDashboard />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/jobs/:id/edit" element={<JobPostingForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/payments" element={<Payments />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/search" element={<Search />} />
            <Route path="/media" element={<Media />} />
            <Route path="/notifications" element={<Notifications />} />
            </Routes>
            </main>
          </div>
        </NotificationProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
