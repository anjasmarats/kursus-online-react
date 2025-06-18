import React, { useCallback, useState } from "react";
import { ListGroup,Card,OverlayTrigger,Tooltip, Row,Col,Button } from "react-bootstrap";
import { FaPlayCircle,FaChevronRight,FaChevronLeft, FaPlusCircle } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { server_url } from "../../scripts/url";
import "../../styles/ListChapters.css"
import { useDispatch, useSelector } from "react-redux";
import { profile_data, set_time_out_session } from "../../scripts/profiledataedit";
import auth from "../../scripts/auth";
import { persistor } from "../../app/store";
import axios from "axios";
import ModalDetailVideo from "./ModalDetailVideo";

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
        setShowNewChapter,
        thumbnail,
        setThumbnail,
        showNewChapter,
        setLoading,
        idCourse,
        courseTitle,
        courseThumbnail
    })=>{
    const profileData = useSelector(profile_data);
    const dispatch = useDispatch()

    const closeViewChapter =useCallback(()=>{
        try {
            setShowNewChapter(false)
            setChapter({})
        } catch (error) {
            console.error(`error xviewchapter ${error}`)
        }
    },[])

    const postChapter = useCallback(async(e) => {
        try {
            e.preventDefault()
            const result = await auth()
            if (!result) {
                await persistor.purge()
                dispatch(set_time_out_session())
                navigate("/")
            }
            setLoading(true)
            if (!chapter.title) {
                return
            }
        
            const session = localStorage.getItem("session")
        
            const formData = new FormData()
            formData.append("title",chapter.title)
            formData.append("video",chapter.video)
            formData.append("chapterNote",chapter.chapterNote)
            formData.append("courseTitle",courseTitle)
        
            const res = await axios.post(`${server_url}/api/course/${idCourse}/chapter`,formData,{
                headers:{
                    Authorization:"Bearer "+session
                }
            })
            if (res.status===200) {
                closeViewChapter()
                await fetchData()
            }
        } catch (error) {
            console.error("error edit course",error)           
        } finally {
            setLoading(false)
        }
    },[chapter.title,chapter.chapterNote,chapter.video])
    
    return (
        <>
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
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                    }}
                >
                    <ListGroup
                        variant="flush"
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
                            minHeight: "70vh",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            {loading && (
                            <>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation: "loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation: "loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation: "loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation: "loading 1.5s infinite" }}>&nbsp;</Row>
                            </>
                            )}
                            {!loading && chapters.map((video, idx) => (
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
                                        <FaPlayCircle color={currentVideo.id === video.id ? "white" : "#cc00cc"} size={22} />
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
                                    {profileData.role === "admin" && (
                                        <Col xs={3} className="text-end">
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
                                                    viewChapter(video.title, video.video, video.chapterNote, video.id)
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <MdModeEditOutline color={currentVideo.id === video.id ? "white" : "#cc00cc"} size={28}/>
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
                                                    deleteChapter(video.title, video.id)
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <RiDeleteBin5Fill color={currentVideo.id === video.id ? "white" : "#cc00cc"} size={28} />
                                            </span>
                                        </OverlayTrigger>
                                        </Col>
                                    )}
                                </Row>
                            </ListGroup.Item>
                            ))}
                        </div>
                        <div
                            className={loading?"d-flex justify-content-center bg-secondary loading":"d-flex justify-content-center"}
                            style={{
                            position: "sticky",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            background: loading?"none":"rgba(255,255,255,0.9)",
                            zIndex: 2,
                            paddingTop: "16px",
                            paddingBottom: "16px",
                            borderRadius: "0 0 18px 0",
                            }}
                        >
                            <button
                                className={loading?"btn loading btn-secondary d-flex align-items-center px-4 py-2 shadow rounded-pill border-0":"btn btn-gradient-primary d-flex align-items-center px-4 py-2 shadow rounded-pill border-0"}
                                style={{
                                    background: loading?"secondary":"linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                                    color: loading?"":"#fff",
                                    fontWeight: 600,
                                    fontSize: "1.1rem",
                                    transition: "transform 0.15s, box-shadow 0.15s",
                                    boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
                                }}
                                onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
                                onClick={()=>setShowNewChapter(true)}
                            >
                                {loading ? (
                                    <div className="bg-secondary loading p-2">&nbsp;</div>
                                ) : (
                                    <>
                                        <FaPlusCircle className="me-2" size={22} />
                                        Buat Chapter Baru
                                    </>
                                )}
                            </button>
                        </div>
                    </ListGroup>
                </Col>
                {loading?(
                    <Col md={8} style={{ animation:"loading 1.5s infinite" }} className="bg-secondary p-5"></Col>
                ) : (
                    <Col
                        md={8}
                        className="d-flex flex-column align-items-center justify-content-center"
                    >
                        {currentVideo.video==null ? (
                            <img src={thumbnail?URL.createObjectURL(thumbnail):`${server_url}/courses/thumbnails/${courseThumbnail}`} style={{
                            width: "100%",
                            objectFit: "cover",
                            background: "#000",
                            }} alt="" />
                        ) : (
                            <>
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
                                poster={`${server_url}/courses/thumbnails/${thumbnail}`}
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
                        </Card>
                        <Card className="mt-4 shadow" style={{
                            width: "100%",
                            maxWidth: "720px",
                            borderRadius: "20px",
                            background: "linear-gradient(90deg, #cc00cc 0%, #6366f1 100%)",
                            color: "#fff",
                            border: "none",
                            boxShadow: "0 8px 32px rgba(204,0,204,0.08)"
                        }}>
                            <Card.Body>
                                <Row className="align-items-center mb-3">
                                    <Col xs={12} md={4} className="text-center mb-2 mb-md-0">
                                        <div style={{
                                            fontSize: "2.8rem",
                                            fontWeight: 800,
                                            color: "#fff",
                                            textShadow: "0 2px 8px #cc00cc99"
                                        }}>
                                            4.8
                                            <span style={{ fontSize: "1.2rem", fontWeight: 500, marginLeft: 8, color: "#e0e7ff" }}>/5</span>
                                        </div>
                                        <div>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>
                                                    {i < 4
                                                        ? <FaPlayCircle color="#fff" size={26} style={{ filter: "drop-shadow(0 0 4px #cc00cc)" }} />
                                                        : <FaPlayCircle color="#e0e7ff" size={26} style={{ opacity: 0.5 }} />
                                                    }
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-2" style={{ color: "#e0e7ff", fontSize: "1rem" }}>
                                            1,234 ulasan
                                        </div>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        {[5, 4, 3, 2, 1].map((star, idx) => (
                                            <Row key={star} className="align-items-center mb-1">
                                                <Col xs={2} className="text-end pe-0">
                                                    <span style={{ fontWeight: 600, color: "#fff" }}>{star}</span>
                                                    <FaPlayCircle color="#fff" size={16} className="ms-1" />
                                                </Col>
                                                <Col xs={8} className="px-0">
                                                    <div style={{
                                                        background: "rgba(255,255,255,0.15)",
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        height: "12px",
                                                        position: "relative"
                                                    }}>
                                                        <div style={{
                                                            width: `${[60, 25, 10, 3, 2][idx]}%`,
                                                            background: "linear-gradient(90deg, #cc00cc 0%, #6366f1 100%)",
                                                            height: "100%",
                                                            borderRadius: "8px"
                                                        }} />
                                                    </div>
                                                </Col>
                                                <Col xs={2} className="ps-1" style={{ color: "#e0e7ff", fontSize: "0.95rem" }}>
                                                    {["740", "310", "124", "38", "22"][idx]}
                                                </Col>
                                            </Row>
                                        ))}
                                    </Col>
                                </Row>
                                <hr style={{ borderColor: "#fff2", margin: "18px 0" }} />
                                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                                    {[
                                        {
                                            name: "Ayu Pratiwi",
                                            rating: 5,
                                            date: "2 hari lalu",
                                            review: "Materi sangat jelas dan mudah dipahami! Instruktur sangat komunikatif.",
                                            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                                        },
                                        {
                                            name: "Budi Santoso",
                                            rating: 4,
                                            date: "5 hari lalu",
                                            review: "Kelasnya bagus, hanya saja ingin lebih banyak contoh studi kasus.",
                                            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                                        },
                                        {
                                            name: "Citra Lestari",
                                            rating: 5,
                                            date: "1 minggu lalu",
                                            review: "Sangat membantu untuk pemula. Terima kasih!",
                                            avatar: "https://randomuser.me/api/portraits/women/65.jpg"
                                        }
                                    ].map((item, idx) => (
                                        <Card key={idx} className="mb-3 border-0" style={{
                                            background: "rgba(255,255,255,0.08)",
                                            borderRadius: "16px",
                                            color: "#fff",
                                            boxShadow: "0 2px 8px #cc00cc22"
                                        }}>
                                            <Card.Body className="d-flex align-items-start">
                                                <img
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        border: "3px solid #cc00cc",
                                                        marginRight: 18,
                                                        boxShadow: "0 2px 8px #cc00cc44"
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div className="d-flex align-items-center mb-1">
                                                        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{item.name}</span>
                                                        <span className="ms-2" style={{ color: "#e0e7ff", fontSize: "0.95rem" }}>{item.date}</span>
                                                        <span className="ms-auto">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaPlayCircle
                                                                    key={i}
                                                                    color={i < item.rating ? "#fff" : "#e0e7ff"}
                                                                    size={18}
                                                                    style={{ marginLeft: 1, opacity: i < item.rating ? 1 : 0.5 }}
                                                                />
                                                            ))}
                                                        </span>
                                                    </div>
                                                    <div style={{
                                                        fontSize: "1rem",
                                                        color: "#e0e7ff",
                                                        lineHeight: 1.5
                                                    }}>
                                                        {item.review}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <Button
                                        variant="light"
                                        style={{
                                            color: "#cc00cc",
                                            fontWeight: 700,
                                            borderRadius: "30px",
                                            padding: "8px 28px",
                                            boxShadow: "0 2px 8px #cc00cc22",
                                            background: "#fff"
                                        }}
                                    >
                                        Lihat Semua Ulasan
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        </>)}
                    </Col>
                )}
            </Row>
            {showNewChapter&&(<ModalDetailVideo {...{
                showNewChapter,
                postChapter,
                chapter,
                closeViewChapter,
                loading,
                setChapter,
            }}/>)}
        </>
    )
})

export default ListChapters