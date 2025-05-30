import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Badge,
    Navbar,
    Nav,
} from "react-bootstrap";
import { FaInfoCircle, FaStar, FaPlayCircle } from "react-icons/fa";

// Dummy data for courses
const courses = [
    {
        id: 1,
        title: "Dasar Pemrograman Web",
        poster:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
        description:
            "Pelajari dasar-dasar pemrograman web dengan HTML, CSS, dan JavaScript secara interaktif dan mudah dipahami.",
        level: "Beginner",
        rating: 4.8,
        lessons: 24,
        duration: "12 Jam",
        instructor: "Rizky Pratama",
    },
    {
        id: 2,
        title: "Logika Pemrograman untuk Pemula",
        poster:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
        description:
            "Bangun fondasi logika pemrograman yang kuat untuk memulai perjalanan coding Anda.",
        level: "Beginner",
        rating: 4.7,
        lessons: 18,
        duration: "8 Jam",
        instructor: "Dewi Lestari",
    },
    {
        id: 3,
        title: "Belajar Python dari Nol",
        poster:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        description:
            "Mulai belajar Python dengan cara yang mudah, menyenangkan, dan penuh praktik.",
        level: "Beginner",
        rating: 4.9,
        lessons: 30,
        duration: "15 Jam",
        instructor: "Andi Wijaya",
    },
];

const brandStyle = {
    background: "linear-gradient(90deg, #cc00cc 60%, #fff 100%)",
    borderRadius: "1.5rem",
    padding: "2.5rem 2rem",
    color: "#fff",
    marginBottom: "2.5rem",
    boxShadow: "0 8px 32px rgba(204,0,204,0.15)",
};

const infoButtonStyle = {
    backgroundColor: "#cc00cc",
    border: "none",
    color: "#fff",
};

