import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import "../styles/NavbarComponent.css";
import { useNavigate } from 'react-router-dom';

const NavbarComponent = (props) => {
    const { admin } = props
    const handleLogout = () => {
        localStorage.removeItem("session")
        localStorage.removeItem("expiration")
    }

    const navigate = useNavigate()

    const register = () => {
        navigate('/register')
    }
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
                        {admin ? 
                            <Nav.Link href="#action2" className='text-light fs-5 text-center'>Profil</Nav.Link>  
                        : 
                        (
                            <>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Button variant="outline-light" onClick={()=>register()} className='fw-bolder'>Daftar</Button>
                                <Nav.Link href="#action2" className='text-light text-center'>Masuk</Nav.Link>
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