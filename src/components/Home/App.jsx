// import { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Button,
//   Card,
// } from "react-bootstrap";
// import { FaEdit, FaTrash, FaInfoCircle, FaPlusCircle, FaCrown, FaStar, FaRocket, FaBookOpen, FaShoppingCart, FaCheckCircle, FaLightbulb } from "react-icons/fa";
// import BrandHeader from "./BrandHeader";
// import InfoSection from "./InfoSection";
// import SubscriptionOffer from "./SubscriptionOffer";
// import NavbarComponent from "../NavbarComponent";
// import auth from "../../scripts/auth";
// import axios from "axios";
// import { server_url } from "../../scripts/url";
// import ConfirmSubscription from "./ConfirmSubscription";
// import { set_name,set_email,set_start_time,set_duration, set_role, profile_data } from "../../scripts/profiledataedit";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";

// const mainPurple = "#cc00cc";
// const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];

// function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString("id-ID", {
//     day: "2-digit",
//     month: "long",
//     year: "numeric",
//   });
// }

// export default function App() {
//   const [data, setData] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [authorized, setAuthorized] = useState(false)
//   const [error, setError] = useState(null)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [photo, setPhoto] = useState(null)
//   const profileData = useSelector(profile_data);
//   const dispatch = useDispatch();

//   const [editUser, setEditUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     photo: "",
//   })

//   // const [user, setUser] = useState(initialUser);
//   // const [courses, setCourses] = useState(initialCourses);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState({});

//   const formatToIDR = (number) => {
//     // Pastikan input berupa angka
//     const num = typeof number === 'string' ? parseFloat(number) : number;
    
//     // Memformat angka dengan memisahkan ribuan menggunakan titik dan desimal menggunakan koma
//     return num.toLocaleString('id-ID', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     });
//   }

//   const deleteCourse = async(id,title) => {
//           try {
//               const confirm = await Swal.fire({
//                   title:`Hapus course ${title}`,
//                   showCancelButton:true,
//                   cancelButtonColor:"blue",
//                   showConfirmButton:true,
//                   confirmButtonColor:"red",
//                   confirmButtonText:"Hapus",
//                   cancelButtonText:"Batal"
//               }).then(res=>res.isConfirmed)
//               if (!confirm) {
//                   return
//               }
//               const session = localStorage.getItem("session")
//               await axios.delete(`${server_url}/api/course/${id}`,{
//                   headers:{
//                       Authorization:"Bearer "+session
//                   }
//               })
//               await fetchData()
//           } catch (error) {
//               console.error(`error xchapter ${error}`)
//           }
//       }

//   const fetchData = async () => {
//     try {
//       setLoading(true)
//       const result = await auth()
//       if (result) {
//         const res = await axios.get(`${server_url}/api/user`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("session")}`
//           }
//         })
//         const result = await res.data
//         const { name,email,activation_time,photo,role } = result.user
//         if (activation_time) {
//           const { time,date } = JSON.parse(activation_time)
//           dispatch(set_start_time(time))
//           dispatch(set_duration(date))
//         }
//         dispatch(set_name(name))
//         dispatch(set_email(email))

//         setEditUser({
//           ...editUser,
//           name,
//           email,
//           photo
//         })

//         // await getPhoto()
//         if (role==="admin") {
//           dispatch(set_role("admin"))
//           setIsAdmin(true)
//         } else {
//           dispatch(set_role("user"))
//         }
//         setAuthorized(true)
//       }
//       const response = await axios.get(`${server_url}/api/courses`)
//       const res = await response.data
//       for (let i = 0; i < res.courses.length; i++) {
//         const price = res.courses[i].price
//         res.courses[i].price = formatToIDR(price)
//       }
//       setData(res.courses)
//       setLoading(false)
//     } catch (error) {
//       if (error.response && error.response.status === 500) {
//         setError("Internal Server Error")
//       }
//       console.error(`error app ${error}`)
//       setLoading(false)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleShowModal = (course) => {
//     console.log("course",course)
//     setSelectedCourse({...selectedCourse,...course});
//     setShowModal(true);
//   };

//   useEffect(()=>{
//     fetchData()
//   },[])

