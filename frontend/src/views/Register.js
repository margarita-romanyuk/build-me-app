
// Import dependencies for registration functionality
import axios from 'axios'; // - HTTP client for API requests
                      // - Sends form data to backend for user/company registration
import { useState } from 'react'; // - React hook for managing component state
                          // - Tracks form inputs, messages, and registration status
import { Navigate } from 'react-router-dom'; // - Component for programmatic navigation
                                    // - Redirects to login page after successful registration
import { Container, Card, Button } from "react-bootstrap"; // - Bootstrap components for UI
                                                   // - Styles form with responsive card and button
import header1 from "../images/header1.jpg"; // - Image for header banner
                                     // - Displays visual branding at top of page
import "bootstrap/dist/css/bootstrap.min.css"; // - Bootstrap CSS framework
                                       // - Provides consistent styling for form and layout
import Header from "../components/Header"; // - Custom header component
                                  // - Renders page banner with title, subtitle, and image

// Register component for creating user or company accounts
// - Renders a form to collect registration details and submit to backend
// - Allows new users/companies to join the "Build Me..." platform
// - FEATURES:
//   - Form with fields: Name, Address, City, Email, Tel, Username, Password, role
//   - Role selection: "user" (private) or "company"
//   - Submits to different API endpoints based on role
//   - Displays feedback messages (success/error)
//   - Redirects to /login on successful registration
// - ASSUMPTIONS:
//   - Backend endpoints: /api/users/register, /api/companies/register
//   - Header component accepts header, subheader, image props
//   - /login route exists for redirect
//   - Minimal client-side validation (username/password required)
function Register() {
    // Initialize form state
    // - Stores form input values
    // - Tracks user entries for Name, Address, etc., and role selection
    // - DEFAULT: role set to "user" for private individuals
    const [formData, setFormData] = useState({
        Name: '',
        Address: '',
        City: '',
        Email: '',
        Tel: '',
        Username: '',
        Password: '',
        role: 'user' // Default to 'user'
    });

    // Initialize message state
    // - Displays feedback to user (e.g., success, error)
    // - Informs user of registration status or issues
    // - DEFAULT: Neutral prompt to register
    const [message, setMessage] = useState('Register a new account');

    // Initialize registration status
    // - Tracks whether registration succeeded
    // - Triggers redirect to /login on success
    const [isRegistered, setIsRegistered] = useState(false);

    // Handle form input changes
    // - Updates formData state when user types in inputs
    // - Keeps form fields in sync with state for submission
    // - PARAMS:
    //   - e (Event): Input change event with name and value
    const handleChange = (e) => {
        // Extract input name and value
        // - Gets field name (e.g., "Email") and entered value
        // - Allows dynamic updates to specific form fields
        const { name, value } = e.target;

        // Update formData
        // - Spreads existing formData, updates changed field
        // - Preserves other fields while updating the modified one
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    // - Processes form data and sends to backend API
    // - Registers user or company and updates UI based on response
    // - PARAMS:
    //   - e (Event): Form submit event
    // - FLOW:
    //   1. Prevent default form behavior
    //   2. Validate username/password
    //   3. Select API endpoint based on role
    //   4. Send POST request
    //   5. Handle success (message, redirect)
    //   6. Handle errors (message)
    const handleSubmit = async (e) => {
        // Prevent page reload
        // - Stops default form submission
        // - Allows custom handling with JavaScript
        e.preventDefault();

        // Validate required fields
        // - Checks if Username and Password are filled
        // - Ensures minimum data for registration
        // - NOTE: Additional validation (e.g., email format) assumed in backend
        if (!formData.Username || !formData.Password) {
            setMessage('Username and password are required');
            return;
        }

        // Determine API endpoint
        // - Selects endpoint based on role ("user" or "company")
        // - Routes data to correct backend service
        // - ENDPOINTS:
        //   - User: /api/users/register
        //   - Company: /api/companies/register
        const endpoint = formData.role === 'company'
            ? 'http://localhost:5000/api/companies/register'
            : 'http://localhost:5000/api/users/register';

        // Submit form data
        // - Sends POST request with formData
        // - Registers account in backend database
        try {
            // Make API call
            // - Posts formData to selected endpoint
            // - Creates new user or company record
            const response = await axios.post(endpoint, formData);

            // Log success
            // - Outputs response data to console
            // - Aids debugging and confirms registration
            console.log('Registration successful:', response.data);

            // Update UI
            // - Sets success message and registration flag
            // - Informs user and triggers redirect
            setMessage('Registration successful! You can now log in.');
            setIsRegistered(true);
        } catch (error) {
            // Handle errors
            // - Extracts error message from response or uses default
            // - Displays specific feedback (e.g., "Username taken")
            const errorMsg = error.response?.data?.message || 'Registration failed';

            // Log error
            // - Outputs error to console
            // - Helps diagnose issues (e.g., network, validation)
            console.error('Registration error:', errorMsg);

            // Update UI
            // - Sets error message
            // - Informs user of failure reason
            setMessage(errorMsg);
        }
    };

    // Redirect after successful registration
    // - Navigates to /login if isRegistered is true
    // - Takes user to login page to sign in with new account
    if (isRegistered) {
        return <Navigate to="/login" />;
    }

    // Render registration form
    // - Displays header, form, and feedback message
    // - Provides UI for users/companies to enter details
    // - COMPONENTS:
    //   - Header: Banner with image and text
    //   - Card: Styled form container
    //   - Form: Inputs for registration data
    return (
        <>
            {/* Header Banner */}
            {/* - Renders custom Header component */}
            {/* - Displays branding with title, subtitle, and image */}
            <div>
                <Header
                    header="Find the best for your job"
                    subheader="your local helper is near" // Typo "newr" in original, kept as-is
                    image={header1}
                />
            </div>

            {/* Spacer */}
            {/* - Empty heading for vertical spacing */}
            {/* - Adds visual separation before form */}
            <div>
                <h2 className="text-center mb-4"><br /></h2>
            </div>

            {/* Form Title */}
            {/* - Displays "Register a new account" heading */}
            {/* - Clarifies page purpose */}
            <div>
                <h2 className="text-center mb-4">{message}</h2>
            </div>

            {/* Form Container */}
            {/* - Wraps form in Bootstrap Container and Card */}
            {/* - Provides responsive, styled layout */}
            <Container className="mt-5">
                <Card className="shadow-sm p-4">
                    <Card.Body>
                        {/* Form Content */}
                        {/* - Contains form with inputs and submit button */}
                        {/* - Collects registration data */}
                        <div>
                            <form onSubmit={handleSubmit}>
                                {/* Role Selection */}
                                {/* - Radio buttons for user or company role */}
                                {/* - Determines which API endpoint to use */}
                                <h5>Role:</h5>
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="user"
                                        checked={formData.role === 'user'}
                                        onChange={handleChange}
                                    />
                                    Private
                                </label><br />
                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="company"
                                        checked={formData.role === 'company'}
                                        onChange={handleChange}
                                    />
                                    Company
                                </label>

                                {/* Spacer */}
                                <br /><br />

                                {/* Name Field */}
                                {/* - Input for full name */}
                                {/* - Collects user or company name */}
                                <h5>Name</h5>
                                <input
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                />

                                {/* Address Field */}
                                {/* - Input for street address */}
                                {/* - Stores location data */}
                                <h5>Address</h5>
                                <input
                                    name="Address"
                                    value={formData.Address}
                                    onChange={handleChange}
                                />

                                {/* City Field */}
                                {/* - Input for city */}
                                {/* - Complements address for location */}
                                <h5>City</h5>
                                <input
                                    name="City"
                                    value={formData.City}
                                    onChange={handleChange}
                                />

                                {/* Email Field */}
                                {/* - Input for email address */}
                                {/* - Used for contact and login */}
                                {/* - TYPE: email for basic validation */}
                                <h5>Email</h5>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />

                                {/* Telephone Field */}
                                {/* - Input for phone number */}
                                {/* - Provides contact option */}
                                <h5>Telephone</h5>
                                <input
                                    name="Tel"
                                    value={formData.Tel}
                                    onChange={handleChange}
                                />

                                {/* Username Field */}
                                {/* - Input for unique username */}
                                {/* - Required for login */}
                                <h5>Username</h5>
                                <input
                                    name="Username"
                                    value={formData.Username}
                                    onChange={handleChange}
                                />

                                {/* Password Field */}
                                {/* - Input for password */}
                                {/* - Required for secure login */}
                                {/* - TYPE: password to hide input */}
                                <h5>Password</h5>
                                <input
                                    type="password"
                                    name="Password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                />

                                {/* Spacer */}
                                <br /><br />

                                {/* Submit Button */}
                                {/* - Triggers form submission */}
                                {/* - Sends data to backend */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="ms-2"
                                >
                                    Register
                                </Button>
                            </form>
                        </div>
                    </Card.Body>
                </Card>
            </Container>

            {/* Spacer */}
            <div>
                <h2 className="text-center mb-4"><br /></h2>
            </div>
        </>
    );
}

export default Register;
