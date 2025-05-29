import { useEffect, useState } from "react";
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
    Button,
    OverlayTrigger,
    Tooltip,
    Modal
} from "react-bootstrap";
import {
    FaPlayCircle,
    FaChevronRight,
    FaChevronLeft,
    FaEdit,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { MdModeEditOutline } from "react-icons/md"
import { RiDeleteBin5Fill } from "react-icons/ri";
import auth from "../scripts/auth";
import { server_url } from "../scripts/url";

// Sample video data (replace with your API or props)
// const videoList = [
//     {
//         id: 1,
//         title: "Introduction to React",
//         duration: "5:32",
//         watched: true,
//         url: "https://www.w3schools.com/html/mov_bbb.mp4",
//         description: "Get started with the basics of React and component structure.",
//     },
//     {
//         id: 2,
//         title: "JSX & Rendering",
//         duration: "8:21",
//         watched: false,
//         url: "https://www.w3schools.com/html/movie.mp4",
//         description: "Learn how JSX works and how to render elements dynamically.",
//     },
//     {
//         id: 3,
//         title: "State & Props",
//         duration: "10:05",
//         watched: false,
//         url: "https://www.w3schools.com/html/mov_bbb.mp4",
//         description: "Understand state management and passing data via props.",
//     },
//     {
//         id: 4,
//         title: "Hooks Deep Dive",
//         duration: "12:47",
//         watched: false,
//         url: "https://www.w3schools.com/html/movie.mp4",
//         description: "Explore React hooks for powerful functional components.",
//     },
// ];

// Main component
const DetailCourse = () => {
    const [loading,setLoading] = useState(false)
    const [currentVideo, setCurrentVideo] = useState({});
    const [thumbnail,setThumbnail] = useState()
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
    const [showFormEditCourse,setShowFormEditCourse] = useState(false)

    const navigate = useNavigate()

    const [show,setShow] = useState(false)

    const [chapter,setChapter] = useState({
        id:0,
        title:'',
        video:null,
        chapterNote:''
    })

    const [error,setError] = useState(false)

    const viewChapter = async(title,video,chapterNote,chapterId)=>{
        try {
            console.info("title",title,"video",video,"chapterNote",chapterNote,"chapterid",chapterId)
            if (!title||!video) return
            const videoPreview = await getChapterVideo({chapterId,courseId:idCourse})
            setChapter({...chapter,id:chapterId,courseId:idCourse,title,video:videoPreview,chapterNote })
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

    const editCourse = async(e) => {
        try {
            e.preventDefault()
            console.log("editCourse")
            if (!course.title||!course.price||!course.description) {
                return
            }

            const formData = new FormData()
            formData.append("title",course.title)
            formData.append("price",course.price)
            formData.append("description",course.description)
            formData.append("image",course.thumbnail)

            const res = await axios.put(`${server_url}/api/course/${idCourse}`,formData,{
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("session")
                }
            })
            if (res.status===200) {
                closeViewChapter()
                await fetchData()
            }
        } catch (error) {
            console.error("error edit course",error)            
        }
    }

    const editChapter = async(e) => {
        try {
            e.preventDefault()
            if (!chapter.title) {
                return
            }

            const formData = new FormData()
            formData.append("title",chapter.title)
            formData.append("video",chapter.video)
            formData.append("chapterNote",chapter.chapterNote)

            const res = await axios.put(`${server_url}/api/chapter/${chapter.id}`,formData,{
                headers:{
                    Authorization:"Bearer "+localStorage.getItem("session")
                }
            })
            if (res.status===200) {
                closeViewChapter()
                await fetchData()
            }
        } catch (error) {
            console.error("error edit course",error)            
        }
    }

    const getChapterVideo = async(data)=>{
        try {
            console.log("idCourse",idCourse)
            const { courseId,chapterId } = data
            // const res = await fetch(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
            //     method: 'GET',
            //     headers: {
            //     "Authorization": `Bearer ${localStorage.getItem("session")}`
            //     }
            // })

            const response = await axios.get(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
                responseType: 'blob', // Ini sangat penting!
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("session")}`
                }
            });
        
            if (response.status===200) {
                // Ekstrak nama file dari header Content-Disposition jika ada,
                // atau gunakan nama file yang kita minta.
                // Header Content-Disposition biasanya seperti: "attachment; filename="nama-asli-file.ekstensi""
                const contentDisposition = response.headers['content-disposition'];
                let actualFileName = fileNameToDownload; // Default

                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                    if (filenameMatch && filenameMatch.length > 1) {
                    actualFileName = filenameMatch[1];
                    }
                }
                
                console.log('Response headers:', response.headers);
                console.log('Nama file yang akan diunduh:', actualFileName);

                // Buat URL objek dari blob
                // Blob adalah objek mirip file yang berisi data mentah (immutable).
                const url = window.URL.createObjectURL(new Blob([response.data]));
                return url
            }
        } catch (error) {
          setError("Error")
          if (error.response) {
            console.error("error app = "+error)
          }
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
          const { courseId,title,description,image,price,Chapters } = res.course
            console.log("res.course",res.course)
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

    const courseEdit = ()=>{
        setThumbnail(course.thumbnail)
        setShowFormEditCourse(true)
        setShow(true)
    }

    console.log("showformeditcourse",showFormEditCourse)

    useEffect(() => {
        fetchData()
    }, [])

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

    const changeThumbnail =(thumbnail)=>{
        if (!thumbnail) return
        setThumbnail(URL.createObjectURL(thumbnail))
        setCourse({
            ...course,
            thumbnail,
        });
    }

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
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2
                        className="fw-bold"
                        style={{
                            letterSpacing: "1px",
                            color: "#3b3b5c",
                            textShadow: "0 2px 8px #e0e7ff",
                        }}
                    >
                        {!loading&&course.title}
                    </h2>
                </Col>
                <Col className="text-end"><FaEdit size={36} onClick={()=>courseEdit()}/></Col>
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
                    <ListGroup variant="flush">
                        {loading&&(
                            <>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                                <Row className="bg-secondary py-4 rounded-3 m-2" style={{ animation:"loading 1.5s infinite" }}>&nbsp;</Row>
                            </>
                        )}
                        {!loading&&course.chapters.map((video, idx) => (
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
                                    <Col xs={3} className="text-end">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip>
                                                    hai
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
                                                    hai
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
                                                <RiDeleteBin5Fill color={currentVideo.id === video.id?"white":"#cc00cc"} size={28}/>
                                            </span>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
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
                )}
            </Row>

            {/* Edit Chapter Modal (already implemented below, but here's a standalone, improved version for clarity) */}
            <Modal
                show={show}
                onHide={closeViewChapter}
                centered
                size="lg"
                backdrop="static"
                contentClassName="border-0"
            >
                <form onSubmit={showFormEditCourse?editCourse:editChapter}>
                    <Modal.Header
                        closeButton
                        style={{
                            background: "#f8fafc",
                            borderBottom: "2px solid #cc00cc",
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                        }}
                    >
                        <Modal.Title
                            className="fw-bold"
                            style={{
                                color: "#cc00cc",
                                letterSpacing: 1,
                                fontSize: "1.5rem",
                            }}
                        >
                            {showFormEditCourse?"Edit Course":"Edit Chapter"}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{
                            background: "#f8fafc",
                            borderBottomLeftRadius: 18,
                            borderBottomRightRadius: 18,
                        }}
                    >
                        {/* Video Preview */}
                        <div className="mb-4 text-center">
                            {showFormEditCourse ? (
                                <img
                                    src={thumbnail}
                                    controls
                                    style={{
                                        width: "100%",
                                        maxWidth: 480,
                                        borderRadius: 16,
                                        boxShadow: "0 2px 16px #cc00cc44",
                                        background: "#000",
                                        border: "2px solid #cc00cc",
                                    }}
                                />
                            ) : chapter.video ? (
                                <video
                                    src={
                                        typeof chapter.video === "string"
                                            ? chapter.video
                                            : URL.createObjectURL(chapter.video)
                                    }
                                    controls
                                    style={{
                                        width: "100%",
                                        maxWidth: 480,
                                        borderRadius: 16,
                                        boxShadow: "0 2px 16px #cc00cc44",
                                        background: "#000",
                                        border: "2px solid #cc00cc",
                                    }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "100%",
                                        maxWidth: 480,
                                        height: 220,
                                        borderRadius: 16,
                                        margin: "0 auto",
                                        color: "#cc00cc",
                                        fontSize: 18,
                                        border: "2px dashed #cc00cc",
                                        background: "#f3e8ff",
                                    }}
                                >
                                    No Video Preview
                                </div>
                            )}
                        </div>
                        {/* Edit Form */}
                            <div className="mb-3">
                                <label
                                    htmlFor="chapterTitle"
                                    className="form-label fw-semibold"
                                    style={{ color: "#cc00cc" }}
                                >
                                    {showFormEditCourse?"Course title":"Chapter Name"}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="chapterTitle"
                                    placeholder={showFormEditCourse?"Enter course title":"Enter chapter name"}
                                    value={showFormEditCourse?course.title:chapter.title}
                                    onChange={e =>{
                                            if (showFormEditCourse) {
                                                setCourse({...course, title: e.target.value})
                                            } else {
                                                setChapter({ ...chapter, title: e.target.value })
                                            }
                                        }
                                    }
                                    autoFocus
                                    required
                                    style={{
                                        border: "2px solid #cc00cc",
                                        borderRadius: 8,
                                        background: "#fff0fa",
                                        color: "#3b3b5c",
                                        fontWeight: 500,
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="coursePrice"
                                    className="form-label fw-semibold"
                                    style={{ color: "#cc00cc" }}
                                >
                                    {"Harga course"}
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="coursePrice"
                                    placeholder={"Enter course price"}
                                    value={course.price}
                                    onChange={e =>
                                        setCourse({...course, price: e.target.value})
                                    }
                                    autoFocus
                                    required
                                    style={{
                                        border: "2px solid #cc00cc",
                                        borderRadius: 8,
                                        background: "#fff0fa",
                                        color: "#3b3b5c",
                                        fontWeight: 500,
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="chapterNote"
                                    className="form-label fw-semibold"
                                    style={{ color: "#cc00cc" }}
                                >
                                    Chapter Note
                                </label>
                                <textarea
                                    required={showFormEditCourse}
                                    className="form-control"
                                    id="chapterNote"
                                    rows={3}
                                    placeholder={showFormEditCourse?"Write notes or description for this course":"Write notes or description for this chapter"}
                                    value={showFormEditCourse?course.description:chapter.chapterNote}
                                    onChange={e =>{
                                            if (showFormEditCourse) {
                                                setCourse({...course, description: e.target.value})
                                            } else {
                                                setChapter({ ...chapter, chapterNote: e.target.value })
                                            }
                                        }
                                    }
                                    style={{
                                        border: "2px solid #cc00cc",
                                        borderRadius: 8,
                                        background: "#fff0fa",
                                        color: "#3b3b5c",
                                        fontWeight: 500,
                                    }}
                                />
                            </div>
                            {showFormEditCourse?(
                                <div className="mb-3">
                                    <label
                                        htmlFor="courseTitle"
                                        className="form-label fw-semibold"
                                        style={{ color: "#cc00cc" }}
                                    >
                                        Upload New Thumbnail{" "}
                                        <span className="text-muted small">(optional)</span>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="courseTitle"
                                        accept="image/png"
                                        onChange={e =>changeThumbnail(e.target.files[0])}
                                        style={{
                                            border: "2px solid #cc00cc",
                                            borderRadius: 8,
                                            background: "#fff0fa",
                                            color: "#3b3b5c",
                                            fontWeight: 500,
                                        }}
                                    />
                                    <div className="form-text" style={{ color: "#cc00cc" }}>
                                        Choose a new video file to replace the current one.
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-3">
                                    <label
                                        htmlFor="chapterVideo"
                                        className="form-label fw-semibold"
                                        style={{ color: "#cc00cc" }}
                                    >
                                        Upload New Video{" "}
                                        <span className="text-muted small">(optional)</span>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="chapterVideo"
                                        accept="video/mp4"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setChapter({
                                                    ...chapter,
                                                    video: e.target.files[0],
                                                });
                                            }
                                        }}
                                        style={{
                                            border: "2px solid #cc00cc",
                                            borderRadius: 8,
                                            background: "#fff0fa",
                                            color: "#3b3b5c",
                                            fontWeight: 500,
                                        }}
                                    />
                                    <div className="form-text" style={{ color: "#cc00cc" }}>
                                        Choose a new video file to replace the current one.
                                    </div>
                                </div>
                            )}
                    </Modal.Body>
                    <Modal.Footer
                        style={{
                            background: "#f8fafc",
                            borderTop: "2px solid #cc00cc",
                            borderBottomLeftRadius: 18,
                            borderBottomRightRadius: 18,
                        }}
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={closeViewChapter}
                            style={{
                                borderColor: "#cc00cc",
                                color: "#cc00cc",
                                borderRadius: 8,
                                fontWeight: 600,
                                minWidth: 100,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            style={{
                                background: "linear-gradient(90deg, #cc00cc 0%, #6d28d9 100%)",
                                border: "none",
                                borderRadius: 8,
                                minWidth: 140,
                                fontWeight: 700,
                                letterSpacing: 1,
                                boxShadow: "0 2px 8px #cc00cc44",
                            }}
                            disabled={showFormEditCourse?(!course.title||!course.description||!course.price):!chapter.title}
                        >
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </Container>
    );
};

export default DetailCourse;

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