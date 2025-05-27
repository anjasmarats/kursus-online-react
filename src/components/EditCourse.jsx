import React, { useEffect, useState } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// EditCourse.jsx
// UI/UX Online Course Video Player - Unique, Modern, and User-Friendly
// Uses React, React-Bootstrap, Bootstrap, and React-Icons
// This design features a visually distinct, comfortable, and easy-to-use interface
// for displaying a list of course videos and the currently playing video.

// Import React and necessary libraries
import {
    Container,Row,Col,ListGroup,Card,Button,Badge,
} from "react-bootstrap";
import {
    FaChevronRight,FaChevronLeft,
} from "react-icons/fa";
import "../styles/EditCourse.css"
import { useNavigate, useParams } from "react-router-dom";
import { server_url } from "../scripts/url";
import axios from "axios";
import auth from "../scripts/auth";

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
    const [loading,setLoading] = useState(false)
    const [currentVideo, setCurrentVideo] = useState({});
    const [isPlaying, setIsPlaying] = useState(true);
    const [hovered, setHovered] = useState(null);
    const { id } = useParams()
    const [idCourse,setIdCourse] = useState(0)
    const [course,setCourse] = useState({
        title:'',
        description:'',
        price:0,
        thumbnail:'',
        chapters:[]
    })


    const navigate = useNavigate()

    const [show,setShow] = useState(false)

    const [chapter,setChapter] = useState({
        key:0,
        id:0,
        courseId:0,
        title:'',
        video:null,
        chapterNote:''
    })

    const [error,setError] = useState(false)

    const viewChapter = async(key,title,video,chapterNote,chapterId)=>{
        try {
            console.info("key",key,"title",title,"video",video,"chapterNote",chapterNote,"chapterid",chapterId)
            if (!title||!video||!key) return
            setChapter({...chapter,id:chapterId,courseId:idCourse,title,video,chapterNote,key })
            setShow(true)
        } catch (error) {
            console.error(`error vchptr ${error}`)
        }
    }

    const closeViewChapter =()=>{
        try {
            setShow(false)
            setChapter({})
        } catch (error) {
            console.error(`error xviewchapter ${error}`)
        }
    }

    const getChapterVideo = async(data)=>{
        try {
            console.log("idCourse",idCourse)
            const { courseId,chapterId } = data
            const res = await fetch(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
                method: 'GET',
                headers: {
                "Authorization": `Bearer ${localStorage.getItem("session")}`
                }
            })
            
            if (res.status === 500) {
                console.error(res.status,await res.json())
                setError("Internal Server Error")
                return
            }
        
            if (res.status===200) {
                const blob = await res.blob()
                return URL.createObjectURL(blob)
            }
        } catch (error) {
          setError("Error")
          console.error(`error app ${error}`)
          setLoading(false)
        } finally {
          setLoading(false)
        }
      }

      const getThumbnail = async(data)=>{
        try {
          const res = await fetch(`${server_url}/api/course/photo`, {
            method: 'GET',
            headers: {
              "Authorization": `Bearer ${data}`
            }
          })
          
          if (res.status === 500) {
            setError("Internal Server Error")
            return
          }
    
          if (res.status===200) {
            const blob = await res.blob()
            return URL.createObjectURL(blob)
          }
        } catch (error) {
          setError("Error")
          console.error(`error app ${error}`)
          setLoading(false)
        } finally {
          setLoading(false)
        }
      }

    const fetchData = async () => {
        try {
            // let chapters=[]
          setLoading(true)
          const {adminuser} = await auth()
          if (!adminuser) {
            navigate('/')
          }
          const response = await axios.get(`${server_url}/api/course/${id}`)
          const res = await response.data
        //   console.log("res.course",res.course.Chapters[2])
          const { courseId,title,description,image,price,Chapters } = res.course
          const thumbnail = await getThumbnail(image)
          setIdCourse(courseId)
          setCourse({...course,title,description,price,chapters:[...Chapters],thumbnail})
          console.log(res.course)
          setChapter({})
          setLoading(false)
        } catch (error) {
          if (error.response && error.response.status === 500) {
            setError("Internal Server Error")
          }
          console.error(`error app ${error}`)
        } finally {
            setLoading(false)
        }
      }

    const deleteChapter = async(title) => {
        try {
            const confirm = await Swal.fire({
                title:`Hapus chapter ${title}`,
                showCancelButton:true,
                cancelButtonColor:"blue",
                showConfirmButton:true,
                confirmButtonColor:"red",
                confirmButtonText:"Delete"
            }).then(res=>res.isConfirmed)
            if (!confirm) {
                return
            }
        } catch (error) {
            console.error(`error xchapter ${error}`)
        }
    }

    const updateChapter = (key) => {
        try {
            console.log("chapter pertama",chapter)
            if (!key) return
            closeViewChapter()
        } catch (error) {
            console.error(`error upchptr ${error}`)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Handler to play selected video
    const handleSelectVideo = async (video) => {
        // setCurrentVideo(video);
        // setIsPlaying(true);
        const Video = await getChapterVideo({courseId:idCourse,chapterId:video.id})
        video.video = Video
        console.log("video",video)
        console.log("Video",Video)
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

    return (
        <Container
            fluid
            className="py-4 container-detail-course"
        >
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <h2
                        className="fw-bold my-3 title-course"
                    >
                        Title Online Course
                    </h2>
                </Col>
            </Row>

            {/* Main Content: Video Player & Playlist */}
            <Row>
                {/* Playlist Sidebar */}
                <Col
                    md={4}
                    className="mb-4 playlist-sidebar"
                >
                    <ListGroup variant="flush">
                        {course.chapters.map((video, idx) => (
                            <ListGroup.Item
                                key={idx}
                                active={currentVideo.title === video.title}
                                onClick={() => handleSelectVideo(video)}
                                style={{
                                    cursor: "pointer",
                                    background:
                                        currentVideo.title === video.title
                                            ? "#cc00cc"
                                            : hovered === video.title
                                            ? "#f1f5f9"
                                            : "transparent",
                                    color: currentVideo.title === video.title ? "#fff" : "#3b3b5c",
                                    border: "none",
                                    borderRadius: "12px",
                                    marginBottom: "8px",
                                    transition: "background 0.2s",
                                    boxShadow:
                                        currentVideo.title === video.title
                                            ? "0 2px 12px #a5b4fc"
                                            : "none",
                                }}
                                onMouseEnter={() => setHovered(video.title)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <Row className="align-items-center">
                                    {/* <Col xs={2} className="text-center">
                                        {video.watched || currentVideo.id === video.id ? (
                                            <FaCheckCircle color="#22c55e" size={22} />
                                        ) : (
                                            <FaPlayCircle color="#6366f1" size={22} />
                                        )}
                                    </Col> */}
                                    <Col>
                                        <div className="fw-semibold fs-5 py-2">{video.title}</div>
                                        {/* <div
                                            className="small"
                                            style={{
                                                color:
                                                    currentVideo.id === video.id
                                                        ? "#e0e7ff"
                                                        : "#64748b",
                                            }}
                                        >
                                            {video.duration}
                                        </div> */}
                                    </Col>
                                    {/* <Col xs={3} className="text-end">
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
                                    </Col> */}
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
                                "#cc00cc",
                            color: "#fff",
                            border: "none",
                        }}
                    >
                        {/* Video Player */}
                        <div className="video-player">
                            <video
                                src={currentVideo.video}
                                controls
                                autoPlay={isPlaying}
                                style={{
                                    width: "100%",
                                    height: "360px",
                                    objectFit: "cover",
                                    background: "#000",
                                }}
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
                                        className="mt-2"
                                        style={{
                                            fontSize: "1rem",
                                            color: "#e0e7ff",
                                            minHeight: "48px",
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
                </Col>
            </Row>
        </Container>
    );
};

export default EditCourse;