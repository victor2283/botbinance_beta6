import React from 'react';
import authService from '../Config/authService';

const Profile = () => {
    const currentUser = authService.getCurrentUser();

    return (
        <div className="container mt-5">
            <h2>Perfil del Usuario</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{currentUser.user.username}</h5>
                    <p className="card-text">Email: {currentUser.user.email}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
