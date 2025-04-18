// Import necessary tools and libraries
import React, { useEffect, useState } from "react"; // React for building UI, useEffect for side effects, useState for managing state
import axios from "axios"; // Axios for making HTTP requests to the server
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap"; // Bootstrap components for layout and styling
import Slider from "react-slick"; // Slider component for displaying reviews in a carousel
import Header from "../components/Header"; // Custom Header component for page title and image
import header1 from "../images/header1.jpg"; // Image for the header background
import "slick-carousel/slick/slick.css"; // CSS for the slider’s structure
import "slick-carousel/slick/slick-theme.css"; // CSS for the slider’s theme (arrows, dots)

// Main component for the Companies page
function Companies() {
    const [companies, setCompanies] = useState([]); // Array to store list of companies, starts empty
    const [companyReviews, setCompanyReviews] = useState({}); // Object to store reviews for each company, keyed by company ID, starts empty

    // useEffect: Fetches companies and their reviews when the page loads
    useEffect(() => {
        axios.get("http://localhost:5000/api/companies")
            .then((response) => {
                console.log("Companies Data:", response.data);
                setCompanies(response.data);
                response.data.forEach((company) => {
                    axios.get(`http://localhost:5000/api/companies/${company.ID}/reviews`)
                        .then((res) => {
                            console.log(`Reviews for ${company.Name}:`, res.data);
                            setCompanyReviews((prev) => ({
                                ...prev,
                                [company.ID]: res.data
                            }));
                        })
                        .catch((err) => console.error(`Error fetching reviews for ${company.Name}:`, err));
                });
            })
            .catch((error) => console.error("Error fetching companies:", error));
    }, []);

    // StarRating: Displays a star rating visually, with safeguards for invalid ratings
    const StarRating = ({ rating }) => {
        const totalStars = 5; // Total number of stars to display
        const safeRating = Number(rating) || 0; // Convert rating to number, default to 0 if invalid
        console.log("StarRating - Input Rating:", rating, "Safe Rating:", safeRating); // Debug rating value
        return (
            <span>
                {[...Array(totalStars)].map((_, index) => (
                    <span
                        key={index}
                        style={{
                            color: index < safeRating ? "#ffc107" : "#d3d3d3", // Yellow if below rating, gray if above
                            fontSize: "1.2em", // Larger stars
                            marginRight: "2px", // Add spacing between stars
                        }}
                    >
                        ★
                    </span>
                ))}
            </span>
        );
    };

    // sliderSettings: Configuration for the reviews carousel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        adaptiveHeight: true,
    };

    // Render: Defines what the page looks like
    return (
        <div>
            <div>
                <Header header="Company List" subheader="Review companies" image={header1} />
            </div>
            <div>
                <br />
            </div>
            <div>
                <h2 className="text-center mb-4">Companies</h2>
            </div>
            <Container>
                {companies.length === 0 ? (
                    <p className="text-center">No companies available.</p>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {companies.map((company) => {
                            const reviewsData = companyReviews[company.ID] || { reviews: [], summary: { AverageRating: null, ReviewCount: 0 } };
                            console.log(`Company ${company.Name} - AverageRating:`, reviewsData.summary.AverageRating); // Debug average rating
                            return (
                                <Col key={company.ID}>
                                    <Card className="h-100 shadow-sm">
                                        <Card.Body>
                                            <Card.Title>{company.Name}</Card.Title>
                                            <Card.Text>
                                                <strong>City:</strong> {company.City || "Not specified"}<br />
                                                <strong>Phone:</strong> {company.Phone || "Not specified"}<br />
                                                <strong>Address:</strong> {company.Address || "Not specified"}<br />
                                                <strong>Average Rating:</strong>{" "}
                                                {reviewsData.summary.AverageRating !== null && !isNaN(reviewsData.summary.AverageRating) ? (
                                                    <>
                                                        <StarRating rating={Math.round(reviewsData.summary.AverageRating)} />
                                                        ({reviewsData.summary.ReviewCount} reviews)
                                                    </>
                                                ) : (
                                                    "No reviews yet"
                                                )}
                                            </Card.Text>
                                            {reviewsData.reviews.length > 0 && (
                                                <>
                                                    <h6 className="mt-3">Reviews:</h6>
                                                    <Slider {...sliderSettings}>
                                                        {reviewsData.reviews.map((review, index) => (
                                                            <div key={index}>
                                                                <ListGroup variant="flush">
                                                                    <ListGroup.Item>
                                                                        <strong>{review.Name}:</strong> <StarRating rating={review.Rating} /><br />
                                                                        {review.Comment && <span>"{review.Comment}"</span>}
                                                                    </ListGroup.Item>
                                                                </ListGroup>
                                                            </div>
                                                        ))}
                                                    </Slider>
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
            <div>
                <h2 className="text-center mb-4"><br /></h2>
            </div>
        </div>
    );
}

export default Companies;