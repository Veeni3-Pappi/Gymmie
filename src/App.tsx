import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Navbar from "./Components/Layouts/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1"> 
            <Routes>
              <Route index element={<Home />} />
              <Route path="/Onboarding" element={<Onboarding />} />
              <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/auth/:pathname" element={<Auth />} />
              <Route path="/Account/:pathname" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
