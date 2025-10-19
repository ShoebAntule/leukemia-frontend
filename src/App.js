import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import UserDashboard from './components/Dashboard/UserDashboard';
import DoctorDashboard from './components/Dashboard/DoctorDashboard';
import Patients from './components/Dashboard/Patients';
import Reports from './components/Dashboard/Reports';
import PatientMessages from './components/Dashboard/PatientMessages';
import Profile from './components/Dashboard/Profile';
import ContactDoctor from './components/Dashboard/ContactDoctor';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import CellAnalysis from './components/Dashboard/CellAnalysis';
import './styles.css';

function App() {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = user.user_type;

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => isAuthenticated ? (userType === 'doctor' ? <Redirect to="/doctor-dashboard" /> : <Redirect to="/dashboard" />) : <Redirect to="/login" />} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/dashboard" component={UserDashboard} />
        <Route path="/doctor-dashboard" component={DoctorDashboard} />
        <Route path="/patients" component={Patients} />
        <Route path="/cell-analysis" component={CellAnalysis} />
        <Route path="/reports" component={Reports} />
        <Route path="/messages" component={PatientMessages} />
        <Route path="/profile" component={Profile} />
        <Route path="/contact" component={ContactDoctor} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
