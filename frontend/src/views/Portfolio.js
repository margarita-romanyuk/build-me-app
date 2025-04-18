 
// Import tools for building the page
import React, { useState, useEffect } from "react"; // React, state, and lifecycle hooks
import Header from "../components/Header"; // Custom header component
import header2 from "../images/header2.jpg"; // Picture for the top of page
import pic1 from "../images/header1a.jpg";  
import pic2 from "../images/header2a.jpg";  
import axios from "axios"; // For fetching stats from API
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import { NavLink } from "react-router-dom"; // For navigation
import { Container, Row, Col, Card, Button } from "react-bootstrap"; // Bootstrap components

// Portfolio component with modern design and photos
function Portfolio() {
    // Stats state for displaying platform impact
    const [stats, setStats] = useState({ jobsPosted: 0, jobsCompleted: 0, companiesRegistered: 0 });

    // Fetch stats on mount
    // - WHAT: Gets platform stats (jobs posted, completed, companies)
    // - WHY: Displays dynamic data in "Our Impact" section
    useEffect(() => {
        axios.get("http://localhost:5000/api/stats")
            .then((response) => {
                console.log("Stats Data:", response.data);
                setStats(response.data);
            })
            .catch((error) => console.error("Error fetching stats:", error));
    }, []);

    return (
        <>
            {/* Import modern fonts and animations */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />



            {/* Header Section */}
            <div className="portfolio-header">
                <Header
                    header="Our Portfolio"
                    subheader="Connecting People, Building Solutions"
                    image={header2 || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"}
                />
            </div>

            <Container className="my-5">
                {/* Mission Statement */}
                <Row className="mb-5 fade-in">
                    <Col>
                        <h2 className="section-title text-center">Who We Are</h2>
                        <Card className="modern-card shadow-sm p-4">
                            <Card.Body>
                                <p className="text-muted lead">
                                    At <strong>Build Me...</strong>, we empower collaboration between homeowners seeking
                                    top-tier home improvement and verified construction companies delivering exceptional
                                    results. Our platform transcends traditional listings by curating trusted partnerships,
                                    ensuring transparency, reputation, and satisfaction drive every project. Tailored for
                                    the Irish market, we champion smart matching and digital solutions that build lasting
                                    value.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Services */}
                <Row className="mb-5 fade-in">
                    <Col>
                        <h3 className="section-title text-center">What We Offer</h3>
                        <Row xs={1} md={3} className="g-4">
                            <Col>
                                <Card className="modern-card h-100">
                                    <Card.Img
                                        variant="top"
                                        src={pic1}
                                        alt="Modern home renovation"
                                    />
                                    <Card.Body>
                                        <Card.Title>Inspiring Project Gallery</Card.Title>
                                        <Card.Text>
                                            Explore a curated collection of completed projects, from sleek kitchen remodels
                                            to expansive home builds, showcasing the skill and diversity of our trusted
                                            contractors.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="modern-card h-100">
                                    <Card.Img
                                        variant="top"
                                        src={pic2}
                                        alt="Happy homeowner"
                                    />
                                    <Card.Body>
                                        <Card.Title>Success Stories</Card.Title>
                                        <Card.Text>
                                            Hear from clients who transformed their homes with reliable contractors,
                                            achieving their vision through seamless communication and dependable partnerships.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="modern-card h-100">
                                    <Card.Img
                                        variant="top"
                                        src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                                        alt="Before and after renovation"
                                    />
                                    <Card.Body>
                                        <Card.Title>Visual Progress Insights</Card.Title>
                                        <Card.Text>
                                            Discover before-and-after transformations that highlight innovative designs and
                                            craftsmanship, inspiring confidence in our contractors’ expertise.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {/* Achievements/Stats */}
                <Row className="mb-5 fade-in">
                    <Col>
                        <h3 className="section-title text-center">Our Impact</h3>
                        <Row xs={1} md={3} className="g-4">
                            <Col>
                                <Card className="stats-card shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-bullhorn stats-icon"></i>
                                        <h4>{stats.jobsPosted}</h4>
                                        <p>Jobs Posted</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-check-circle stats-icon"></i>
                                        <h4>{stats.jobsCompleted}</h4>
                                        <p>Jobs Completed</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card shadow-sm">
                                    <Card.Body>
                                        <i className="fas fa-users stats-icon"></i>
                                        <h4>{stats.companiesRegistered}</h4>
                                        <p>Companies Registered</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="mb-5 fade-in">
                    <Col>
                        <h2 className="section-title text-center">Home Improvement Trends in Ireland</h2>
                        <Card className="modern-card shadow-sm p-4">
                            <Card.Body>
                                <p className="text-muted lead">
                                    According to industry reports, Irish homeowners are investing more in renovation than ever before. Our platform was created in response to this growing need for accessible, trustworthy service providers.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Chart Section */}
                <div className="container-fluid py-5 bg-light">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 shadowed">
                            <br />
                            {/* Contact Link */}
                            <Row className="mb-5 fade-in">
                                <Col className="text-center">
                                    <h4 className="section-title mb-4">
                                        Have questions about Build Me...? Let’s talk!
                                    </h4>
                                    <NavLink to="/contact">
                                        <Button variant="secondary">Contact Us</Button>
                                    </NavLink>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>

               
            </Container>
        </>
    );
}

export default Portfolio;
