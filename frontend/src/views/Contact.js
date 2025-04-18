// Import necessary tools and libraries
import React, { useState } from "react"; // React for building UI, useState for managing form state
import { Form, Button } from "react-bootstrap"; // Bootstrap components for form and button styling
import header4 from "../images/header4.jpg"; // Background image for the header
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS for consistent styling across components
import Header from "../components/Header"; // Custom Header component for page title and image

// Main component for the Contact page
function Contact() {
    // Initialize form state with useState to track user input
    const [contactForm, setContactForm] = useState({
        name: "", // User's name, starts empty
        email: "", // User's email, starts empty
        message: "", // User's message, starts empty
    });
    // State to control whether the submit button is disabled
    const [isButtonOff, setIsButtonOff] = useState(false); // Starts as false (button enabled)

    // inputChange: Handles updates to form fields when the user types
    const inputChange = (e) => {
        const name = e.target.name; // Get the name of the field (e.g., "name", "email", "message")
        const value = e.target.value; // Get the value typed by the user
        setContactForm({ ...contactForm, [name]: value }); // Update the form state, keeping other fields unchanged
        // Spread operator (...contactForm) preserves existing values, [name]: value updates the specific field
    };

    // onSubmit: Handles form submission by sending data to web3forms API
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission (page reload)

        const formData = new FormData(event.target); // Create FormData object from the form element
        formData.append("access_key", "58c05821-c116-45bd-a667-54f4c4087f2d"); // Add web3forms access key for authentication
        formData.append("replyto", contactForm.email); // Set Reply-To header to sender’s email for admin’s email
        formData.append("subject", "New Contact Form Submission"); // Optional: Set subject for admin email
        formData.append("from_name", "Your Website"); // Optional: Set sender name for admin email

        const object = Object.fromEntries(formData); // Convert FormData to a plain object
        const json = JSON.stringify(object); // Convert the object to JSON string for the API request

        // Send the form data to web3forms API
        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST", // Use POST method to submit data
            headers: {
                "Content-Type": "application/json", // Tell the server we’re sending JSON
                Accept: "application/json", // Expect JSON response from the server
            },
            body: json, // Send the JSON string as the request body
        }).then((res) => res.json()); // Parse the response as JSON

        // Check if the submission was successful
        if (res.success) {
            console.log("Success", res); // Log success response for debugging
            alert("Thank you for contacting us! A confirmation has been sent to your email."); // Show success message to user
            turnOffButton(); // Call function to reset form and disable button
        } else {
            console.error("Submission failed:", res); // Log failure for debugging
            alert("Failed to send message. Please try again."); // Notify user of failure
        }
    };

    // turnOffButton: Resets the form and disables the submit button after successful submission
    const turnOffButton = () => {
        setIsButtonOff(true); // Disable the submit button
        setContactForm({ name: "", email: "", message: "" }); // Clear all form fields
        // This prevents multiple submissions and gives visual feedback
    };

    // Render: Defines the UI structure of the Contact page
    return (
        <> {/* Fragment shorthand to wrap multiple elements without extra DOM node */}
            {/* Header section */}
            <div>
                <Header
                    header="Find the best for your job" // Main title
                    subheader="Your local helper is near" // Subtitle (typo: likely meant "near")
                    image={header4} // Background image
                /> {/* Custom header component */}
            </div>
            {/* Main content container */}
            <div className="container mt-5"> {/* Bootstrap container with top margin */}
                <h2 className="text-center mb-4">Contact Us</h2> {/* Centered page title with bottom margin */}
                <div className="row"> {/* Bootstrap row for two-column layout */}
                    {/* Left Column: Contact Form */}
                    <div className="col-md-6"> {/* Takes half the width on medium+ screens */}
                        <div className="card shadow-sm p-4 mb-5"> {/* Card with shadow, padding, and bottom margin */}
                            <Form onSubmit={onSubmit}> {/* Form element tied to onSubmit handler */}
                                <Form.Group className="mb-3"> {/* Group with bottom margin */}
                                    <Form.Label>Name</Form.Label> {/* Label for the input */}
                                    <Form.Control
                                        type="text" // Text input field
                                        name="name" // Matches state key for inputChange
                                        placeholder="Enter your name" // Placeholder text
                                        value={contactForm.name} // Controlled by state
                                        onChange={inputChange} // Update state on typing
                                        required // Field must be filled
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email" // Email input with validation
                                        name="email" // Must match "email" for Web3Forms autoresponder
                                        placeholder="Enter your email"
                                        value={contactForm.email}
                                        onChange={inputChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Message</Form.Label>
                                    <Form.Control
                                        as="textarea" // Renders as a textarea
                                        rows={4} // 4 lines tall
                                        name="message"
                                        placeholder="Write your message"
                                        value={contactForm.message}
                                        onChange={inputChange}
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary" // Blue Bootstrap style
                                    type="submit" // Triggers form submission
                                    className="w-100" // Full width
                                    disabled={isButtonOff} // Disabled after submission
                                >
                                    Send Message {/* Button text */}
                                </Button>
                            </Form>
                        </div>
                    </div>

                    {/* Right Column: Google Maps */}
                    <div className="col-md-6 text-center justify-content-center container-fluid flex-column align-items-center">
                        {/* Takes half width, centers content */}
                        <div className="card"> {/* Card to wrap the map */}
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d19053.309923632132!2d-6.264156416953057!3d53.34927527530851!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48670e8439f94cbf%3A0x77f333af4d56c4a6!2sDublin%20Portal!5e0!3m2!1shr!2sus!4v1744033351963!5m2!1shr!2sus"
                                title="Google Map" // Accessibility title
                                width="120%" // Slightly wider than container for effect
                                height="500" // Fixed height
                                style={{ border: 0, borderRadius: "8px" }} // No border, rounded corners
                                allowFullScreen="" // Allow full-screen mode
                                loading="lazy" // Load lazily for performance
                                referrerPolicy="no-referrer-when-downgrade" // Security setting
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;