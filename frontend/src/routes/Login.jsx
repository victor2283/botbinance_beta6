import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../Config/authService';
import { useAuth } from '../Config/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      const response = await authService.login(email, password);
      //console.log(response);
      if (response.token) {
        login(); // Actualiza el estado de autenticación al iniciar sesión correctamente
        setMessage('Login successful!');
        navigate('/');
      } else {
        setMessage('Login failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ?
                <FontAwesomeIcon icon={faEye} />
                :
                <FontAwesomeIcon icon={faEyeSlash} />

              }
            </button>
          </div>
        </div>
        {message && <div className="alert alert-info">{message}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default Login;
