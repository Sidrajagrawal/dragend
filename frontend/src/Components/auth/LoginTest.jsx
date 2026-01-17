import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      

      if (res.ok) {
        console.log("Login successful:", data);
        
       
        localStorage.setItem("isLoggedIn", "true");
        navigate("/new");
      } else {
        console.error("Login failed:", data);
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
        <input 
          className="border p-2 rounded-md"
          placeholder="Email" 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          className="border p-2 rounded-md"
          placeholder="Password" 
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button 
          className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-all"
          onClick={login}
        >
          Login
        </button>
      </div>
    </div>
  );
}