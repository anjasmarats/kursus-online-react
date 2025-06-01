import { useCallback, useEffect, useState } from "react";
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
    Card,
    Button,
} from "react-bootstrap";
import {
    FaEdit,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import auth from "../../scripts/auth";
import { server_url } from "../../scripts/url";
import ListChapters from "./ListChapters";
import ModalDetailVideo from "./ModalDetailVideo";
import { persistor } from "../../app/store";
import { profile_data, set_duration, set_email, set_name, set_role, set_start_time } from "../../scripts/profiledataedit";
import { useDispatch, useSelector } from "react-redux";

// Main component
const DetailCourse = () => {
    const profileData = useSelector(profile_data);
    const [loading,setLoading] = useState(false)
    const [currentVideo, setCurrentVideo] = useState({});
    const [thumbnail,setThumbnail] = useState()
    const [isPlaying, setIsPlaying] = useState(true);
    const [hovered, setHovered] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
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

    const viewChapter = useCallback((title,video,chapterNote,chapterId)=>{
        try {
            console.info("title",title,"video",video,"chapterNote",chapterNote,"chapterid",chapterId)
            if (!title||!video) return
            setChapter({...chapter,id:chapterId,courseId:idCourse,title,video,chapterNote })
            setShow(true)
        } catch (error) {
            console.error(`error vchptr ${error}`)
        }
    },[chapter])

    const closeViewChapter =useCallback(()=>{
        try {
            setShow(false)
            setChapter({})
        } catch (error) {
            console.error(`error xviewchapter ${error}`)
        }
    },[])

    const editCourse = useCallback(async(e) => {
        try {
            e.preventDefault()
            const result = await auth()
            if (!result) {
                await persistor.purge()
                dispatch(set_name(""))
                dispatch(set_email(""))
                dispatch(set_duration(""))
                dispatch(set_start_time(""))
                dispatch(set_role(""))
                navigate("/")
            }
            console.log("editCourse")
            if (!course.title||!course.price||!course.description) {
                return
            }

            const session = localStorage.getItem("session")

            const formData = new FormData()
            formData.append("title",course.title)
            formData.append("price",course.price)
            formData.append("description",course.description)
            formData.append("image",course.thumbnail)

            const res = await axios.put(`${server_url}/api/course/${idCourse}`,formData,{
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
        }
    },[course.title,course.description,course.thumbnail,course.price])

    const dispatch = useDispatch()

    const editChapter = useCallback(async(e) => {
        try {
            e.preventDefault()
            const result = await auth()
            if (!result) {
                await persistor.purge()
                dispatch(set_name(""))
                dispatch(set_email(""))
                dispatch(set_duration(""))
                dispatch(set_start_time(""))
                dispatch(set_role(""))
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
            formData.append("courseTitle",course.title)

            console.log("chapter edit",chapter)

            const res = await axios.put(`${server_url}/api/course/${idCourse}/chapter/${chapter.id}`,formData,{
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

    const fetchData = useCallback(async () => {
        try {
            // let chapters=[]
          setLoading(true)
          const result = await auth()
          if (!result) {
            await persistor.purge()
            dispatch(set_name(""))
            dispatch(set_email(""))
            dispatch(set_duration(""))
            dispatch(set_start_time(""))
            dispatch(set_role(""))
          }
          const response = await axios.get(`${server_url}/api/course/${id}`)
          const res = await response.data
          const { courseId,title,description,image,price,Chapters } = res.course
            console.log("res.course",res.course)
          setIdCourse(courseId)
          setCourse({...course,title,description,price,chapters:[...Chapters],thumbnail:image})
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
      },[course])

    const deleteChapter = useCallback(async(title,id) => {
        try {
            const confirm = await Swal.fire({
                title:`Hapus chapter ${title}`,
                showCancelButton:true,
                cancelButtonColor:"blue",
                showConfirmButton:true,
                confirmButtonColor:"red",
                confirmButtonText:"Hapus",
                cancelButtonText:"Batal"
            }).then(res=>res.isConfirmed)
            if (!confirm) {
                return
            }
            const session = localStorage.getItem("session")
            await axios.delete(`${server_url}/api/course/${idCourse}/chapter/${id}`,{
                headers:{
                    Authorization:"Bearer "+session
                }
            })
            await fetchData()
        } catch (error) {
            console.error(`error xchapter ${error}`)
        }
    },[idCourse,fetchData])

    const courseEdit = ()=>{
        setThumbnail(`${server_url}/courses/thumbnails/${course.thumbnail}`)
        setShowFormEditCourse(true)
        setShow(true)
    }
  
    // 3. Tentukan apakah deskripsi perlu dipotong atau tidak
    // Ini akan menjadi 'true' jika panjang deskripsi melebihi batas yang ditentukan
    
    // 5. Fungsi untuk menangani klik tombol "Baca Selengkapnya" atau "Baca Lebih Sedikit"
    const handleToggleDescription = () => {
        // Membalik nilai 'showFullDescription' setiap kali tombol diklik
        setShowFullDescription(!showFullDescription);
    };

    useEffect(() => {
        fetchData()
    }, [])

    // Handler to play selected video
    const handleSelectVideo = useCallback((video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    },[]);

    // Handler for next/previous video
    const handleNextPrev = useCallback((direction) => {
        const idx = course.chapters.findIndex((v) => v.id === currentVideo.id);
        let newIdx = direction === "next" ? idx + 1 : idx - 1;
        if (newIdx < 0) newIdx = course.chapters.length - 1;
        if (newIdx >= course.chapters.length) newIdx = 0;
        setCurrentVideo(course.chapters[newIdx]);
        setIsPlaying(true);
    },[course.chapters]);

    const changeThumbnail =useCallback((thumbnail)=>{
        if (!thumbnail) return
        setThumbnail(URL.createObjectURL(thumbnail))
        setCourse({
            ...course,
            thumbnail,
        });
    },[course])

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
            <Card className="course-card shadow-sm border-0 rounded-lg">
            {/* 7. Card.Body sebagai isi dari Card */}
            <Card.Body>
                {/* 8. Judul Kursus */}
                <Card.Title className="course-title mb-3">
                    <Row>
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
                        {profileData.role==="admin"&&(<Col className="text-end">
                            <FaEdit size={36} onClick={()=>courseEdit()} style={{cursor:"pointer"}}/>
                        </Col>)}
                    </Row>
                </Card.Title>

                {/* 9. Teks Deskripsi Kursus */}
                {/* Tambahkan class 'course-description' untuk styling kustom */}
                <Card.Text className="course-description mb-3">
                {showFullDescription || course.description.length<=160
                ? course.description
                : `${course.description.substring(0, 160)}...`}
                </Card.Text>

                {/* 10. Tombol "Baca Selengkapnya" / "Baca Lebih Sedikit" */}
                {/* Hanya tampilkan tombol jika deskripsi memang perlu dipotong */}
                {course.description.length>160 && (
                <Button
                    variant="outline-none text-primary" // Gaya tombol dari Bootstrap
                    onClick={handleToggleDescription} // Panggil fungsi saat tombol diklik
                    className="toggle-description-btn" // Class untuk styling kustom
                    size="sm" // Ukuran tombol kecil
                >
                    {/* Teks tombol berubah berdasarkan state 'showFullDescription' */}
                    {showFullDescription ? (
                    <>
                        {/* Anda bisa menambahkan ikon di sini, contoh: <BsChevronUp className="me-1" /> */}
                        Baca Lebih Sedikit
                    </>
                    ) : (
                    <>
                        {/* Anda bisa menambahkan ikon di sini, contoh: <BsChevronDown className="me-1" /> */}
                        Baca Selengkapnya
                    </>
                    )}
                </Button>
                )}
            </Card.Body>
            </Card>
            {/* Header */}
            <Row className="mb-4 align-items-center">
                
            </Row>

            {/* Main Content: Video Player & Playlist */}
            <ListChapters {...{
                isPlaying,
                hovered,
                setHovered,
                viewChapter,
                deleteChapter,
                handleSelectVideo,
                handleNextPrev,
                setChapter,
                loading,
                chapters:course.chapters,
                currentVideo,
                chapter,
                setShow,
                thumbnail:course.thumbnail
            }}/>

            {/* Edit Chapter Modal (already implemented below, but here's a standalone, improved version for clarity) */}
            <ModalDetailVideo {...{
                show,
                closeViewChapter,
                showFormEditCourse,
                editCourse,
                editChapter,
                thumbnail,
                chapter,
                setCourse,
                setChapter,
                course,
                changeThumbnail,
                loading,
                setThumbnail
            }}/>
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