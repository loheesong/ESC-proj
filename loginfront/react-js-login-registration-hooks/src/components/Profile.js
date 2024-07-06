import React from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.username}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>...</strong>
      </p>
      <p>
        Other relevant profile information
      </p>
      <p>
        <strong>Edit Profile Button</strong>
      </p>
      <p>
        <strong>Delete Profile Button</strong>
      </p>
    </div>
  );
};

export default Profile;
