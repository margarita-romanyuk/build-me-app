import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import header5 from "../images/header5.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("Login to your account");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Logging in...");

        if (!username || !password) {
            setMessage("Please enter both username and password");
            return;
        }

        try {
            console.log("Sending login request with:", { username, password });
            const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });

            console.log("Login success:", response.data);

            // Store user data in localStorage
            const userData = {
                id: response.data.id,
                name: response.data.name,
                username: response.data.username,
                role: response.data.role,
                token: response.data.token
            };
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userId", response.data.id); // Add this line
            localStorage.setItem("name", response.data.name);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);

            // Manually trigger an event to force Navbar update
            window.dispatchEvent(new Event("storage"));

            // Redirect after login
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
            setMessage(error.response?.data?.message || "Invalid credentials, please try again");
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/jobs" />;
    }

    return (
        <>
            <div >
                {<Header header="Find the best for your job" subheader="Connecting you with trusted local professionals" image={header5} />}
            </div>
            <div>
                <h2 className="text-center mb-4"><br /></h2>
            </div>
            <div>
                <h2 className="text-center mb-4">LOG IN</h2>
            </div>
            <Container className="mt-5">
                <Card className="shadow-sm p-4">
                    <Card.Body>
                        <div>
                            <h4>{message}</h4>
                            <form onSubmit={handleSubmit}>
                                <h5>Username</h5>
                                <input value={username} onChange={(e) => setUsername(e.target.value)} />
                                <h5>Password</h5>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <br /><br />

                                <Button type="submit" variant="primary" className="ms-2" >  Log In </Button>
                            </form>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
            <div>
                <h2 className="text-center mb-4"><br /></h2>
            </div>
        </>
    );
}

export default Login;