import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Maker");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        email,
        password,
        role,
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      setUser({ role: response.data.role });
    } catch (err) {
      setError("Invalid credentials or role mismatch.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-96 m-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input className="p-2 border mb-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="p-2 border mb-2" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <select className="p-2 border mb-2" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Maker">Maker</option>
        <option value="Checker">Checker</option>
        <option value="Reviewer">Reviewer</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleLogin}>Login</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Login;
