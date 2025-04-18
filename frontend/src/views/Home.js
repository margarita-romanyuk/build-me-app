// Import tools for building the page and navigation
import React from "react"; // React for building the UI
import { useNavigate } from "react-router-dom"; // useNavigate for programmatic navigation
import header5 from "../images/header5.jpg"; // Picture for the top of page
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles for layout and components
import Header from "../components/Header"; // Custom header component
import { Button } from "react-bootstrap"; // Bootstrap components for layout and buttons
import Weather from "../components/Weather";

// Home component for the landing page
function Home() {
    const navigate = useNavigate(); // Hook for navigation

    // Handle button click for debugging
    // - WHAT: Navigates to /jobs and logs click
    // - WHY: Confirms button is clickable and navigation is attempted
    const handleBrowseJobs = () => {
        console.log("Browse The Jobs button clicked"); // Debug: confirm click
        navigate("/jobs"); // Navigate to jobs page
    };

    return (
        <>
            {/* Header Section */}
            <div>
                <Header
                    header="Find the best for your job"
                    subheader="Your trusted local platform for renovation and construction"
                    image={header5}
                />
            </div>

            {/* What We Offer Section */}
            <div className="what-we-do justify-content-center container-fluid">
                <h3 className="mb-4 text-center">Reliable connections for any project</h3>
                <div className="row g-6 justify-content-center">
                    <div className="col-12 col-sm-6">
                        <div className="d-flex flex-column align-items-center text-center p-3 box">
                            <h5>What We Offer</h5>
                            <p>
                                "Build Me..." is your go-to solution for finding reliable and skilled construction
                                companies and contractors in your area. Whether you need to renovate your kitchen,
                                upgrade your bathroom, or build something from the ground up — our platform helps you
                                find professionals who are ready to take on your task. We connect real people with
                                trusted local experts, offering transparency, convenience, and speed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us & How It Works Section */}
            <div className="container-fluid px-4">
                <div className="row g-4">
                    <div className="col-lg-6 area-1">
                        <div className="text-container d-flex justify-content-center align-items-center h-100"></div>
                    </div>

                    <div className="col-lg-6 bg">
                        <div className="text-container d-flex flex-column justify-content-center align-items-center text-left h-100">
                            <h5 className="mb-3">Why Choose Us?</h5>
                            <ul>
                                <li>
                                    <strong>Post Your Job Easily:</strong> Describe your task in a few clicks and receive
                                    offers quickly from companies ready to help.
                                </li>
                                <li>
                                    <strong>Compare Offers:</strong> View proposals, estimated prices, and timeframes from
                                    different contractors, all in one place.
                                </li>
                                <li>
                                    <strong>Read Real Reviews:</strong> See feedback from other users before making your
                                    decision — honest, helpful, and verified.
                                </li>
                                <li>
                                    <strong>Transparent Profiles:</strong> Browse company profiles, past work, and ratings
                                    to choose the one that best fits your needs.
                                </li>
                                <li>
                                    <strong>Free and Secure:</strong> Our platform is completely free for users and
                                    provides a safe environment for communication and deals.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="row g-4 are1-no-margin">
                    <div className="col-lg-6">
                        <div className="p-4">
                            <h5 className="mb-3">How It Works?</h5>
                            <div className="text-container d-flex flex-column justify-content-center align-items-center text-left h-100">
                                <ul>
                                    <li>
                                        <strong>Step 1:</strong> Register or log in to your account — whether you're a
                                        user looking for help or a company offering services.
                                    </li>
                                    <li>
                                        <strong>Step 2:</strong> As a user, you can post a job detailing what needs to be
                                        done, including your budget and preferred timeframe.
                                    </li>
                                    <li>
                                        <strong>Step 3:</strong> Companies see your job and can respond with offers —
                                        including price, description, and estimated completion date.
                                    </li>
                                    <li>
                                        <strong>Step 4:</strong> You can review offers, accept one, and start
                                        collaborating directly through the platform.
                                    </li>
                                    <li>
                                        <strong>Step 5:</strong> After the job is completed, users can leave feedback,
                                        helping others make informed decisions in the future.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 area-2">
                        <div className="text-container d-flex justify-content-center align-items-center h-100"></div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="container-fluid py-5 bg-light">
                <div className="row justify-content-center">
                    <div className="col-lg-10 shadowed">
                        <br />
                        <h3 className="text-center mb-5">Weather forecast for your location</h3>
                        <p className="text-center">
                            If you're planning your construction job, you probably want to know what weather to expect, so you can plan accordingly. Here you can check the forecast for your location.
                        </p>
                        <Weather />
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bottom-box">
                <div className="row g-8 justify-content-center">
                    <div className="col-12 text-center">
                        <h5>Let’s Build Something Together</h5>
                        <p>
                            With "Build Me..." you don’t need to spend hours searching or guessing.<br />
                            You get quick access to real experts, verified reviews, and the peace of mind that comes from
                            making the right choice.<br />
                            Whether it's a small fix or a large-scale renovation — we’re here to help you find the best
                            team for the job.
                        </p>
                        {/* Navigate to jobs page with a styled button */}
                        <Button variant="success" className="mt-3" onClick={handleBrowseJobs} >
                            Browse The Jobs
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;