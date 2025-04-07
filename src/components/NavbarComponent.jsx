import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "../styles/NavbarComponent.css";
import { useNavigate } from 'react-router-dom';
import auth from '../scripts/auth';
import { useEffect, useState } from 'react';

const NavbarComponent = () => {
    const [authorized,setAuthorized] = useState(false)
    const cekAuth = async () => {
        try {
            const { data } = await auth()
            if (data) {
                setAuthorized(true)
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setError("Internal Server Error")
            }
            console.error(error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("session")
        localStorage.removeItem("expiration")
        navigate('/')
    }

    const navigate = useNavigate()

    const register = () => {
        navigate('/register')
    }

    useEffect(()=>{
        cekAuth()
    },[])
    return (
        <>
            <Navbar key={'lg'} expand={'lg'} className="navbar-app mb-3">
                <Container fluid>
                    <Navbar.Brand href="/" className='text-light'>HiAppS</Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${'lg'}`} />
                    <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${'lg'}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${'lg'}`}
                    placement="end"
                    >
                    <Offcanvas.Header closeButton className='nav-mobile text-light'>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${'lg'}`}>
                        Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='nav-mobile'>
                        {authorized ? (
                            
                            <Nav.Link style={{ "cursor":"pointer" }} onClick={()=>handleLogout()} className='text-light text-center'>Logout</Nav.Link>
                        ):(
                            <>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Button variant="outline-light" onClick={()=>register()} className='fw-bolder'>Daftar</Button>
                                <Nav.Link href="/login" className='text-light text-center'>Masuk</Nav.Link>
                                </Nav>
                            </>
                        )}
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarComponent