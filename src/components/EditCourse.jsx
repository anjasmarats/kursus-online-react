import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {

// EditCourse.jsx
// UI/UX Online Course Video Player - Unique, Modern, and User-Friendly
// Uses React, React-Bootstrap, Bootstrap, and React-Icons
// This design features a visually distinct, comfortable, and easy-to-use interface
// for displaying a list of course videos and the currently playing video.

// Import React and necessary libraries
    Container,
    Row,
    Col,
    ListGroup,
    Card,
    ProgressBar,
    Button,
    Badge,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import {
    FaPlayCircle,
    FaPauseCircle,
    FaCheckCircle,
    FaRegClock,
    FaChevronRight,
    FaChevronLeft,
    FaRegHeart,
    FaHeart,
} from "react-icons/fa";

// Sample video data (replace with your API or props)
const videoList = [
    {
        id: 1,
        title: "Introduction to React",
        duration: "5:32",
        watched: true,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Get started with the basics of React and component structure.",
    },
    {
        id: 2,
        title: "JSX & Rendering",
        duration: "8:21",
        watched: false,
        url: "https://www.w3schools.com/html/movie.mp4",
        description: "Learn how JSX works and how to render elements dynamically.",
    },
    {
        id: 3,
        title: "State & Props",
        duration: "10:05",
        watched: false,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        description: "Understand state management and passing data via props.",
    },
    {
        id: 4,
        title: "Hooks Deep Dive",
        duration: "12:47",
        watched: false,
        url: "https://www.w3schools.com/html/movie.mp4",
        description: "Explore React hooks for powerful functional components.",
    },
];

// Main component
const EditCourse = () => {
    // State for currently playing video and favorite status
    const [currentVideo, setCurrentVideo] = useState(videoList[0]);
    const [isPlaying, setIsPlaying] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [hovered, setHovered] = useState(null);

    // Handler to play selected video
    const handleSelectVideo = (video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    };

    // Handler to toggle play/pause
    const handlePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    // Handler to toggle favorite
    const handleFavorite = (id) => {
        setFavorites((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    // Handler for next/previous video
    const handleNextPrev = (direction) => {
        const idx = videoList.findIndex((v) => v.id === currentVideo.id);
        let newIdx = direction === "next" ? idx + 1 : idx - 1;
        if (newIdx < 0) newIdx = videoList.length - 1;
        if (newIdx >= videoList.length) newIdx = 0;
        setCurrentVideo(videoList[newIdx]);
        setIsPlaying(true);
    };

    // Calculate progress (watched videos)
    const progress =
        (videoList.filter((v) => v.watched || v.id === currentVideo.id).length /
            videoList.length) *
        100;

    return (
        <Container
            fluid
            className="py-4"
            style={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
            }}
        >
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2
                        className="fw-bold"
                        style={{
                            letterSpacing: "1px",
                            color: "#3b3b5c",
                            textShadow: "0 2px 8px #e0e7ff",
                        }}
                    >
                        <FaPlayCircle className="mb-1 me-2" color="#6366f1" size={32} />
                        Online Course Player
                    </h2>
                    <ProgressBar
                        now={progress}
                        label={`${Math.round(progress)}% Completed`}
                        variant="info"
                        style={{ height: "10px", borderRadius: "8px" }}
                        className="mt-2"
                    />
                </Col>
            </Row>

            {/* Main Content: Video Player & Playlist */}
            <Row>
                {/* Playlist Sidebar */}
                <Col
                    md={4}
                    className="mb-4"
                    style={{
                        borderRight: "2px solid #e0e7ff",
                        minHeight: "70vh",
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: "18px 0 0 18px",
                        boxShadow: "2px 0 16px #e0e7ff",
                    }}
                >
                    <h5 className="fw-semibold mb-3" style={{ color: "#6366f1" }}>
                        <FaRegClock className="me-2" />
                        Playlist
                    </h5>
                    <ListGroup variant="flush">
                        {videoList.map((video, idx) => (
                            <ListGroup.Item
                                key={video.id}
                                active={currentVideo.id === video.id}
                                onClick={() => handleSelectVideo(video)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        currentVideo.id === video.id
                                            ? "linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)"
                                            : hovered === video.id
                                            ? "#f1f5f9"
                                            : "transparent",
                                    color: currentVideo.id === video.id ? "#fff" : "#3b3b5c",
                                    border: "none",
                                    borderRadius: "12px",
                                    marginBottom: "8px",
                                    transition: "background 0.2s",
                                    boxShadow:
                                        currentVideo.id === video.id
                                            ? "0 2px 12px #a5b4fc"
                                            : "none",
                                }}
                                onMouseEnter={() => setHovered(video.id)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <Row className="align-items-center">
                                    <Col xs={2} className="text-center">
                                        {video.watched || currentVideo.id === video.id ? (
                                            <FaCheckCircle color="#22c55e" size={22} />
                                        ) : (
                                            <FaPlayCircle color="#6366f1" size={22} />
                                        )}
                                    </Col>
                                    <Col xs={7}>
                                        <div className="fw-semibold">{video.title}</div>
                                        <div
                                            className="small"
                                            style={{
                                                color:
                                                    currentVideo.id === video.id
                                                        ? "#e0e7ff"
                                                        : "#64748b",
                                            }}
                                        >
                                            {video.duration}
                                        </div>
                                    </Col>
                                    <Col xs={3} className="text-end">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    {favorites.includes(video.id)
                                                        ? "Remove from Favorites"
                                                        : "Add to Favorites"}
                                                </Tooltip>
                                            }
                                        >
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFavorite(video.id);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {favorites.includes(video.id) ? (
                                                    <FaHeart color="#f43f5e" size={18} />
                                                ) : (
                                                    <FaRegHeart color="#64748b" size={18} />
                                                )}
                                            </span>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Video Player Section */}
                <Col
                    md={8}
                    className="d-flex flex-column align-items-center justify-content-center"
                >
                    <Card
                        className="shadow-lg"
                        style={{
                            width: "100%",
                            maxWidth: "720px",
                            borderRadius: "24px",
                            background:
                                "linear-gradient(120deg, #6366f1 0%, #a5b4fc 100%)",
                            color: "#fff",
                            border: "none",
                        }}
                    >
                        {/* Video Player */}
                        <div
                            style={{
                                borderRadius: "24px 24px 0 0",
                                overflow: "hidden",
                                background: "#000",
                                position: "relative",
                            }}
                        >
                            <video
                                key={currentVideo.id}
                                src={currentVideo.url}
                                controls
                                autoPlay={isPlaying}
                                style={{
                                    width: "100%",
                                    height: "360px",
                                    objectFit: "cover",
                                    background: "#000",
                                }}
                                poster="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                            />
                            {/* Custom Play/Pause Overlay Button */}
                            <Button
                                variant="light"
                                size="lg"
                                onClick={handlePlayPause}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    opacity: 0.85,
                                    borderRadius: "50%",
                                    boxShadow: "0 2px 16px #6366f1",
                                    zIndex: 2,
                                }}
                            >
                                {isPlaying ? (
                                    <FaPauseCircle color="#6366f1" size={48} />
                                ) : (
                                    <FaPlayCircle color="#6366f1" size={48} />
                                )}
                            </Button>
                        </div>
                        {/* Video Info & Controls */}
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col xs={2} className="text-center">
                                    <Button
                                        variant="outline-light"
                                        onClick={() => handleNextPrev("prev")}
                                        style={{
                                            borderRadius: "50%",
                                            border: "none",
                                            boxShadow: "0 2px 8px #a5b4fc",
                                        }}
                                    >
                                        <FaChevronLeft size={24} />
                                    </Button>
                                </Col>
                                <Col xs={8} className="text-center">
                                    <Card.Title className="fw-bold mb-1">
                                        {currentVideo.title}
                                    </Card.Title>
                                    <Badge
                                        bg="info"
                                        className="mb-2"
                                        style={{
                                            fontSize: "0.9rem",
                                            color: "#3b3b5c",
                                            background: "#e0e7ff",
                                        }}
                                    >
                                        {currentVideo.duration}
                                    </Badge>
                                    <Card.Text
                                        className="mt-2"
                                        style={{
                                            fontSize: "1rem",
                                            color: "#e0e7ff",
                                            minHeight: "48px",
                                        }}
                                    >
                                        {currentVideo.description}
                                    </Card.Text>
                                </Col>
                                <Col xs={2} className="text-center">
                                    <Button
                                        variant="outline-light"
                                        onClick={() => handleNextPrev("next")}
                                        style={{
                                            borderRadius: "50%",
                                            border: "none",
                                            boxShadow: "0 2px 8px #a5b4fc",
                                        }}
                                    >
                                        <FaChevronRight size={24} />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditCourse;

/*
================================================================================
EXPLANATION (Highly Detailed):

1. Layout:
     - Uses React-Bootstrap's Container, Row, and Col for responsive layout.
     - Left sidebar (Playlist) and right main area (Video Player).
     - Modern, soft color gradients and rounded corners for a unique, comfortable look.

2. Playlist Sidebar:
     - ListGroup displays all course videos.
     - Each item shows:
         - Play/Check icon (watched or not).
         - Title and duration.
         - Favorite icon (toggleable, with tooltip).
     - Active video is highlighted with a gradient and shadow.
     - Hover effect for better interactivity.
     - Clicking an item plays that video.

3. Video Player Section:
     - Card with gradient background and rounded corners.
     - Video element with custom play/pause overlay button.
     - Next/Previous buttons for easy navigation.
     - Video title, duration badge, and description shown below the player.

4. Progress Bar:
     - Shows course completion based on watched videos.

5. Icons:
     - Uses react-icons for modern, visually appealing icons.

6. Accessibility & Usability:
     - Large clickable areas, clear contrasts, tooltips for icons.
     - Responsive design for desktop and tablet.

7. Customization:
     - Replace `videoList` with your own data or API.
     - Easily extendable for more features (e.g., notes, comments).

8. Uniqueness:
     - The combination of gradients, rounded corners, shadow, and icon usage
         creates a fresh, modern look not commonly found in other course platforms.

================================================================================
INSTRUCTIONS:
- Install dependencies:
        npm install react-bootstrap bootstrap react-icons
- Import Bootstrap CSS in your main.jsx or App.jsx:
- Place this component in your route/page as needed.

================================================================================
*/