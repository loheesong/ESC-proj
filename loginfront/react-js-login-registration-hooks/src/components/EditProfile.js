import React, { useState } from 'react';
import AuthService from "../services/auth.service";

const EditProfileForm = ({ currentUser, onUpdate }) => {
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateProfile({ username, email});
      onUpdate({ username, email });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('An error occurred while updating your profile.');
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Update</button>
    </form>
  );
};

export default EditProfileForm;