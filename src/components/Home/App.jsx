import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
} from "react-bootstrap";
import { FaEdit, FaTrash, FaInfoCircle, FaPlusCircle, FaShoppingCart } from "react-icons/fa";
import BrandHeader from "./BrandHeader";
import InfoSection from "./InfoSection";
import SubscriptionOffer from "./SubscriptionOffer";
import NavbarComponent from "../NavbarComponent";
import auth from "../../scripts/auth";
import axios from "axios";
import { server_url } from "../../scripts/url";
import ConfirmSubscription from "./ConfirmSubscription";
import { set_name,set_email,set_start_time,set_duration, set_role, profile_data } from "../../scripts/profiledataedit";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

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
  const profileData = useSelector(profile_data);
  const dispatch = useDispatch();

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
      const result = await auth()
      if (result) {
        const res = await axios.get(`${server_url}/api/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("session")}`
          }
        })
        const result = await res.data
        const { name,email,activation_time,role } = result.data
        if (activation_time) {
          const { time,date } = JSON.parse(activation_time)
          dispatch(set_start_time(time))
          dispatch(set_duration(date))
        }
        dispatch(set_name(name))
        dispatch(set_email(email))

        // await getPhoto()
        if (role==="admin") {
          dispatch(set_role("admin"))
          setIsAdmin(true)
        } else {
          dispatch(set_role("user"))
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
      <NavbarComponent/>
      <Container style={{ maxWidth: 1200, marginTop: 30 }}>
        {loading ? (
          <>
            <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
            <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
            <div className="bg-secondary loading m-3 rounded-3 p-3">&nbsp;</div>
          </>
        ) : (
          <BrandHeader {...{isAdmin,authorized,profileData}} />
        )}
        <InfoSection {...{loading}}/>
        <SubscriptionOffer {...{loading}}/>
        <hr style={{ borderColor: mainPurple, margin: "40px 0" }} />
        <div className="d-flex justify-content-between align-items-center mb-4">
          {loading ? (
            <div className="bg-secondary loading rounded-5 px-5 py-2">&nbsp;</div>
          ) : (
            <h3 className="mb-0" style={{ color: mainPurple }}>
              Daftar Kursus
            </h3>
          )}
            {isAdmin&&(
              <Link to={"/post/course"} className="text-decoration-none">
                <Button
                  variant={loading?"secondary":""}
                  style={{
                    background: loading?"":mainPurple,
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
                  disabled={loading}
                  className={loading?"loading":""}
                >
                  {loading ? (
                    <div className="bg-secondary loading px-5">&nbsp;</div>
                  ) : (
                    <div className="text-light">
                      <FaPlusCircle className="me-2" /> Tambah Kursus Baru
                    </div>
                  )}
                </Button>
              </Link>
            )}
        </div>
        <Row className="g-4">
          {data&&data.length>0&&data.map((course,key) => (
            <Col md={4} key={key}>
              <Card
                style={{
                  borderColor: loading?"":mainPurple,
                  background: loading?"":"#e0b3ff",
                  boxShadow: "0 2px 12px rgba(204,0,204,0.07)",
                  transition: loading?"":"transform 0.15s",
                }}
                className={loading?"h-100 shadow-sm course-card bg-secondary loading":"h-100 shadow-sm course-card"}
              >
                {loading ? (
                  <div className="bg-secondary loading m-3 rounded-3 p-5">&nbsp;</div>
                ) : (
                  <>
                    <Card.Img
                      variant="top"
                      src={`${server_url}/courses/thumbnails/${course.image}`}
                      alt={course.title}
                      style={{ height: 180, objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title style={{ color: mainPurple }}>{course.title}</Card.Title>
                      <Card.Text>{course.description.length>100?`${course.description.substring(0,100)}....`:course.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Link to={`/detail/course/${course.courseId}`}>
                          <Button
                            variant="outline-primary"
                            style={{
                              borderColor: mainPurple,
                              color: mainPurple,
                              fontWeight: "bold",
                              borderRadius: 20,
                              transition: "background 0.2s, color 0.2s",
                            }}
                          >
                            <FaInfoCircle className="me-1" /> Info Selengkapnya
                          </Button>
                        </Link>
                        {isAdmin ? (
                          <div className="d-flex gap-2 m-2">
                            <Link
                              to={`detail/course/${course.courseId}`}
                            >
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
                              >
                                <FaEdit className="me-1" /> Edit
                              </Button>
                            </Link>
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
                              onClick={() => deleteCourse(course.courseId,course.title)}
                            >
                              <FaTrash className="me-1" /> Hapus
                            </Button>
                          </div>
                        ) : (<Button
                              variant="gradient"
                              style={{
                                background: "linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)",
                                color: "#fff",
                                fontWeight: 700,
                                border: "none",
                                borderRadius: 24,
                                boxShadow: "0 4px 16px rgba(255,117,140,0.18)",
                                fontSize: 18,
                                transition: "transform 0.12s, box-shadow 0.12s, background 0.18s",
                                outline: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                letterSpacing: 0.5,
                              }}
                              className="purchase-btn p-2 mx-2"
                              onClick={() => handleShowModal(course)}
                              onMouseOver={e => {
                                e.currentTarget.style.transform = "scale(1.06)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,117,140,0.22)";
                                e.currentTarget.style.background =
                                  "linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%)";
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,117,140,0.18)";
                                e.currentTarget.style.background =
                                  "linear-gradient(90deg, #ff7eb3 0%, #ff758c 100%)";
                              }}
                            >
                              <FaShoppingCart style={{ fontSize: 20}} />
                              <span>Langganan Sekarang</span>
                            </Button>
                          )}
                      </div>
                    </Card.Body>
                  </>
                )}
              </Card>
            </Col>
          ))}
        </Row>
        <ConfirmSubscription {...{showModal,setShowModal,course:selectedCourse,courses:data}}/>
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