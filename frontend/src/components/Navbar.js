import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import logo1 from "../images/logo1.png";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    // Check login status on mount and when localStorage changes
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            const storedRole = localStorage.getItem("role");
            const storedUsername = localStorage.getItem("username");
            const userData = JSON.parse(localStorage.getItem("user"));

            setIsLoggedIn(!!token);
            setRole(storedRole || "");
            setUsername(storedUsername || "");
            if (userData && userData.token) {
                setIsLoggedIn(true);
                setRole(userData.role || "");
                setUsername(userData.username || "");
                setName(userData.name || "");
                console.log("****** STORED USER: ", userData);
            } else {
                setIsLoggedIn(false);
                setRole("");
                setUsername("");
                setName("");
            }
        }; 

        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.clear();  
        setIsLoggedIn(false);
        setRole("");
        setUsername("");
        setName("");
        navigate("/");

        // Force re-render by triggering a state update
        window.dispatchEvent(new Event("storage"));

        // Close navbar in mobile view
        document.querySelector(".navbar-collapse")?.classList.remove("show");
    };

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                {/* Logo */}
                <NavLink className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo1} alt="Build Me..." width="40" className="me-2" />
                    <h1 className="h4 m-0">Build Me...</h1>
                </NavLink>

                {/* Toggle Button for Mobile View */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/portfolio">Portfolio</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/jobs">Jobs</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/companies">Companies</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>

                        {/* User Dropdown */}
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                                aria-expanded="false"
                            >👨‍🦱
                                <i className="bi bi-person-circle"></i> {isLoggedIn ? username : "User"}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                {isLoggedIn && <li className="dropdown-item text-muted"><strong>{name}</strong></li>}
                                {/* Show "Post a Job" if the user is logged in, regardless of role */}
                                {isLoggedIn && role === "user" && <li><NavLink className="dropdown-item" to="/postjob">Post a Job</NavLink></li>}
                                {!isLoggedIn && <li><NavLink className="dropdown-item" to="/login">Login</NavLink></li>}
                                {!isLoggedIn && <li><NavLink className="dropdown-item" to="/register">Register</NavLink></li>}
                                {isLoggedIn && <li><hr className="dropdown-divider" /></li>}
                                {isLoggedIn && (
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
