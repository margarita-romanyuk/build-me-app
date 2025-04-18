import React, { useEffect, useState } from "react"; // React for building, useEffect runs code at start, useState keeps data
import { useParams, useNavigate } from "react-router-dom"; // useParams gets job ID from URL, useNavigate moves to other pages
import axios from "axios"; // Axios sends requests to server, like getting job info
import { Container, Card, ListGroup, Button, Modal, Form } from "react-bootstrap"; // Bootstrap tools for layout, cards, lists, buttons, pop-ups, and forms
import Header from "../components/Header"; // Custom header with title and image
import header1 from "../images/raindrops.jpg"; // Image file for the header
import { NavLink } from "react-router-dom";

// Main function for the Job Details page
function JobDetails() {
    // Set up variables to hold data we need
    const { id } = useParams(); // Get job ID from URL (like /job/5, id is 5)
    const navigate = useNavigate(); // Tool to switch to other pages
    const [job, setJob] = useState(null); // Holds job details, starts as null until loaded
    const [offers, setOffers] = useState([]); // List of offers for job, starts empty
    const [isOfferAccepted, setIsOfferAccepted] = useState(false); // Tracks if job is taken, starts false
    const [loggedInUserId, setLoggedInUserId] = useState(null); // ID of logged-in user, starts null
    const [userRole, setUserRole] = useState(""); // Role (company/user), starts empty
    const [showOfferModal, setShowOfferModal] = useState(false); // Controls new offer pop-up
    const [offer, setOffer] = useState({ price: "", description: "", etf: "" }); // New offer data
    const [showReviewModal, setShowReviewModal] = useState(false); // Controls review pop-up
    const [review, setReview] = useState({ rating: "", comment: "" }); // Review data
    const [selectedCompanyId, setSelectedCompanyId] = useState(null); // Company ID for review
    const [showEditModal, setShowEditModal] = useState(false); // Controls edit job pop-up
    const [editJob, setEditJob] = useState({ title: "", description: "", price: "", timeframe: "" }); // Edit job data
    const [showEditOfferModal, setShowEditOfferModal] = useState(false); // Controls edit offer pop-up
    const [editOffer, setEditOffer] = useState({ id: null, price: "", description: "", etf: "" }); // Edit offer data

    // Runs when page loads or job ID changes
    useEffect(() => {
        // Get user info from browser storage
        // - Loads user data (ID, role, token) from localStorage
        // - Needed to check permissions, authenticate requests, and personalize UI
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData.id;
        const role = userData.role || "";
        console.log("Logged-in User ID:", userId, "Role:", role); // Debug: confirm user data
        setLoggedInUserId(userId);
        setUserRole(role.toLowerCase());

        // Fetch job details from server
        // - Gets job data for display and pre-fills edit form
        // - Populates UI with job info (title, price, etc.)
        axios.get(`http://localhost:5000/api/jobs/${id}`)
            .then((response) => {
                console.log("Job Data:", response.data); // Debug: log job data
                setJob(response.data);
                setEditJob({
                    title: response.data.Title,
                    description: response.data.Description,
                    price: response.data.Price,
                    timeframe: response.data.TimeFrame,
                });
                if (response.data.Status === "Accepted" || response.data.Status === "Closed") {
                    setIsOfferAccepted(true); // Mark job as unavailable
                }
            })
            .catch((error) => console.error("Error fetching job details:", error));

        // Fetch offers for this job
        // - Gets list of offers to display
        // - Shows all current offers for the job
        axios.get(`http://localhost:5000/api/offers/${id}`)
            .then((response) => {
                console.log("Offers Data:", response.data);
                setOffers(response.data);
            })
            .catch((error) => console.error("Error fetching offers:", error));
    }, [id]); // Re-run if job ID changes

    // Check if the current company has already made an offer
    // - Looks for an offer where CompanyID matches loggedInUserId
    // - Used to disable "Make Offer" button if company already offered
    const hasExistingOffer = offers.some(
        (offer) => String(offer.CompanyID) === String(loggedInUserId)
    );

    // Permission checks
    // - Determines if the user is the job owner (user role and ID match)
    // - Restricts edit/delete/accept/review actions to job owner
    const isOwner = userRole === "user" && String(loggedInUserId) === String(job?.UserID);
    //This line below defines a boolean (true/false) variable called canEditOrDelete. 
    // It decides whether the current user can edit or delete a job. 
    // The decision is based on three conditions, all of which must be true for canEditOrDelete to be true.
    // As a precaution I'm using optional chaining (?.)
    const canEditOrDelete = isOwner && job?.Status !== "Accepted" && job?.Status !== "Closed";

    // Function to accept a company’s offer for a job
    // - Called from JobDetails.js when user clicks "Accept Offer" button
    // - Marks an offer as accepted, updates job status to "Accepted", and assigns the hired company
    // - Allows job owners to confirm a contractor, triggering backend updates and UI changes
    //   - companyId (string): ID of the company whose offer is being accepted
    //   - Button is hidden for userRole === "company" in UI 
    //   - Backend validates user ownership and permissions
    //   - JWT token exists in localStorage for authentication
    //   - setJob and setIsOfferAccepted are React state setters from useState
    const handleAcceptOffer = (companyId) => {
        // Retrieve user data and token from localStorage
        // Gets JWT token for API authentication
        // Required for secure PUT request to backend
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;

        // Make API call to accept offer
        // - Sending PUT request to /api/jobs/:id/accept with companyId
        // - Updates job status and hired company in backend database
        // - ENDPOINT: http://localhost:5000/api/jobs/:id/accept
        // - PAYLOAD: { companyId }
        // - HEADERS: Authorization with Bearer token
        axios.put(
            `http://localhost:5000/api/jobs/${id}/accept`,
            { companyId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        ).then((response) => {
            // Handle successful response
            // - Shows success message from backend in popup and updates UI state
            alert(response.data.message); // e.g., "Offer accepted successfully"

            // Update job state
            // - Sets job.Status to "Accepted" and job.HiredCompID to companyId
            // - Updates UI to reflect new job status and hired company
            setJob((prevJob) => ({
                ...prevJob,
                Status: "Accepted",
                HiredCompID: companyId,
            }));

            // Mark offer as accepted
            // - Sets isOfferAccepted to true
            // - Disables further offer actions (e.g., hides "Accept Offer" button)
            setIsOfferAccepted(true);
        })
            .catch((error) => {
                // Handle API errors
                // - Logs error to console
                console.error("Error accepting offer:", error);
            });
    };

    // Modal (popup) controls for new offer
    const handleShowOfferModal = () => setShowOfferModal(true);
    const handleCloseOfferModal = () => {
        setShowOfferModal(false);
        setOffer({ price: "", description: "", etf: "" });
    };
    const handleOfferChange = (e) => setOffer({ ...offer, [e.target.name]: e.target.value });

    // Submit new offer to server
    // - Validates and sends a new offer to the server, updates UI
    // - Core action for companies to bid on a job
    async function handleSubmitOffer() {
        // Validate form inputs
        // - Checks if price, description, and ETF are filled
        // - Prevents invalid submissions, improves UX
        if (!offer.price || !offer.description || !offer.etf) {
            alert("Please enter price, description, and estimated time frame.");
            return;
        }

        // Get user data for authentication
        // - Retrieves company ID and token from localStorage
        // - Needed to identify the offerer and secure the request
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const companyId = userData.id;
        const token = userData.token;

        // Verify user is a company
        // - Ensures only companies can submit offers
        // - Prevents users or others from making offers
        if (userRole !== "company") {
            alert("Only companies can submit offers.");
            return;
        }

        // Verify token
        // - Checks for a valid token
        // - Ensures authenticated request
        if (!token) {
            alert("You must be logged in to submit an offer.");
            return;
        }

        // Prepare offer data
        // - Creates an object with offer details
        // - Formats data for the server’s expected structure
        const offerData = {
            JobID: id,
            CompanyID: companyId,
            Price: offer.price,
            Description: offer.description,
            ETF: offer.etf
        };

        //Here we using async/await for POST, and .then/.catch for GET method
        //async/await ensures the offer is submitted before moving on, becouse everything further depends on successful POST
        //.then/.catch starts and handles GET request independently, and it doesn't block popup closing or completing the function
        //  - ".then" updates the offers if GETing is successful
        //  - "catch" providing feedback if GET fails
        try {
            // Submit offer
            // - Sends POST request to create offer
            // - Saves the offer in the database
            const response = await axios.post(
                "http://localhost:5000/api/offers",
                offerData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Offer submitted:", response.data); // Debug: confirm submission
            alert("Offer submitted successfully!"); // Notify user

            // Close modal (popup) immediately
            // - Hides modal and resets form
            // - Fast user experiance, no need to wait for GET
            handleCloseOfferModal();

            // Refresh offers list
            // - Fetches updated offers in the background
            // - Ensures UI shows new offer without delaying modal close
            axios.get(`http://localhost:5000/api/offers/${id}`)
                .then((res) => {
                    setOffers(res.data); // Update UI
                })
                .catch((err) => {
                    console.error("Error refreshing offers:", err);  //Dubiging...
                    alert("Failed to refresh offers list. Please reload the page.");  // Notify user of failed getting data
                });
        } catch (error) {
            // Handle POST errors
            // - Logs and alerts server or network errors
            // - Informs user and dev of submission failure
            console.error("Error submitting offer:", error);  //debuging...
            alert(error.response?.data?.error || "Failed to submit offer. Please try again."); //Notify user of failed submitting
        }
    }

    // Modal (popup) form and controls for editing an offer
    const handleShowEditOfferModal = (offer) => { // Accepting the object (offer)
        setEditOffer({                            // and store values in the variable
            id: offer.ID,
            price: offer.Price,
            description: offer.Description,
            etf: offer.ETF
        });
        setShowEditOfferModal(true);            //-open the modal window.
    };
    const handleCloseEditOfferModal = () => {
        setShowEditOfferModal(false);          // Closes the popup
        setEditOffer({ id: null, price: "", description: "", etf: "" });  // reset form values
    };
    const handleEditOfferChange = (e) => setEditOffer({ ...editOffer, [e.target.name]: e.target.value }); // Reads from the input field that triggered the event with each keypress

    // Submit edited offer to server
    // - Updates an existing offer with new details
    // - Allows companies to modify their bids
    const handleSubmitEditOffer = async () => {
        // Validate inputs
        // - Ensures all fields are filled
        // - Prevents invalid updates
        if (!editOffer.price || !editOffer.description || !editOffer.etf) {
            alert("Please enter price, description, and estimated time frame.");
            return;
        }

        // Get user data
        // - Retrieves token for authentication
        // - Needed for secure request
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;

        // Verify user is a company
        // - Ensures only companies can edit offers
        // - Prevents users or others from editing offers
        if (userRole !== "company") {
            alert("Only companies can edit offers.");
            return;
        }

        // Check token
        // - Validates user is logged in
        // - Prevents unauthorized requests
        if (!token) {
            alert("You must be logged in to update an offer.");
            return;
        }

        try {
            // Update offer
            // - Sends PUT request to modify offer
            // - Saves new details in database
            const response = await axios.put(
                `http://localhost:5000/api/offers/${editOffer.id}`,
                {
                    Price: editOffer.price,
                    Description: editOffer.description,
                    ETF: editOffer.etf
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Offer updated:", response.data); // Debug: confirm update
            alert("Offer updated successfully!");

            // Update UI
            // - Updates offers state with new data
            setOffers((prevOffers) =>
                prevOffers.map((o) =>
                    o.ID === editOffer.id
                        ? { ...o, Price: editOffer.price, Description: editOffer.description, ETF: editOffer.etf }
                        : o
                )
            );

            // Close modal
            // - Hides edit modal
            // - Completes the action and close the popup
            handleCloseEditOfferModal();
        } catch (error) {
            // Handle errors (e.g., 403 Forbidden)
            // - Logs detailed error and alerts user
            // - Helps diagnose permission issues
            console.error("Error updating offer:", error);
            const errorMessage = error.response?.data?.error || "Failed to update offer. Check permissions or try again.";
            alert(errorMessage);
            // Keep modal open for user to retry
        }
    };

    // Delete an offer
    // - Removes an offer from the job
    // - Allows companies to cancel their offer
    const handleDeleteOffer = (offerId) => {
        // Verify user is a company
        // - Ensures only companies can delete offers
        // - Prevents users or others from deleting offers
        if (userRole !== "company") {
            alert("Only companies can delete offers.");
            return;
        }

        if (window.confirm("Are you sure you want to delete this offer?")) {
            const userData = JSON.parse(localStorage.getItem("user") || "{}");
            const token = userData.token;
            axios.delete(`http://localhost:5000/api/offers/${offerId}`, { headers: { Authorization: `Bearer ${token}` } })
                .then((response) => {
                    alert(response.data.message);
                    setOffers((prevOffers) => prevOffers.filter((o) => o.ID !== offerId));
                })
                .catch((error) => {
                    console.error("Error deleting offer:", error);
                    alert(error.response?.data?.error || "Failed to delete offer.");
                });
        }
    };

    // Modal (popup) controls for review
    // Opens the review modal and sets the company id that is being reviewed
    const handleShowReviewModal = (companyId) => {
        // companyId: ID of the company whose offer was accepted, passed when "Leave a Review" is clicked
        setSelectedCompanyId(companyId); // Store company ID to associate review with the correct company
        setShowReviewModal(true); // Show the review modal (popup) to allow user to enter rating and comment
        // Note: Modal UI is defined in the render section, using Bootstrap Modal component
    };

    // Closes the review modal and resets form data
    const handleCloseReviewModal = () => {
        setShowReviewModal(false); // Hide the review modal
        setReview({ rating: "", comment: "" }); // Reset review form to empty values for next use
        setSelectedCompanyId(null); // Clear company ID to prevent stale data
        // This ensures the modal starts fresh if reopened, avoiding leftover inputs
    };

    // Handles changes to review form inputs
    const handleReviewChange = (e) => {
        // e: Event object from form input (e.g., rating number input or comment textarea)
        // Uses computed property to update specific field (rating or comment) in review state
        setReview({ ...review, [e.target.name]: e.target.value });
        // Spread operator (...review) preserves other fields to avoid overwriting
    };

    // Submit review
    // Saves a review for the hired company to the backend using API
    // Allows job owner to rate and comment on the company after accepting their offer
    const handleSubmitReview = () => {
        // Step 1: Verify user role
        // Only job owners (role = "user") can submit reviews to prevent companies from reviewing themselves
        if (userRole !== "user") {
            alert("Only the job owner can submit reviews."); // Notify user of permission error. Probably not needed because we using conditional rendering for hiding or disabling the buttons
            return; // Exit function to block submission
        }

        // Step 2: Validate rating input
        // Rating is required (1-5), comment is optional
        if (!review.rating) {
            alert("Please provide a rating."); // Prompt user to fill required field
            return; // Exit function to prevent invalid submission
        }
        
        // Step 3: Retrieve user authentication data
        // Get user data from localStorage, stored during login
        const userData = JSON.parse(localStorage.getItem("user") || "{}"); // Parse user object, default to {} if missing
        const token = userData.token; // Extract JWT token for API authentication
        // Note: Token is required for secure POST request 

        // Step 4: Prepare review data for backend
        // Create object matching backend's expected schema for /api/reviews endpoint
        const reviewData = {
            JobID: id, // Associate review with current job (from URL param)
            CompanyID: selectedCompanyId, // Associate with company being reviewed (set in handleShowReviewModal)
            UserID: userData.id, // Associate with logged-in user (job owner)
            Rating: parseInt(review.rating), // Convert rating to integer (e.g., "5" -> 5) for backend
            Comment: review.comment // Include optional comment, may be empty string
        };

        // Step 5: Send review to backend
        // POST request to save review in database, with token for authentication
        axios.post("http://localhost:5000/api/reviews", reviewData, {
            headers: { Authorization: `Bearer ${token}` } // Include token in Authorization header
        })
            .then((response) => {
                // Step 6: Handle successful response
                console.log("Review submitted:", response.data); // Log response for debugging 
                alert("Review submitted successfully!"); // Notify user of success

                // Step 7: Update job state in the UI
                // Add review data to job object to display rating/comment immediately without refresh
                setJob((prevJob) => ({
                    ...prevJob,
                    Rating: reviewData.Rating, // Update job with new rating
                    Comment: reviewData.Comment // Update job with new comment
                }));

                // Step 8: Close modal
                handleCloseReviewModal(); // Hide modal and reset form (clears rating, comment, company ID)

                // Step 9: Refresh job data
                // Fetch updated job details to ensure UI reflects latest backend state
                axios.get(`http://localhost:5000/api/jobs/${id}`)
                    .then((res) => {
                        setJob(res.data); // Replace job state with fresh data
                        // This ensures UI shows any backend changes (e.g., updated Status)
                    });
                // Note: No .catch here for GET; errors are logged in outer .catch
            })
            .catch((error) => {
                // Step 10: Handle errors
                console.error("Error submitting review:", error); // Log error for debugging
                // Possible errors: 401 (invalid token), 400 (bad data), 500 (server issue)
                // No alert to avoid overwhelming user; error is logged for dev inspection
                // Modal stays open, allowing user to retry if needed
            });
    };

    // Modal (popup) form and controls for editing job
    const handleShowEditModal = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);
    const handleEditChange = (e) => setEditJob({ ...editJob, [e.target.name]: e.target.value });

    // Submit edited job
    // - Updates job details
    // - Allows job owner to modify their job
    const handleSubmitEdit = async () => {
        // Verify user role
        // - Ensures only users (job owners) can edit jobs
        // - Prevents companies from editing jobs
        if (userRole !== "user") {
            alert("Only the job owner can edit jobs.");
            return;
        }

        // Debug job data
        console.log("Editing Job:", { job, jobId: id, editJob });

        // Validate job
        // - Checks if job exists and matches ID
        // - Prevents requests for invalid jobs
        if (!job || String(job.ID) !== String(id)) {
            alert("Job not found. Please refresh the page.");
            return;
        }

        // Validate inputs
        // - Ensures all fields are filled
        // - Prevents invalid submissions
        if (!editJob.title || !editJob.description || !editJob.price || !editJob.timeframe) {
            alert("Please fill in all fields.");
            return;
        }

        // Get user data
        // - Retrieves token for authentication
        // - Needed for secure request
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;

        // Verify token
        // - Checks for valid token
        // - Ensures authenticated request
        if (!token) {
            alert("You must be logged in to edit a job.");
            return;
        }

        try {
            // Update job
            // - Sends PUT request to modify job
            // - Saves new details in database
            console.log("Sending PUT request:", {
                url: `http://localhost:5000/api/jobs/${id}`,
                data: {
                    title: editJob.title,
                    description: editJob.description,
                    price: editJob.price,
                    timeframe: editJob.timeframe,
                },
            });
            const response = await axios.put(
                `http://localhost:5000/api/jobs/${id}`,
                {
                    title: editJob.title,
                    description: editJob.description,
                    price: editJob.price,
                    timeframe: editJob.timeframe,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Job updated:", response.data); // Debug: confirm update
            alert(response.data.message || "Job updated successfully!");

            // Update UI
            // - Updates job state with new data
            setJob((prevJob) => ({
                ...prevJob,
                Title: editJob.title,
                Description: editJob.description,
                Price: editJob.price,
                TimeFrame: editJob.timeframe,
            }));

            // Close modal
            // - Hides edit modal
            handleCloseEditModal();
        } catch (error) {
            // Handle errors
            // - Logs and alerts specific errors (404, 403, etc.)
            console.error("Error updating job:", error);
            const errorMessage =
                error.response?.status === 404
                    ? "Job not found. Please verify the job ID and try again."
                    : error.response?.status === 403
                        ? "You are not authorized to edit this job."
                        : error.response?.data?.error || "Failed to update job. Please try again.";
            alert(errorMessage);
        }
    };

    // Delete job
    // - Removes the job
    // - Allows job owner to delete their job
    const handleDeleteJob = async () => {
        // Verify user role
        // - Ensures only users (job owners) can delete jobs
        // - Prevents companies from deleting jobs
        if (userRole !== "user") {
            alert("Only the job owner can delete jobs.");
            return;
        }

        // Debug job data
        console.log("Deleting Job:", { job, jobId: id });

        // Validate job
        // - Checks if job exists and matches ID
        // - Prevents requests for invalid jobs
        if (!job || String(job.ID) !== String(id)) {
            alert("Job not found. Please refresh the page.");
            return;
        }

        // Confirm deletion
        // - Asks user to confirm deletion
        // - Prevents accidental deletes
        if (!window.confirm("Are you sure you want to delete this job?")) {
            return;
        }

        // Get user data
        // - Retrieves token for authentication
        // - Needed for secure request
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;

        // Verify token
        // - Checks for valid token
        // - Ensures authenticated request
        if (!token) {
            alert("You must be logged in to delete a job.");
            return;
        }

        try {
            // Delete job
            // - Sends DELETE request to remove job
            // - Removes job and associated offers from database
            console.log("Sending DELETE request:", { url: `http://localhost:5000/api/jobs/${id}` });
            const response = await axios.delete(
                `http://localhost:5000/api/jobs/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Job deleted:", response.data); // Debug: confirm deletion
            alert(response.data.message || "Job deleted successfully!");

            // Redirect
            // - Moves to jobs list
            navigate("/jobs");
        } catch (error) {
            // Handle errors
            // - Logs and alerts specific errors (404, 403, etc.)
            console.error("Error deleting job:", error);
            const errorMessage =
                error.response?.status === 404
                    ? "Job not found. Please verify the job ID and try again."
                    : error.response?.status === 403
                        ? "You are not authorized to delete this job."
                        : error.response?.data?.error || "Failed to delete job. Please try again.";
            alert(errorMessage);
        }
    };

    // Star rating component
    // - Displays a visual star rating
    // - Shows review rating in UI
    const StarRating = ({ rating }) => {
        const totalStars = 5;
        return (
            <span>
                {[...Array(totalStars)].map((_, index) => (
                    <span key={index} style={{ color: index < rating ? "#ffc107" : "#d3d3d3", fontSize: "1.2em" }}>★</span>
                ))}
            </span>
        );
    };

    // Show loading state
    if (!job) return <p>Loading...</p>;

    // Render UI
    return (
        <>
            <Header header="Great offers for the job" subheader="Review companies" image={header1} />
            <h2 className="text-center mb-4"><br /></h2>
            <h2 className="text-center mb-4">Check the offers</h2>

            {/**** JOB DETAILS ****/}
            <Container className="mt-5">
                <Card className="shadow-sm p-4 job-box">
                    <Card.Body>
                        <Card.Title>{job.Title}</Card.Title><br />
                        <p><strong>Posted By:</strong> {job.PostedBy}</p>
                        <p><strong>Job description:</strong> <br />{job.Description || "No Description"}</p>
                        <p><strong>Budget:</strong> €{job.Price}</p>
                        <p><strong>Timeframe:</strong> {job.TimeFrame}</p>
                        <p><strong>Status:</strong> {job.Status === "Accepted" ? "Closed" : job.Status || "Open"}</p>

                        {userRole === "company" && !isOfferAccepted && (// Disable if company already made an offer
                            <Button variant="success" className="mt-2" onClick={handleShowOfferModal} disabled={hasExistingOffer} >
                                Make Offer
                            </Button>
                        )}
                        {userRole === "company" && isOfferAccepted && (
                            <p className="text-danger mt-2"><strong>This job is no longer available for offers!</strong></p>
                        )}
                        {canEditOrDelete && (
                            <div className="mt-2">
                                <Button variant="warning" className="me-2" onClick={handleShowEditModal}>
                                    Edit Job
                                </Button>
                                <Button variant="danger" onClick={handleDeleteJob}>
                                    Delete Job
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>

                <h3 className="mt-4">Offers</h3>
                {offers.length === 0 ? (
                    <p>No offers yet.</p>
                ) : (
                    <ListGroup> {/* Displays all offers for the job with details and actions */}
                        {offers.map((offer) => {
                            // Check if this offer is accepted
                            // - Compares job.HiredCompID with offer.CompanyID
                            // - Marks the accepted offer with a green "Accepted" label
                            const isAccepted = isOfferAccepted && job.HiredCompID === offer.CompanyID;

                            // Check if logged-in user owns this offer
                            // - Verifies userRole is "company" and loggedInUserId matches offer.CompanyID
                            // - Enables "Edit/Delete Offer" buttons for the company that submitted the offer
                            const isOfferOwner =
                                userRole === "company" && String(loggedInUserId) === String(offer.CompanyID);

                            return (
                                // Offer Item
                                // - Renders a single offer’s details and actions
                                // - Provides a clear view of each offer’s info and relevant controls
                                // - KEY: Uses offer.ID to ensure unique keys for React list rendering
                                <ListGroup.Item key={offer.ID}>
                                    {/* Offer Details */}
                                    {/* - Shows company name, price, timeframe, and description */}
                                    {/* - Gives users key info to evaluate the offer */}
                                    <strong>Company:</strong> {offer.CompanyName || "Unknown"} <br />
                                    <strong>Offered Price:</strong> €{offer.Price} <br />
                                    <strong>Timeframe:</strong> {offer.ETF} <br />
                                    <strong>Description:</strong> {offer.Description} <br />

                                    {/* Accepted Status */}
                                    {/* - Displays green "Accepted" label if offer is accepted */}
                                    {/* - Visually confirms which offer was chosen */}
                                    {isAccepted && (
                                        <p className="text-success mt-2">
                                            <strong>Accepted</strong>
                                        </p>
                                    )}

                                    {/* Accept Offer Button */}
                                    {/* - Shows "Accept Offer" for job owners if offer isn’t accepted */}
                                    {/* - Allows users to select this company’s offer */}
                                    {/* - DISABLED: When isOfferAccepted is true (prevents multiple accepts) */}
                                    {!isAccepted && isOwner && (
                                        <Button variant="success" className="mt-2 me-2" onClick={() => handleAcceptOffer(offer.CompanyID)} disabled={isOfferAccepted} >
                                            Accept Offer
                                        </Button>
                                    )}

                                    {/* Leave a Review Button */}
                                    {/* - Shows "Leave a Review" for owners post-acceptance, pre-review */}
                                    {/* - Prompts users to rate the hired company after acceptance */}
                                    {/* - CONDITION: isAccepted (offer accepted), isOwner (job owner), !job.Rating (no review yet) */}
                                    {isAccepted && isOwner && !job.Rating && (
                                        <Button variant="info" className="mt-2" onClick={() => handleShowReviewModal(offer.CompanyID)} >
                                            Leave a Review
                                        </Button>
                                    )}

                                    {/* Review Display */}
                                    {/* - Shows star rating and comment if job has been reviewed */}
                                    {/* - Displays user feedback for transparency */}
                                    {/* - CONDITION: isAccepted (offer accepted), job.Rating exists */}
                                    {isAccepted && job.Rating && (
                                        <p className="mt-2">
                                            <strong>User Review:</strong>{" "}
                                            <StarRating rating={job.Rating} />
                                            <br />
                                            {job.Comment && <span>"{job.Comment}"</span>}
                                        </p>
                                    )}

                                    {/* Edit/Delete Offer Buttons */}
                                    {/* - Shows "Edit Offer" and "Delete Offer" for offer owners if not accepted */}
                                    {/* - Allows companies to modify or remove their offer before acceptance */}
                                    {/* - CONDITION: !isAccepted (offer not accepted), isOfferOwner (company owns offer) */}
                                    {!isAccepted && isOfferOwner && (
                                        <div className="mt-2">
                                            <Button variant="warning" className="me-2" onClick={() => handleShowEditOfferModal(offer)} >
                                                Edit Offer
                                            </Button>
                                            <Button variant="danger" onClick={() => handleDeleteOffer(offer.ID)} >
                                                Delete Offer
                                            </Button>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                )}
                <br />
                <NavLink className="nav-link" to="/jobs">
                    <Button variant="success"> 🔙 Back to jobs </Button>
                </NavLink>

                {/* POPUP FOR OFFERS */}
                <Modal show={showOfferModal} onHide={handleCloseOfferModal} centered>
                    <Modal.Header closeButton><Modal.Title>Make an Offer</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p><strong>Job:</strong> {job?.Title}</p>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Offer Price (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={offer.price}
                                    onChange={handleOfferChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Estimated Time Frame</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="etf"
                                    value={offer.etf}
                                    onChange={handleOfferChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Offer Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={offer.description}
                                    onChange={handleOfferChange}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseOfferModal}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitOffer}>Submit Offer</Button>
                    </Modal.Footer>
                </Modal>

                {/* POPUP FOR EDITING OFFERS */}
                <Modal show={showEditOfferModal} onHide={handleCloseEditOfferModal} centered>
                    <Modal.Header closeButton><Modal.Title>Edit Offer</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <p><strong>Job:</strong> {job?.Title}</p>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Offer Price (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={editOffer.price}
                                    onChange={handleEditOfferChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Estimated Time Frame</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="etf"
                                    value={editOffer.etf}
                                    onChange={handleEditOfferChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Offer Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editOffer.description}
                                    onChange={handleEditOfferChange}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditOfferModal}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitEditOffer}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>

                {/* POPUP FOR REVIEWS */}
                <Modal show={showReviewModal} onHide={handleCloseReviewModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Review {offers.find(o => o.CompanyID === selectedCompanyId)?.CompanyName || "Company"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Rating (1-5)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="rating"
                                    value={review.rating}
                                    onChange={handleReviewChange}
                                    min="1"
                                    max="5"
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Comment (Optional)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="comment"
                                    value={review.comment}
                                    onChange={handleReviewChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReviewModal}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitReview}>Submit Review</Button>
                    </Modal.Footer>
                </Modal>

                {/* POPUP FOR EDITING JOB */}
                <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
                    <Modal.Header closeButton><Modal.Title>Edit Job</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={editJob.title}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editJob.description}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={editJob.price}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Timeframe</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="timeframe"
                                    value={editJob.timeframe}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditModal}>Cancel</Button>
                        <Button variant="primary" onClick={handleSubmitEdit}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
            <h2 className="text-center mb-4"><br /></h2>
        </>
    );
}

export default JobDetails;

// React & Async/Await Tutorials:
// Using Promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// Asinc functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// async/await vs .then/.catch:  https://stackoverflow.com/questions/54495711/async-await-vs-then-which-is-the-best-for-performance
// using async await and .then together: https://stackoverflow.com/questions/55019621/using-async-await-and-then-together
// Optional chaining (?.): https://upmostly.com/tutorials/optional-chaining-in-react
// https://dev.to/kachidk/avoid-unnecessary-errors-when-conditionally-rendering-in-react-with-optional-chaining-2ol7
// Ternary: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator