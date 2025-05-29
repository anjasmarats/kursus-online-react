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

    const editChapter = useCallback(async(e) => {
        try {
            e.preventDefault()
            if (!chapter.title) {
                return
            }

            const session = localStorage.getItem("session")

            const formData = new FormData()
            formData.append("title",chapter.title)
            formData.append("video",chapter.video)
            formData.append("chapterNote",chapter.chapterNote)

            const res = await axios.put(`${server_url}/api/chapter/${chapter.id}`,formData,{
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
    },[chapter.title,chapter.chapterNote,chapter.video])

    // const getChapterVideo = async(data)=>{
    //     try {
    //         console.log("idCourse",idCourse)
    //         const { courseId,chapterId } = data
    //         // const res = await fetch(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
    //         //     method: 'GET',
    //         //     headers: {
    //         //     "Authorization": `Bearer ${localStorage.getItem("session")}`
    //         //     }
    //         // })

    //         const response = await axios.get(`${server_url}/api/course/${courseId}/chapter/${chapterId}/video`, {
    //             responseType: 'blob', // Ini sangat penting!
    //             headers:{
    //                 Authorization:`Bearer ${localStorage.getItem("session")}`
    //             }
    //         });
        
    //         if (response.status===200) {
    //             // Ekstrak nama file dari header Content-Disposition jika ada,
    //             // atau gunakan nama file yang kita minta.
    //             // Header Content-Disposition biasanya seperti: "attachment; filename="nama-asli-file.ekstensi""
    //             const contentDisposition = response.headers['content-disposition'];
    //             let actualFileName = fileNameToDownload; // Default

    //             if (contentDisposition) {
    //                 const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
    //                 if (filenameMatch && filenameMatch.length > 1) {
    //                 actualFileName = filenameMatch[1];
    //                 }
    //             }
                
    //             console.log('Response headers:', response.headers);
    //             console.log('Nama file yang akan diunduh:', actualFileName);

    //             // Buat URL objek dari blob
    //             // Blob adalah objek mirip file yang berisi data mentah (immutable).
    //             const url = window.URL.createObjectURL(new Blob([response.data]));
    //             return url
    //         }
    //     } catch (error) {
    //       setError("Error")
    //       if (error.response) {
    //         console.error("error app = "+error)
    //       }
    //       console.error(`error app ${error}`)
    //       setLoading(false)
    //     } finally {
    //       setLoading(false)
    //     }
    //   }

    //   const getThumbnail = async(data)=>{
    //     try {
    //       const res = await fetch(`${server_url}/api/course/photo`, {
    //         method: 'GET',
    //         headers: {
    //           "Authorization": `Bearer ${data}`
    //         }
    //       })
          
    //       if (res.status === 500) {
    //         setError("Internal Server Error")
    //         return
    //       }
    
    //       if (res.status===200) {
    //         const blob = await res.blob()
    //         return URL.createObjectURL(blob)
    //       }
    //     } catch (error) {
    //       setError("Error")
    //       console.error(`error app ${error}`)
    //       setLoading(false)
    //     } finally {
    //       setLoading(false)
    //     }
    //   }

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
        setThumbnail(`${server_url}/courses/thumbnails/${course.thumbnail}`)
        setShowFormEditCourse(true)
        setShow(true)
    }

    console.log("showformeditcourse",showFormEditCourse)

    useEffect(() => {
        fetchData()
    }, [])

    // Handler to play selected video
    const handleSelectVideo = useCallback((video) => {
        setCurrentVideo(video);
        setIsPlaying(true);
    },[]);

    // // Handler to toggle play/pause
    // const handlePlayPause = () => {
    //     setIsPlaying((prev) => !prev);
    // };

    // // Handler to toggle favorite
    // const handleFavorite = (id) => {
    //     setFavorites((prev) =>
    //         prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    //     );
    // };

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