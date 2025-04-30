import React, { useState } from 'react';

const Register = ({ onRegister, switchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error('Registration failed');
      onRegister();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-panel">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
        {error && <div className="auth-error">{error}</div>}
      </form>
      <div className="auth-switch">Already have an account? <button onClick={switchToLogin}>Login</button></div>
    </div>
  );
};

export default Register;
