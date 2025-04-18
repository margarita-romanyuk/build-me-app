import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar';
import Home from "./views/Home";
import Jobs from "./views/Jobs";
import JobDetails from "./views/JobDetails";
import Companies from "./views/Companies";
import Footer from './components/Footer';
import Contact from "./views/Contact";
import PostJob from "./views/PostJob";
import Login from "./views/Login";
import Register from "./views/Register";
import Portfolio from "./views/Portfolio";

function App() {
  return (
    <div>
      <Router>
        <Navbar />  
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/postjob" element={<PostJob />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/portfolio" element={<Portfolio />} />
         
          </Routes>      
        <Footer />
      </Router>
    </div>
  );
}

export default App;


