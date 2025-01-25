import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home/Home';
import Admin from './Components/Admin/Admin';
import HomeEdit from './Components/HomeEdit/HomeEdit';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/home-edit" element={<HomeEdit />} />
        
      </Routes>
    </Router>
  );
};

export default App;
