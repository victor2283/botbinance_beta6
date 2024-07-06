import React from 'react';
import { Link} from 'react-router-dom';
import { useAuth } from '../Config/AuthContext';
function Menu() {
  const { isAuthenticated, logout, login } = useAuth();
  const token = localStorage.getItem('token');
  if (token) {
    login()
  }
  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Home</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated ? (<>
                <li className="nav-item">
                  <Link className="nav-link" to="/trading">Trading</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/config">Config</Link>
                </li>
              
              </>):(<></>)}  
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light ms-2" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link btn btn-outline-light ms-2" to="/login">Login</Link>
                </li>
              </>
            )}

          </ul>
        </div>
        

        
      </div>
    </nav>
  );
}

export default Menu;
