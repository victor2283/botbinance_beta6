import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Ajusta la URL según tu configuración

const register = async (username, email, password) => {
    return axios.post(API_URL + 'register/', {
        username,
        email,
        password,
    });
};

const login = async (email, password) => {
    const response = await axios.post(API_URL + 'login/', {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};


const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
};

// Asigna el objeto a una variable antes de exportarlo
const authService = {
    register,
    login,
    getCurrentUser,
    isAuthenticated,
};

export default authService;
