import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Modal } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaClock, FaEye, FaEyeSlash } from "react-icons/fa";
import NavbarComponent from "../NavbarComponent";
import { server_url } from "../../scripts/url";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { profile_data, set_email, set_name } from "../../scripts/profiledataedit";

export default function UserProfile() {
    const profileData = useSelector(profile_data);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [editUser, setEditUser] = useState({
      name: "",
      email: "",
      password: "",
      photo: "",
    })

    const [show, setShow] = useState(false);
    const [error,setError] = useState(null)
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const accentColor = "#cc00cc";
    const accentGradient = "linear-gradient(90deg, #cc00cc 0%, #ff66cc 100%)";

    const userData = {
        name: "Jane Doe",
        email: "jane.doe@email.com",
        password: "password",
        subscriptionStart: "2023-01-15T10:30:00Z",
        subscriptionMonths: 18,
    };

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    const update = async(e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            const { name,email,password,photo } = editUser
            formData.append("name",name)
            formData.append("email",email)
            formData.append("password",password)
            formData.append("photo",photo)
            await axios.put(`${server_url}/api/user`,formData, {
                headers: {
                    "Content-Type":"multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("session")}`
                }
            })
            // console.log(editUser)
            dispatch(set_name(name))
            dispatch(set_email(email))
            handleClose()
        } catch (error) {
            if (error.response) {
                if (error.response.status===500) {
                    setError("Internal Server Error")
                }
            }
            setError("Error")
            console.error(error)
        }
    }

    return (
        <>
            <NavbarComponent/>
            <Container className="d-flex justify-content-center align-items-center min-vh-50 p-2" style={{ background: "#f8f0fa" }}>
                <Card style={{
                    minWidth: 380,
                    maxWidth: 420,
                    width: "100%",
                    border: "none",
                    borderRadius: 24,
                    boxShadow: "0 8px 32px rgba(204,0,204,0.15)",
                    background: "#fff"
                }}>
                    <Card.Body>
                        <div
                            style={{
                                background: accentGradient,
                                borderRadius: "50%",
                                width: 80,
                                height: 80,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px auto",
                                boxShadow: "0 4px 16px rgba(204,0,204,0.15)",
                            }}
                        >
                            <FaUser size={40} color="#fff" />
                        </div>
                        <h3 className="text-center mb-4" style={{ color: accentColor, fontWeight: 700, letterSpacing: 1 }}>
                            Profil Akun
                        </h3>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: accentColor, fontWeight: 500 }}>
                                    <FaUser style={{ marginRight: 8 }} />
                                    Nama
                                </Form.Label>
                                <Form.Control value={profileData.name||""} readOnly style={{ background: "#f6e6fa", border: "none" }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: accentColor, fontWeight: 500 }}>
                                    <FaEnvelope style={{ marginRight: 8 }} />
                                    Email
                                </Form.Label>
                                <Form.Control value={profileData.email||""} readOnly style={{ background: "#f6e6fa", border: "none" }} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label style={{ color: accentColor, fontWeight: 500 }}>
                                    <FaLock style={{ marginRight: 8 }} />
                                    Password
                                </Form.Label>
                            </Form.Group>
                            <Row>
                                <Col xs={12} md={7}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: accentColor, fontWeight: 500 }}>
                                            <FaCalendarAlt style={{ marginRight: 8 }} />
                                            Mulai Berlangganan
                                        </Form.Label>
                                        <Form.Control
                                            value={formatDate(profileData.subscriptionStart||"")}
                                            readOnly
                                            style={{ background: "#f6e6fa", border: "none" }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={5}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: accentColor, fontWeight: 500 }}>
                                            <FaClock style={{ marginRight: 8 }} />
                                            Lama (bulan)
                                        </Form.Label>
                                        <Form.Control
                                            value={profileData.subscriptionMonths||""}
                                            readOnly
                                            style={{ background: "#f6e6fa", border: "none" }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="d-grid">
                                <Button
                                    style={{
                                        background: accentGradient,
                                        border: "none",
                                        fontWeight: 600,
                                        letterSpacing: 1,
                                        borderRadius: 12,
                                        marginTop: 8,
                                    }}
                                    onClick={handleShow}
                                    size="lg"
                                >
                                    Edit Profil
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={update}>
                <Modal.Header closeButton>
                <Modal.Title>Data Profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error&&(<Alert variant='danger' key={"danger"} className='w-100 mx-auto mt-5 mb-3'>{error}</Alert>)}
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control required={true} value={editUser.name||profileData.name||""} type="search" onChange={(e)=>setEditUser({...editUser,name:e.target.value})} placeholder="Nama" />
                    </Form.Group>
                                        
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required={true} type="email" value={editUser.email||profileData.email||""} onChange={(e)=>setEditUser({...editUser,email:e.target.value})} placeholder="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-3 mt-2">
                            <Form.Control type={showPassword?'text':'password'} onChange={(e)=>setEditUser({...editUser,password:e.target.value})} placeholder="Password" />
                            <Button variant="btn btn-secondary" onClick={()=>setShowPassword(!showPassword)}>
                                {showPassword ? <FaEyeSlash size={32}/> : <FaEye size={32}/>}
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type='submit'>
                    Simpan
                </Button>
                </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}