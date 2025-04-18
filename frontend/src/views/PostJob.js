import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import header1 from "../images/raindrops.jpg";

function PostJob() {
    const [job, setJob] = useState({
        title: "",
        description: "",
        price: "",
        timeframe: "",
        status: "Open", // Default status
    });

    const handleChange = (e) => {
        setJob({ ...job, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const token = userData.token;
        const userId = userData.id;

        if (!token || !userId) {
            alert("You must be logged in to post a job.");
            return;
        }

        const jobData = {
            title: job.title,
            description: job.description,
            price: job.price,
            timeframe: job.timeframe,
            status: job.status || "Open", // Ensure status is set
            userid: userId, // Use logged-in user's ID
        };

        console.log("Job data to be sent:", jobData); // Debugging log

        try {
            const response = await axios.post(
                "http://localhost:5000/api/jobs",
                jobData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include JWT token
                    },
                }
            );
            console.log("Server response:", response.data); // Debugging log
            alert("Job posted successfully!");

            // Reset form state
            setJob({
                title: "",
                description: "",
                price: "",
                timeframe: "",
                status: "Open",
            });
        } catch (error) {
            console.error("Error posting job:", error);
            if (error.response) {
                console.log("Error response:", error.response.data); // Log server response
                alert(`Failed to post job: ${error.response.data.error || "Unauthorized"}`);
            } else {
                alert("Failed to post job.");
            }
        }
    };

    return (
        <>
            <div>
                <Header header="Post a new job" subheader="Post new jobs" image={header1} />
            </div>
            <div>
                <br />
            </div>
            <div>
                <h2 className="text-center mb-4">Post Jobs</h2>
            </div>
            <div className="container mt-4">
                <h2>Post a Job</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Job Title</label>
                        <input
                            type="text"
                            className="form-control"
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Price (€)</label>
                        <input
                            type="number"
                            className="form-control"
                            name="price"
                            value={job.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Estimated Time Frame</label>
                        <input
                            type="text"
                            className="form-control"
                            name="timeframe"
                            value={job.timeframe}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Post Job
                    </button>
                </form>
            </div>
            <div>
                <br />
            </div>
        </>
    );
}

export default PostJob;