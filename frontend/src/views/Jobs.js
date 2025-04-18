// Bring in tools we need from React and other places
import React, { useEffect, useState } from "react"; // React helps build the page, useEffect runs code at start, useState holds data
import axios from "axios"; // Axios helps talk to the server (like getting jobs list)
import { Button, Form } from "react-bootstrap"; // Tools from Bootstrap for buttons and form input
import { useNavigate } from "react-router-dom"; // Helps move to other pages
import Header from "../components/Header"; // Top part of page (like title and picture)
import header3 from "../images/header3.jpg"; // Picture for the top of page

// This is the main part of the Jobs page
function Jobs() {
    // Variables to hold data (like a box to keep things)
    const [jobs, setJobs] = useState([]); // List of all jobs, starts empty
    const [filteredJobs, setFilteredJobs] = useState([]); // List of jobs after search filter, starts empty
    const [searchTerm, setSearchTerm] = useState(""); // What user types in search box, starts empty
    const navigate = useNavigate(); // Tool to go to other pages

    // Runs when page starts (like setup)
    useEffect(() => {
        // Get jobs from server
        axios.get("http://localhost:5000/api/jobs")
            .then((response) => { // If it works
                console.log("Jobs fetched from API:", response.data); // Show jobs in console
                setJobs(response.data); // Put jobs in the list
                setFilteredJobs(response.data); // Set filtered jobs to all jobs initially
            })
            .catch((error) => console.error("Error fetching jobs:", error)); // If problem, show error
    }, []); // Empty [] means run only once when page loads

    // Runs when search term changes to filter jobs
    useEffect(() => {
        const filtered = jobs.filter((job) => {
            const title = (job.Title || "").toLowerCase(); // Job title, lowercase, empty if missing
            const description = (job.Description || "").toLowerCase(); // Job description, lowercase, empty if missing
            const term = searchTerm.toLowerCase(); // Search term, lowercase
            return title.includes(term) || description.includes(term); // Keep job if title or description matches
        });
        setFilteredJobs(filtered); // Update filtered jobs list
    }, [searchTerm, jobs]); // Runs when searchTerm or jobs changes

    // Update search term when user types
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Set search term to what’s typed
    };

    // What the page looks like
    return (
        <div className="justify-content-center">
            <div>
                <Header header="Jobs List" subheader="Review new jobs" image={header3} /> {/* Top part with title and picture */}
            </div>
            <div>
                <br /><br /><br />
            </div>
            <div>
                <h2 className="text-center mb-4">Browse All Jobs</h2> {/* Title for jobs list */}<br />
            </div>
            <div className="container my-4">
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Search jobs by title or description..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-50 mx-auto" // Center and limit width
                        />
                    </Form.Group>
                </Form>
            </div>


            {/* If no filtered jobs, show message. If jobs, show list */}
            {filteredJobs.length === 0 ? (
                <p className="text-center">
                    {searchTerm ? "No jobs match your search." : "No jobs available."}
                </p> // Message when no jobs or no matches
            ) : (
                <div className="container d-flex justify-content-center">
                    <div className="row col-md-12">
                        {filteredJobs.map((job) => ( // Make a box for each filtered job
                            <div key={job.ID} className="col-md-12 mb-4">
                                <div className="card job-card job-box">
                                    <div className="card-body">
                                        <h4 className="card-title">{job.Title || "No Title"}</h4> {/* Job name */}
                                        <p className="text-muted">{job.Description || "No Description"}</p> {/* Job details */}
                                        <p><strong>Posted by:</strong> {job.PostedBy || "Unknown"}</p> {/* Who posted it */}
                                        <p><strong>My budget:</strong> €{job.Price || "N/A"}</p> {/* How much money */}
                                        <p><strong>Timeframe:</strong> {job.TimeFrame || "Not Specified"}</p> {/* How long */}
                                        <p><strong>Status:</strong> {(job.Status === "Accepted" && <strong>Closed</strong>) || (job.Status || "Open")}</p>
                                        <Button
                                            variant="success"  
                                            className="ms-2" // Small space from other elements
                                            onClick={() => navigate(`/job/${job.ID}`)} // Go to job details page
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div>
                            <h2 className="text-center mb-4"><br /></h2> {/* More empty space */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Send this page to be used in the app
export default Jobs;