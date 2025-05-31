import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../styles/NavbarComponent.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import { Alert, Form } from 'react-bootstrap';
import { InputGroup } from 'react-bootstrap';
import { FaEye,FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { server_url } from '../scripts/url';

const NavbarComponent = (props) => {
    const { editUser,loading,authorized,fetchData,setEditUser,isAdmin } = props

    const { name,email,photo,password } = editUser||{}

    // console.log(editUser)

    const [show, setShow] = useState(false);
    const [error,setError] = useState(null)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showPassword, setShowPassword] = useState(false)

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
            
            await fetchData()
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
    
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    
    const navigate = useNavigate()

    const register = () => {
        navigate('/register')
    }

    const logout =()=>{
        localStorage.removeItem("session")
        localStorage.removeItem("expiration")
        navigate('/logout')
    }

    console.log("loading",loading)

    return (
        <>
            <Navbar
                expand="lg"
                style={{
                background: "#cc00cc",
                boxShadow: "0 2px 12px rgba(204,0,204,0.09)",
                }}
                variant="dark"
            >
                <Container>
                {!loading&&(
                    <>
                    <Navbar.Brand style={{ fontWeight: 700, fontSize: "1.5rem" }}>
                        <span style={{ color: "#fff" }}>Hi AppS</span>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                        {authorized?(
                            <>
                                <Nav.Link href="#" style={{ color: "#fff" }}>
                                Kursus
                                </Nav.Link>
                                <Nav.Link href="#" style={{ color: "#fff" }}>
                                Profil
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Button variant="outline-light" onClick={()=>register()} className='fw-bolder'>Daftar</Button>
                                <Nav.Link href="/login" className='text-light text-center'>Masuk</Nav.Link>
                            </>
                        )}
                        </Nav>
                    </Navbar.Collapse>
                </>
                )}
                </Container>
            </Navbar>

            <Modal show={show} onHide={handleClose}>
                <Form onSubmit={update}>
                <Modal.Header closeButton>
                <Modal.Title>Data Profil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error&&(<Alert variant='danger' key={"danger"} className='w-100 mx-auto mt-5 mb-3'>{error}</Alert>)}
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control required={true} value={name} type="search" onChange={(e)=>setEditUser({...editUser,name:e.target.value})} placeholder="Nama" />
                    </Form.Group>
                                        
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control required={true} type="email" value={email} onChange={(e)=>setEditUser({...editUser,email:e.target.value})} placeholder="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-3 mt-2">
                            <Form.Control type={showPassword?'text':'password'} onChange={(e)=>setEditUser({...editUser,password:e.target.value})} placeholder="Password" />
                            <Button variant="btn btn-secondary" onClick={handleShowPassword}>
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
    )
}

export default NavbarComponent