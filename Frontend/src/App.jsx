import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import LoginForm from '../Components/Login';
import SignUpForm from '../Components/Signup';
import ExpenseTracker from "../Components/Mainmenu";
import EmailVerification from "../Components/EmailVerification";
import AI from "../Components/ChatAi";


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

        {/* Email Verification Page */}
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<ExpenseTracker />} />
        <Route  path="/help" element={<AI/>}/>
      </Routes>
    </Router>
  );
}

export default App;

