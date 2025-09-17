import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Clients from "../pages/Clients";
import Admin from "../pages/Admins";
import RegisterClients from "../pages/RegisterClients";
import LoginClients from "../pages/LoginClients";
import RegisterAdmin from "../pages/RegisterAdmins";
import LoginAdmin from "../pages/LoginAdmins";
import Profile from "../pages/Profile";
import DailyForm from "../pages/DailyForm";
import DailyList from "../pages/DailyList";
import Facturation from "../pages/Facturation";

function Landing() {
  return (
    <Router>
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Clients" element={<Clients />} />
          <Route path="/Clients/register" element={<RegisterClients />} />
          <Route path="/Clients/login" element={<LoginClients />} />
          <Route path="/Clients/profile" element={<Profile />} />
          <Route path="/Clients/profile/daily" element={<DailyForm />} />
          <Route path="/Clients/profile/daily/export" element={<DailyList />} />
          <Route
            path="/Clients/profile/facturation/*"
            element={<Facturation />}
          />

          <Route path="/Admins" element={<Admin />} />
          <Route path="/Admins/register" element={<RegisterAdmin />} />
          <Route path="/Admins/login" element={<LoginAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Landing;
