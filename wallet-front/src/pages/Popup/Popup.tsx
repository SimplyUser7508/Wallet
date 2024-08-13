import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Home from '../Home/Home';
import Login from '../Auth/Components/Login/Login';
import Register from '../Auth/Components/Register/Register';
import { AuthProvider } from '../Auth/Context/Auth';

const PopupContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const location = useLocation(); // Используем useLocation внутри Router

  useEffect(() => {
    // Проверяем наличие accessToken в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const renderAuthComponent = () => {
    switch (location.pathname) {
      case '/auth/login':
        return <Login />;
      case '/auth/register':
        return <Register />;
      default:
        return <Login />;
    }
  };

  return (
    <AuthProvider>
      {isAuthenticated ? <Home /> : renderAuthComponent()}
    </AuthProvider>
  );
}

const Popup: React.FC = () => {
  return (
    <Router>
      <PopupContent />
    </Router>
  );
}

export default Popup;
