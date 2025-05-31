import React from "react";
import { ListGroup,Card,OverlayTrigger,Tooltip, Row,Col,Button } from "react-bootstrap";
import { FaPlayCircle,FaChevronRight,FaChevronLeft, FaPlusCircle } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { server_url } from "../../scripts/url";
import "../../styles/ListChapters.css"
import { useAppSelector } from "../../app/hooks";

const ListChapters=React.memo(({
        isPlaying,
        hovered,
        setHovered,
        viewChapter,
        deleteChapter,
        handleSelectVideo,
        handleNextPrev,
        setChapter,
        loading,
        chapters,
        currentVideo,
        chapter,
        setShow,
        thumbnail
    })=>{
    const profileData = useAppSelector((state) => state.account_data);
    
    return (
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
                    <ListGroup variant="flush">
                        {loading&&(
                            <>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                            </>
                        )}
                        {!loading&&chapters.map((video, idx) => (
                            <ListGroup.Item
                                key={video.id}
                                active={currentVideo.id === video.id}
                                onClick={() => handleSelectVideo(video)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        currentVideo.id === video.id
                                            ? "#cc00cc"
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
                                        <FaPlayCircle color={currentVideo.id === video.id?"white":"#cc00cc"} size={22} />
                                    </Col>
                                    <Col>
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
                                    {profileData.role==="admin"&&(<Col xs={3} className="text-end">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    Edit chapter
                                                </Tooltip>
                                            }
                                        >
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    viewChapter(video.title,video.video,video.chapterNote,video.id)
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <MdModeEditOutline color={currentVideo.id === video.id?"white":"#cc00cc"} size={28} onClick={()=>{
                                                    setChapter({...chapter, title:video.title, video:video.video, chapterNote:video.chapterNote})
                                                    setShow(true)
                                                }}/>
                                            </span>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    Hapus chapter
                                                </Tooltip>
                                            }
                                        >
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteChapter(video.title,video.id)
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <RiDeleteBin5Fill color={currentVideo.id === video.id?"white":"#cc00cc"} size={28}/>
                                            </span>
                                        </OverlayTrigger>
                                    </Col>)}
                                </Row>
                            </ListGroup.Item>
                        ))}
                        <div className="d-flex justify-content-end my-4">
                            <button
                                className="btn btn-gradient-primary d-flex align-items-center px-4 py-2 shadow rounded-pill border-0"
                                style={{
                                    background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "1.1rem",
                                    transition: "transform 0.15s, box-shadow 0.15s",
                                    boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
                                }}
                                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                            >
                                <FaPlusCircle className="me-2" size={22} />
                                Buat Chapter Baru
                            </button>
                        </div>
                    </ListGroup>
                </Col>

                {/* Video Player Section */}
                {loading?(
                    <Col md={8} style={{ animation:"loading 1.5s infinite" }} className="bg-secondary p-5"></Col>
                ) : (
                    <Col
                        md={8}
                        className="d-flex flex-column align-items-center justify-content-center"
                    >
                        {currentVideo.video==null ? (
                            <img src={`${server_url}/courses/thumbnails/${thumbnail}`} style={{
                                width: "100%",
                                objectFit: "cover",
                                background: "#000",
                            }} alt="" />
                        ) : (
                        <Card
                            className="shadow-lg"
                            style={{
                                width: "100%",
                                maxWidth: "720px",
                                borderRadius: "24px",
                                background:
                                    "#cc00cc",
                                color: "#fff",
                                border: "none",
                            }}
                        >
                            {/* Video Player */}
                            <div
                                style={{
                                    borderRadius: "24px 24px 0 0",
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <video
                                    key={currentVideo.id}
                                    src={`${server_url}/courses/videos/${currentVideo.video}`}
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
                                        <Card.Text
                                            className="mt-2 listchapter-chapterNote"
                                            style={{
                                                fontSize: "1rem",
                                                color: "#e0e7ff",
                                                minHeight: "60px",
                                                maxHeight: "60px",
                                                overflow:"auto",
                                            }}
                                        >
                                            {currentVideo.chapterNote}
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
                        </Card>)}
                    </Col>
                )}
            </Row>
    )
})

export default ListChapters