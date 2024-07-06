import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Trading from './routes/Trading';
import Menu from './Components/Menu';
import Login from './routes/Login';
import Register from './routes/Register';
import Profile from './routes/Profile';
import PrivateRoute from './routes/PrivateRoute';
import Config from './routes/Config';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Css/ChartPlotly.css';
import Home from './routes/Home';

const App = () => {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trading" element={<PrivateRoute><Trading /></PrivateRoute>} />
          <Route path="/config" element={<PrivateRoute><Config /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> 
        </Routes>
      </div>
    </Router>
  );
};
export default App;
