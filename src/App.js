import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Navbar, Footer } from "./components/navbarFooter/navbarFooter";
import ClientLogin from "./components/clientLogin/clientLogin";
import Frontpage from "./components/frontpage/frontpage";
import ClientSignup from "./components/clientSignup/clientSignup";
import Dashboard from "./components/dashboard/Dashboard";
import Properties from "./components/dashboard/pages/properties/Properties";
import Messages from "./components/dashboard/pages/messages/Messages";
import Calendar from "./components/dashboard/pages/calendar/Calendar";
import TenantPage from "./components/dashboard/pages/tenants/Tenant";
import Vault from "./components/dashboard/pages/vault/Vault";
import RequireAuth from "./components/RequireAuth";

function LayoutWithNavbarFooter({ children }) {
  const location = useLocation();
  // Check if current path is Frontpage or ClientSignup
  const showNavbarFooter = location.pathname === "/";

  return (
    <>
      {showNavbarFooter && <Navbar />}
      {children}
      {showNavbarFooter && <Footer />}
    </>
  );
}

function App() {
  const hostname = window.location.hostname;
  const isDashboard = hostname.startsWith("dashboard.");

  return (
    <Router>
      <div className="App">
        {isDashboard ? (
          // Dashboard subdomain routes
          <RequireAuth>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tenants" element={<TenantPage />} />
              <Route path="/vault" element={<Vault />} />
            </Routes>
          </RequireAuth>
        ) : (
          // Main domain routes
          <LayoutWithNavbarFooter>
            <Routes>
              <Route path="/" element={<Frontpage />} />
              <Route path="/login" element={<ClientLogin />} />
              <Route path="/signup" element={<ClientSignup />} />
            </Routes>
          </LayoutWithNavbarFooter>
        )}
      </div>
    </Router>
  );
}

export default App;
