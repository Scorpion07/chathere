import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import BotsManager from "./pages/BotsManager";
import Settings from "./pages/Settings";
import ChatApp from "./pages/Chat";
import HomePage from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar /> {/* 👈 Always visible on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/bots" element={<BotsManager />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