//   return (
//     <div style={{ background: accentColors[0], minHeight: "100vh" }}>
//       <NavbarComponent {...{editUser,loading,authorized,fetchData,setEditUser,isAdmin}}/>
//       <Container style={{ maxWidth: 1200, marginTop: 30 }}>
//         {loading ? (
//           <>
//             <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
//             <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
//             <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
//           </>
//         ) : (
//           <BrandHeader {...{isAdmin,authorized,profileData}} />
//         )}
//         <InfoSection {...{loading}}/>
//         <SubscriptionOffer {...{loading}}/>
//         <hr style={{ borderColor: mainPurple, margin: "40px 0" }} />
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           {loading ? (
//             <div className="bg-secondary loading rounded-5 px-5 py-2">&nbsp;</div>
//           ) : (
//             <h3 className="mb-0" style={{ color: mainPurple }}>
//               Daftar Kursus
//             </h3>
//           )}
//             {isAdmin&&(
//               <Link to={"/post/course"} className="text-decoration-none">
//                 <Button
//                   variant={loading?"secondary":""}
//                   style={{
//                     background: loading?"":mainPurple,
//                     border: "none",
//                     fontWeight: "bold",
//                     borderRadius: 24,
//                     boxShadow: "0 2px 8px rgba(204,0,204,0.10)",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 8,
//                     fontSize: 18,
//                     padding: "8px 20px",
//                   }}
//                   disabled={loading}
//                   className={loading?"loading":""}
//                 >
//                   {loading ? (
//                     <div className="bg-secondary loading px-5">&nbsp;</div>
//                   ) : (
//                     <div className="text-light">
//                       <FaPlusCircle className="me-2" /> Tambah Kursus Baru
//                     </div>
//                   )}
//                 </Button>
//               </Link>
//             )}
//         </div>
//         <Row className="g-4">
//           {data&&data.length>0&&data.map((course,key) => (
//             <Col md={4} key={key}>
//               <Card
//                 style={{
//                   borderColor: loading?"":mainPurple,
//                   background: loading?"":"#e0b3ff",
//                   boxShadow: "0 2px 12px rgba(204,0,204,0.07)",
//                   transition: loading?"":"transform 0.15s",
//                 }}
//                 className={loading?"h-100 shadow-sm course-card bg-secondary loading":"h-100 shadow-sm course-card"}
//               >
//                 {loading ? (
//                   <div className="bg-secondary loading m-3 rounded-3 p-5">&nbsp;</div>
//                 ) : (
//                   <>
//                     <Card.Img
//                       variant="top"
//                       src={`${server_url}/courses/thumbnails/${course.image}`}
//                       alt={course.title}
//                       style={{ height: 180, objectFit: "cover" }}
//                     />
//                     <Card.Body>
//                       <Card.Title style={{ color: mainPurple }}>{course.title}</Card.Title>
//                       <Card.Text>{course.description.substring(0,100)}....</Card.Text>
//                       <div className="d-flex justify-content-between align-items-center mt-3">
//                         <Link to={`/detail/course/${course.courseId}`}>
//                           <Button
//                             variant="outline-primary"
//                             style={{
//                               borderColor: mainPurple,
//                               color: mainPurple,
//                               fontWeight: "bold",
//                               borderRadius: 20,
//                               transition: "background 0.2s, color 0.2s",
//                             }}
//                           >
//                             <FaInfoCircle className="me-1" /> Info Selengkapnya
//                           </Button>
//                         </Link>
//                         {isAdmin ? (
//                           <div className="d-flex gap-2 m-2">
//                             <Link
//                               to={`detail/course/${course.courseId}`}
//                             >
//                               <Button
//                                 variant="outline-success"
//                                 size="sm"
//                                 style={{
//                                   borderRadius: 20,
//                                   fontWeight: "bold",
//                                   borderWidth: 2,
//                                   borderColor: "#28a745",
//                                   color: "#28a745",
//                                   background: "#eaffea",
//                                   transition: "background 0.2s, color 0.2s",
//                                 }}
//                               >
//                                 <FaEdit className="me-1" /> Edit
//                               </Button>
//                             </Link>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               style={{
//                                 borderRadius: 20,
//                                 fontWeight: "bold",
//                                 borderWidth: 2,
//                                 borderColor: "#dc3545",
//                                 color: "#dc3545",
//                                 background: "#fff0f3",
//                                 transition: "background 0.2s, color 0.2s",
//                               }}
//                               onClick={() => deleteCourse(course.courseId,course.title)}
//                             >
//                               <FaTrash className="me-1" /> Hapus
//                             </Button>
//                           </div>
//                         ) : (<Button
//                               variant="gradient"
//                               style={{
//                                 background: "linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)",
//                                 color: "#fff",
//                                 fontWeight: 700,
//                                 border: "none",
//                                 borderRadius: 24,
//                                 boxShadow: "0 4px 16px rgba(255,117,140,0.18)",
//                                 fontSize: 18,
//                                 transition: "transform 0.12s, box-shadow 0.12s, background 0.18s",
//                                 outline: "none",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 10,
//                                 letterSpacing: 0.5,
//                               }}
//                               className="purchase-btn p-2 mx-2"
//                               onClick={() => handleShowModal(course)}
//                               onMouseOver={e => {
//                                 e.currentTarget.style.transform = "scale(1.06)";
//                                 e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,117,140,0.22)";
//                                 e.currentTarget.style.background =
//                                   "linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%)";
//                               }}
//                               onMouseOut={e => {
//                                 e.currentTarget.style.transform = "scale(1)";
//                                 e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,117,140,0.18)";
//                                 e.currentTarget.style.background =
//                                   "linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)";
//                               }}
//                             >
//                               <FaShoppingCart style={{ fontSize: 20}} />
//                               <span>Langganan Sekarang</span>
//                             </Button>
//                           )}
//                       </div>
//                     </Card.Body>
//                   </>
//                 )}
//               </Card>
//             </Col>
//           ))}
//         </Row>
//         <ConfirmSubscription {...{showModal,setShowModal,course:selectedCourse,courses:data}}/>
//       </Container>
//       <footer
//         className="text-center py-4 mt-5"
//         style={{
//           background: mainPurple,
//           color: "#fff",
//           letterSpacing: 1,
//           fontWeight: 500,
//         }}
//       >
//         &copy; {new Date().getFullYear()} CodeBeginner. Belajar Programming dengan Mudah dan Nyaman.
//       </footer>
//     </div>
//   );
// }

// ```markdown
// # Profil Pengguna

// Berikut adalah contoh kode halaman profil interaktif menggunakan React, React-Bootstrap, dan Bootstrap. Pastikan Anda sudah menginstal `react-bootstrap`, `bootstrap`, dan `react-icons` (jika diperlukan).

// ```bash
// npm install react-bootstrap bootstrap react-icons
// ```

// **Import Bootstrap di entry point (misal: `main.jsx` atau `index.js`):**
// ```js
// import 'bootstrap/dist/css/bootstrap.min.css';
// ```

// ---

// ## Komponen Profil

import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form, Badge, Image } from "react-bootstrap";

const defaultProfile = {
    name: "John Doe",
    title: "Frontend Web Developer",
    bio: "Passionate about crafting beautiful and interactive web experiences. Always learning, always building.",
    skills: ["React", "Vite", "Bootstrap", "JavaScript", "UI/UX"],
    avatar: "https://i.pravatar.cc/200?img=3",
    location: "Jakarta, Indonesia",
    email: "john.doe@email.com",
    theme: "#6f42c1"
};

export default function App() {
    const [profile, setProfile] = useState(defaultProfile);
    const [showEdit, setShowEdit] = useState(false);
    const [editProfile, setEditProfile] = useState(profile);

    const handleEdit = () => setShowEdit(true);
    const handleClose = () => setShowEdit(false);
    const handleSave = () => {
        setProfile(editProfile);
        setShowEdit(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    return (
        <Container className="py-5" style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${profile.theme} 0%, #f8f9fa 100%)` }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg border-0 rounded-4">
                        <Card.Body className="text-center">
                            <Image src={profile.avatar} roundedCircle width={120} className="mb-3 border border-4" style={{ borderColor: profile.theme }} />
                            <h2 className="fw-bold">{profile.name}</h2>
                            <h5 className="text-muted mb-3">{profile.title}</h5>
                            <p className="mb-4">{profile.bio}</p>
                            <div className="mb-3">
                                {profile.skills.map((skill, idx) => (
                                    <Badge key={idx} bg="secondary" className="me-2 mb-1">{skill}</Badge>
                                ))}
                            </div>
                            <div className="mb-3">
                                <span className="me-3"><i className="bi bi-geo-alt"></i> {profile.location}</span>
                                <span><i className="bi bi-envelope"></i> {profile.email}</span>
                            </div>
                            <Button variant="outline-primary" onClick={handleEdit}>Edit Profile</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal Edit */}
            <Modal show={showEdit} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={editProfile.name} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" value={editProfile.title} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control as="textarea" rows={2} name="bio" value={editProfile.bio} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Skills (comma separated)</Form.Label>
                            <Form.Control name="skills" value={editProfile.skills.join(", ")} onChange={e => setEditProfile({ ...editProfile, skills: e.target.value.split(",").map(s => s.trim()) })} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Avatar URL</Form.Label>
                            <Form.Control name="avatar" value={editProfile.avatar} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" value={editProfile.location} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" value={editProfile.email} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Theme Color</Form.Label>
                            <Form.Control type="color" name="theme" value={editProfile.theme} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}