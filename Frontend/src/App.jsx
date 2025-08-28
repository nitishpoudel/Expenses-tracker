import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import LoginForm from '../Components/Login';
import SignUpForm from '../Components/Signup';
import Mainmenu from '../Components/Mainmenu';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root (/) to /login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login Page */}
        <Route path="/login" element={<LoginForm />} />

        {/* Signup Page */}
        <Route path="/signup" element={<SignUpForm />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Mainmenu />} />
      </Routes>
    </Router>
  );
}

export default App;
