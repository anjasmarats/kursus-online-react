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
        showNewChapter,
        setLoading,
        idCourse,
        courseTitle
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
            <ModalDetailVideo {...{
                showNewChapter,
                postChapter,
                chapter,
                closeViewChapter,
                loading,
                setChapter
            }}/>
        </>
    )
})

export default ListChapters