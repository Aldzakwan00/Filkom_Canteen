import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';  
import Register from './pages/Register';
import HomeMahasiswa from './pages/HomeMahasiswa'; 
import MenuKantin from './pages/MenuKantin'; 
import HomeAdmin from './pages/HomeAdmin';
import HomePenjual from './pages/HomePenjual';

function App() {
  return (
    <Router> 
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/homeMahasiswa" element={<HomeMahasiswa />} />
          <Route path="/menuKantin" element={<MenuKantin />} /> {/* Perubahan di sini */}
          <Route path="/homeAdmin" element={<HomeAdmin />} />
          <Route path="/homePenjual" element={<HomePenjual />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
