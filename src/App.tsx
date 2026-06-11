import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import RulesPage from "./pages/RulesPage";
import ProgressPage from "./pages/ProgressPage";
import ConsultPage from "./pages/ConsultPage";
import FeedbackPage from "./pages/FeedbackPage";
import ServiceRecordsPage from "./pages/ServiceRecordsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/consult" element={<ConsultPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/records" element={<ServiceRecordsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
