import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Image
} from "react-bootstrap";
import { FaEdit, FaTrash, FaInfoCircle, FaPlusCircle, FaCrown, FaStar, FaRocket, FaBookOpen, FaShoppingCart, FaCheckCircle, FaLightbulb } from "react-icons/fa";
import BrandHeader from "./BrandHeader";
import InfoSection from "./InfoSection";
import SubscriptionOffer from "./SubscriptionOffer";
import NavbarComponent from "../NavbarComponent";
import auth from "../../scripts/auth";
import axios from "axios";
import { server_url } from "../../scripts/url";
import ConfirmSubscription from "./ConfirmSubscription";

const mainPurple = "#cc00cc";
const accentColors = ["#f3e6ff", "#e0b3ff", "#e0b3ff", "#fff0f6"];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function App() {
    const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    start_time: "",
    duration: "",
    photo: "",
  })

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  })

  // const [user, setUser] = useState(initialUser);
  // const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState({});

  const formatToIDR = (number) => {
    // Pastikan input berupa angka
    const num = typeof number === 'string' ? parseFloat(number) : number;
    
    // Memformat angka dengan memisahkan ribuan menggunakan titik dan desimal menggunakan koma
    return num.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const deleteCourse = async(id,title) => {
          try {
              const confirm = await Swal.fire({
                  title:`Hapus course ${title}`,
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
              await axios.delete(`${server_url}/api/course/${id}`,{
                  headers:{
                      Authorization:"Bearer "+session
                  }
              })
              await fetchData()
          } catch (error) {
              console.error(`error xchapter ${error}`)
          }
      }

  const fetchData = async () => {
    try {
      setLoading(true)
      const {result,adminuser} = await auth()
      if (result) {
        const res = await axios.get(`${server_url}/api/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session")}`
          }
        })
        const result = await res.data
        const { name,email,activation_time,photo } = result.user
        if (activation_time) {
          const { time,date } = JSON.parse(activation_time)
          setProfileData({
            ...profileData,
            start_time: date,
            duration: time?JSON.parse(time).month:"",
          })
        }
        setProfileData({
          ...profileData,
          name,
          email,
          photo
        })

        setEditUser({
          ...editUser,
          name,
          email,
          photo
        })

        // await getPhoto()
        if (adminuser) {
          setIsAdmin(true)
        }
        setAuthorized(true)
      }
      const response = await axios.get(`${server_url}/api/courses`)
      const res = await response.data
      for (let i = 0; i < res.courses.length; i++) {
        const price = res.courses[i].price
        res.courses[i].price = formatToIDR(price)
      }
      setData(res.courses)
      setLoading(false)
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError("Internal Server Error")
      }
      console.error(`error app ${error}`)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleShowModal = (course) => {
    console.log("course",course)
    setSelectedCourse({...selectedCourse,...course});
    setShowModal(true);
  };

  useEffect(()=>{
    fetchData()
  },[])

  return (
    <div style={{ background: accentColors[0], minHeight: "100vh" }}>
      <NavbarComponent {...{editUser,loading,authorized,fetchData,setEditUser,isAdmin}}/>
      <Container style={{ maxWidth: 1200, marginTop: 30 }}>
        <BrandHeader {...{isAdmin,authorized,profileData}} />
        <InfoSection />
        <SubscriptionOffer />
        <hr style={{ borderColor: mainPurple, margin: "40px 0" }} />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0" style={{ color: mainPurple }}>
            Daftar Kursus
          </h3>
          {/* {user.role === "admin" && (
            <Button
              style={{
                background: mainPurple,
                border: "none",
                fontWeight: "bold",
                borderRadius: 24,
                boxShadow: "0 2px 8px rgba(204,0,204,0.10)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 18,
                padding: "8px 20px",
              }}
              href="/post/course"
            >
              <FaPlusCircle className="me-2" /> Tambah Kursus Baru
            </Button>
          )} */}
        </div>
        <Row className="g-4">
          {data&&data.length>0&&data.map((course,key) => (
            <Col md={4} key={key}>
              <Card
                style={{
                  borderColor: mainPurple,
                  background: "#e0b3ff",
                  boxShadow: "0 2px 12px rgba(204,0,204,0.07)",
                  transition: "transform 0.15s",
                }}
                className="h-100 shadow-sm course-card"
              >
                <Card.Img
                  variant="top"
                  src={`${server_url}/courses/thumbnails/${course.image}`}
                  alt={course.title}
                  style={{ height: 180, objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: mainPurple }}>{course.title}</Card.Title>
                  <Card.Text>{course.description.substring(0,100)}....</Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <Button
                      variant="outline-primary"
                      style={{
                        borderColor: mainPurple,
                        color: mainPurple,
                        fontWeight: "bold",
                        borderRadius: 20,
                        transition: "background 0.2s, color 0.2s",
                      }}
                      onClick={() => handleShowModal(course)}
                    >
                      <FaInfoCircle className="me-1" /> Info Selengkapnya
                    </Button>
                    {isAdmin && (
                      <div className="d-flex gap-2 m-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          style={{
                            borderRadius: 20,
                            fontWeight: "bold",
                            borderWidth: 2,
                            borderColor: "#28a745",
                            color: "#28a745",
                            background: "#eaffea",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          href={`edit/course/${course.id}`}
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          style={{
                            borderRadius: 20,
                            fontWeight: "bold",
                            borderWidth: 2,
                            borderColor: "#dc3545",
                            color: "#dc3545",
                            background: "#fff0f3",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          onClick={() => deleteCourse(course.id)}
                        >
                          <FaTrash className="me-1" /> Hapus
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <ConfirmSubscription {...{showModal,setShowModal,course:selectedCourse,formatToIDR,courses:data}}/>
      </Container>
      <footer
        className="text-center py-4 mt-5"
        style={{
          background: mainPurple,
          color: "#fff",
          letterSpacing: 1,
          fontWeight: 500,
        }}
      >
        &copy; {new Date().getFullYear()} CodeBeginner. Belajar Programming dengan Mudah dan Nyaman.
      </footer>
    </div>
  );
}