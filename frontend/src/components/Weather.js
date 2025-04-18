import React, { useState } from "react"; // React for building UI, useState for managing component state
import axios from "axios"; // Axios for making HTTP requests to OpenWeatherMap API
import { Container, Form, Button, Card, Row, Col, Dropdown } from "react-bootstrap"; // Bootstrap for styling and layout

// Weather component to display a 5-day forecast with icons in a single horizontal row
function Weather() {
    // State variables for user input, API data, and UI state
    const [city, setCity] = useState(""); // Stores user-entered city name 
    const [forecast, setForecast] = useState([]); // Stores forecast data  
    const [error, setError] = useState(""); // Stores error messages  
    const [duration, setDuration] = useState(5); // Number of days (1, 3, or 5; capped at 5 for free tier)

    // OpenWeatherMap API key (free-tier, provided by user)
    const API_KEY = "69f3e2e37b4453522367c3ff2ca3c783"; // Supports 5-day forecasts only
    // Base URL for 5-day/3-hour forecast API (free tier)
    const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
    // Note: Free tier limits to 5 days (40 timestamps, 3-hour intervals)

    // Handle city input change
    const handleCityChange = (e) => {
        setCity(e.target.value); // Update city as user types
        setError(""); // Clear previous errors
    };

    // Handle duration selection (1, 3, or 5 days)
    const handleDurationChange = (days) => {
        setDuration(days); // Update duration state
        // Capped at 5 days due to free-tier limit
    };

    // Fetch 5-day weather forecast
    const fetchWeather = async (e) => {
        e.preventDefault(); // Prevent form reload
        if (!city.trim()) {
            setError("Please enter a city name."); // Validate input
            return;
        }

        try {
            // Call 5-day forecast API with city, metric units, and API key
            // Returns 40 timestamps (5 days, 3-hour intervals)
            const response = await axios.get(
                `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
            );
            setForecast(response.data.list); // Store 3-hourly data
            setError(""); // Clear errors
        } catch (err) {
            // Handle errors (e.g., invalid city, network issues)
            setError(
                err.response?.data?.message || "Error fetching weather. Try again."
            );
            setForecast([]); // Clear forecast on error
        }
    };

    // Filter forecast to one entry per day (noon, 12:00) for daily summary
    // Free tier provides 40 timestamps; we select one per day up to 'duration'
    const getDailyForecast = () => {
        const daily = [];
        const seenDates = new Set(); // Track unique dates
        for (const item of forecast) {
            // Extract date (e.g., "2025-04-15")
            const date = item.dt_txt.split(" ")[0];
            const time = item.dt_txt.split(" ")[1]; // Extract time (e.g., "12:00:00")
            // Use noon for consistency (typical daily weather summary)
            if (time.startsWith("12:00") && !seenDates.has(date)) {
                daily.push(item);
                seenDates.add(date);
            }
            // Stop at selected duration (e.g., 3 days)
            if (daily.length >= duration) break;
        }
        return daily;
    };

    return (
        <Container className="my-4">
            {/* Form for city input and duration selection */}
            <Form onSubmit={fetchWeather} className="mb-4">
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Control
                                type="text"
                                placeholder="Enter city (e.g., Dublin)"
                                value={city}
                                onChange={handleCityChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        {/* Dropdown for duration (1, 3, 5 days) */}
                        <Dropdown onSelect={(e) => handleDurationChange(Number(e))}>
                            <Dropdown.Toggle variant="secondary">
                                {duration} Day{duration > 1 ? "s" : ""}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="1">1 Day</Dropdown.Item>
                                <Dropdown.Item eventKey="3">3 Days</Dropdown.Item>
                                <Dropdown.Item eventKey="5">5 Days</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col md={3}>
                        <Button type="submit" variant="primary" className="w-100">
                            Get Forecast
                        </Button>
                    </Col>
                </Row>
                {/* Show error if API call fails */}
                {error && <p className="text-danger mt-2">{error}</p>}
            </Form>

            {/* Display forecast cards in a single horizontal row */}
            <div className="d-flex flex-nowrap overflow-x-auto pb-2">
                {/* Map forecast data to cards */}
                {getDailyForecast().map((item, index) => (
                    <Card
                        key={index}
                        style={{ width: "200px", flex: "0 0 auto", marginRight: "15px" }}
                    >
                        <Card.Img
                            variant="top"
                            // Weather icon (e.g., 10d@2x.png for rain)
                            // Source: OpenWeatherMap, 100x100px
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                            alt={item.weather[0].description}
                            style={{ height: "100px", objectFit: "contain" }}
                        />
                        <Card.Body>
                            <Card.Title>
                                {/* Format date (e.g., "Tue, Apr 15") */}
                                {new Date(item.dt_txt).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric"
                                })}
                            </Card.Title>
                            <Card.Text>
                                {/* Capitalize condition (e.g., "Light Rain") */}
                                {item.weather[0].description
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                <br />
                                {/* Rounded temperature */}
                                Temp: {Math.round(item.main.temp * 10) / 10}°C
                                <br />
                                Humidity: {item.main.humidity}%
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
}

export default Weather;

// Weather API documentation: https://openweathermap.org/forecast5#5days