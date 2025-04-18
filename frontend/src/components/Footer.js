import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import logo from "../images/logo1.png";

function Footer() {
    // Get the current year
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center py-4">
            <Container>
                <Row>
                    {/* Logo Section */}
                    <Col sm={3} className="border-end">
                        <img src={logo} className="img-fluid" style={{ width: '80%' }} alt="Logo" />
                    </Col>

                    {/* Vision Section */}
                    <Col sm={3} className="border-end">
                        <h3>Our Vision</h3>
                        <p>To build a trusted digital space where anyone can connect with reliable renovation and construction experts —
                            making home improvement easier, more transparent, and accessible for every community.</p>
                    </Col>

                    {/* Mission Section */}
                    <Col sm={3} className="border-end">
                        <h3>Our Mission</h3>
                        <p>We aim to simplify the renovation journey by connecting users with verified professionals, promoting quality, trust,
                            and communication, and supporting local businesses through smart technology and user-friendly tools.</p>
                    </Col>

                    {/* Contact Section */}
                    <Col sm={3}>
                        <h3>Contact</h3>
                        <p>Tel: 01 353 89 789 654</p>
                        <p>Email: buildme@gmail.com</p>
                        <p>12 Greenway Crescent, Dublin 8, D08 X1Y2, Ireland</p>
                    </Col>
                </Row>
            </Container>

            <hr />
            <h6>&#9426; BUILD ME... {currentYear}</h6>
        </footer>
    );
}

export default Footer;