const App = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleShowModal = (course) => {
        setSelectedCourse(course);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(null);
    };

    return (
        <div style={{ background: "#f8f0fa", minHeight: "100vh" }}>
            {/* Navbar */}
            <Navbar
                expand="lg"
                style={{
                    background: "#cc00cc",
                    color: "#fff",
                    marginBottom: "2rem",
                    borderBottomLeftRadius: "1.5rem",
                    borderBottomRightRadius: "1.5rem",
                }}
                variant="dark"
            >
                <Container>
                    <Navbar.Brand style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                        <FaPlayCircle style={{ marginRight: 8 }} />
                        KursusOnline.id
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link href="#" style={{ color: "#fff" }}>
                            Beranda
                        </Nav.Link>
                        <Nav.Link href="#" style={{ color: "#fff" }}>
                            Kursus
                        </Nav.Link>
                        <Nav.Link href="#" style={{ color: "#fff" }}>
                            Tentang
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                {/* Brand Section */}
                <Row className="align-items-center" style={brandStyle}>
                    <Col md={7}>
                        <h1 style={{ fontWeight: 700, fontSize: "2.5rem", color: "#fff" }}>
                            Belajar Membuat Program Software dengan Mudah dan Nyaman
                        </h1>
                        <p style={{ fontSize: "1.25rem", color: "#f3e6f7" }}>
                            Mulai perjalanan coding Anda bersama kami. Materi interaktif, mentor berpengalaman, dan komunitas suportif siap membantu Anda berkembang dari nol!
                        </p>
                        <Button
                            size="lg"
                            style={{
                                background: "#fff",
                                color: "#cc00cc",
                                border: "none",
                                fontWeight: "bold",
                                marginTop: "1rem",
                                boxShadow: "0 4px 16px rgba(204,0,204,0.12)",
                            }}
                        >
                            Mulai Belajar Sekarang
                        </Button>
                    </Col>
                    <Col md={5} className="text-center">
                        <img
                            src="https://undraw.co/api/illustrations/6b6e1b0e-7c7d-4e2e-8e7b-2e1e2e1e2e1e"
                            alt="Belajar Programming"
                            style={{
                                width: "90%",
                                maxWidth: 350,
                                borderRadius: "1.5rem",
                                boxShadow: "0 8px 32px rgba(204,0,204,0.15)",
                                border: "4px solid #fff",
                            }}
                        />
                    </Col>
                </Row>

                {/* Courses Section */}
                <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
                    <h2
                        style={{
                            color: "#cc00cc",
                            fontWeight: 700,
                            marginBottom: "1.5rem",
                            textAlign: "center",
                        }}
                    >
                        Pilihan Kursus Online Untuk Pemula
                    </h2>
                    <Row xs={1} md={3} className="g-4">
                        {courses.map((course) => (
                            <Col key={course.id}>
                                <Card
                                    style={{
                                        border: "none",
                                        borderRadius: "1.25rem",
                                        boxShadow: "0 4px 24px rgba(204,0,204,0.08)",
                                        background: "#fff",
                                        transition: "transform 0.2s",
                                    }}
                                    className="h-100"
                                >
                                    <Card.Img
                                        variant="top"
                                        src={course.poster}
                                        alt={course.title}
                                        style={{
                                            borderTopLeftRadius: "1.25rem",
                                            borderTopRightRadius: "1.25rem",
                                            height: 180,
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Card.Body>
                                        <Badge
                                            bg="light"
                                            text="dark"
                                            style={{
                                                color: "#cc00cc",
                                                border: "1px solid #cc00cc",
                                                marginBottom: 8,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {course.level}
                                        </Badge>
                                        <Card.Title
                                            style={{
                                                color: "#cc00cc",
                                                fontWeight: 700,
                                                fontSize: "1.15rem",
                                                marginBottom: 8,
                                            }}
                                        >
                                            {course.title}
                                        </Card.Title>
                                        <Card.Text style={{ minHeight: 60 }}>
                                            {course.description}
                                        </Card.Text>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                marginBottom: 8,
                                                color: "#cc00cc",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            <span>
                                                <FaStar color="#cc00cc" /> {course.rating}
                                            </span>
                                            <span>
                                                <FaPlayCircle /> {course.lessons} Materi
                                            </span>
                                            <span>
                                                <FaInfoCircle /> {course.duration}
                                            </span>
                                        </div>
                                        <Button
                                            variant="primary"
                                            style={infoButtonStyle}
                                            onClick={() => handleShowModal(course)}
                                        >
                                            <FaInfoCircle style={{ marginRight: 6 }} />
                                            Info Selengkapnya
                                        </Button>
                                    </Card.Body>
                                    <Card.Footer
                                        style={{
                                            background: "#f8f0fa",
                                            borderBottomLeftRadius: "1.25rem",
                                            borderBottomRightRadius: "1.25rem",
                                            border: "none",
                                            color: "#cc00cc",
                                            fontWeight: 500,
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        Mentor: {course.instructor}
                                    </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>

            {/* Modal for Course Info */}
            <Modal
                show={showModal}
                onHide={handleCloseModal}
                size="lg"
                centered
                backdrop="static"
            >
                {selectedCourse && (
                    <>
                        <Modal.Header
                            closeButton
                            style={{ background: "#cc00cc", color: "#fff" }}
                        >
                            <Modal.Title>
                                <FaInfoCircle style={{ marginRight: 8 }} />
                                {selectedCourse.title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ background: "#f8f0fa" }}>
                            <Row>
                                <Col md={5} className="mb-3 mb-md-0">
                                    <img
                                        src={selectedCourse.poster}
                                        alt={selectedCourse.title}
                                        style={{
                                            width: "100%",
                                            borderRadius: "1rem",
                                            boxShadow: "0 4px 16px rgba(204,0,204,0.10)",
                                        }}
                                    />
                                </Col>
                                <Col md={7}>
                                    <h4 style={{ color: "#cc00cc", fontWeight: 700 }}>
                                        {selectedCourse.title}
                                    </h4>
                                    <p>{selectedCourse.description}</p>
                                    <ul style={{ paddingLeft: 18 }}>
                                        <li>
                                            <strong>Level:</strong> {selectedCourse.level}
                                        </li>
                                        <li>
                                            <strong>Rating:</strong> {selectedCourse.rating} / 5
                                        </li>
                                        <li>
                                            <strong>Jumlah Materi:</strong> {selectedCourse.lessons}
                                        </li>
                                        <li>
                                            <strong>Durasi:</strong> {selectedCourse.duration}
                                        </li>
                                        <li>
                                            <strong>Mentor:</strong> {selectedCourse.instructor}
                                        </li>
                                    </ul>
                                    <Button
                                        variant="outline-primary"
                                        style={{
                                            borderColor: "#cc00cc",
                                            color: "#cc00cc",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Daftar Kursus Ini
                                    </Button>
                                </Col>
                            </Row>
                        </Modal.Body>
                    </>
                )}
            </Modal>

            {/* Footer */}
            <footer
                style={{
                    background: "#cc00cc",
                    color: "#fff",
                    textAlign: "center",
                    padding: "1.5rem 0 0.5rem 0",
                    marginTop: "3rem",
                    borderTopLeftRadius: "1.5rem",
                    borderTopRightRadius: "1.5rem",
                }}
            >
                <div>
                    <strong>KursusOnline.id</strong> &copy; {new Date().getFullYear()} &mdash; Belajar Programming Mudah & Nyaman
                </div>
                <div style={{ fontSize: "0.95rem", marginTop: 4 }}>
                    Temukan kami di{" "}
                    <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#fff", textDecoration: "underline" }}
                    >
                        Instagram
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default App;