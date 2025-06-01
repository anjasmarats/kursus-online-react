import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "../styles/NavbarComponent.css";
import { Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import auth from '../scripts/auth';
import { persistor } from '../app/store';
import { useDispatch } from 'react-redux';
import { set_time_out_session } from '../scripts/profiledataedit';

const NavbarComponent = () => {

    const [loading,setLoading] = useState(false)
    const [authorized,setAuthorized] = useState(false)
    const dispatch = useDispatch()

    const cekauth =async()=>{
        setLoading(true)
        const result = await auth()
        if (!result) {
            await persistor.purge()
            dispatch(set_time_out_session())
        }
        console.log("result",result)
        setAuthorized(result)
        setLoading(false)
    }
    console.log("authorized",authorized)

    useEffect(()=>{
        cekauth()
    },[])

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
                        <Link to={"/"} className='text-decoration-none'>
                            <span style={{ color: "#fff" }}>Hi AppS</span>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse>
                        <Nav className="ms-auto">
                        {authorized?(
                            <>
                                <Link className='mx-2 text-decoration-none' to={"#"} style={{ color: "#fff" }}>
                                    Kursus
                                </Link>
                                <Link className='mx-2 text-decoration-none' to={"/profile"} style={{ color: "#fff" }}>
                                    Profil
                                </Link>
                            </>
                        ) : (
                            <div className='align-items-center'>
                                <Link to={"/register"}>
                                    <Button variant="outline-light" className='fw-bolder'>Daftar</Button>
                                </Link>
                                <Link to={"/login"} className='text-light text-center m-3 text-decoration-none'>Masuk</Link>
                            </div>
                        )}
                        </Nav>
                    </Navbar.Collapse>
                </>
                )}
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarComponent