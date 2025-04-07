import { FcGoogle } from 'react-icons/fc'
import NavbarComponent from './NavbarComponent';
import { Form,Button, InputGroup, Alert } from 'react-bootstrap';
import auth from '../scripts/auth';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { server_url } from '../scripts/url';

function Register() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const register = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${server_url}/api/user`, data)
            const data_response = await res.data
            const expiration = new Date().getTime() + 1000* 60 * 10
            localStorage.setItem("session", data_response.session)
            localStorage.setItem("expiration", expiration)
            setError(null)
            navigate('/')
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setError("Internal Server Error")
                } else {
                    setError("Error")
                }
            }
            console.error(error)
        }
    }

    const cekAuth = async () => {
        try {
            const { data } = await auth()
            if (data) {
                navigate('/')
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setError("Internal Server Error")
            }
            console.error(error)
        }
    }

    useEffect(() => {
        cekAuth()
    }, [])
    return(
        <main className='register'>
            <NavbarComponent/>
            <article>
                {error&&(<Alert variant='danger' key={"danger"} className='col-lg-4 col-sm-8 col-10 mx-auto mt-5 mb-3'>{error}</Alert>)}
                <section className='row'>
                <aside className={`col-lg-4 col-sm-8 col-10 mx-auto ${error&&'my-5'} shadow-lg rounded-3 py-3 px-2`}>
                                    <Button variant="outline-dark" className='w-100 rounded-3 p-2'>
                                        <FcGoogle className='me-3' size={28}/>Lanjutkan dengan Google</Button>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <hr className='border-3 me-3 w-100'/>ATAU<hr className='border-3 ms-3 w-100'/>
                                    </div>
                                    <Form onSubmit={register}>
                                    <Form.Group className="mb-3" controlId="formBasicName">
                                            <Form.Label>Nama</Form.Label>
                                            <Form.Control required={true} type="search" onChange={(e)=>setData({...data,name:e.target.value})} placeholder="Nama" />
                                        </Form.Group>
                                        
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control required={true} type="email" onChange={(e)=>setData({...data,email:e.target.value})} placeholder="email" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="formBasicPassword">
                                            <Form.Label>Password</Form.Label>
                                            <InputGroup className="mb-3 mt-2">
                                                <Form.Control required={true} type={showPassword?'text':'password'} onChange={(e)=>setData({...data,password:e.target.value})} placeholder="Password" />
                                                <Button variant="btn btn-secondary" onClick={handleShowPassword}>
                                                    {showPassword ? <FaEyeSlash size={32}/> : <FaEye size={32}/>}
                                                </Button>
                                            </InputGroup>
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Daftar
                                        </Button>
                                    </Form>
                                    <div className='text-center my-3'>Sudah punya akun? <a href='/login' className='text-success text-decoration-none'>Login di sini</a></div>
                                </aside>
                </section>
            </article>
        </main>
    )    
}

export default Register;