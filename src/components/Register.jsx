import { FcGoogle } from 'react-icons/fc'
import NavbarComponent from './NavbarComponent';
import { Form,Button, InputGroup } from 'react-bootstrap';
import auth from '../scripts/auth';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';

function Register() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const register = async (e) => {
        try {
            e.preventDefault()
            await axios.post('/api/user', data)
            navigate('/')
        } catch (error) {
            if (error.response && error.response.status === 500) {
                setError("Internal Server Error")
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
                <section className='row'>
                    {error ? (
                    <div className='fw-bolder text-danger display-5 text-center mx-auto mt-5'>{error}</div>
                    ) : (
                            <>
                                <aside className='col-lg-4 col-sm-8 col-10 mx-auto my-5 shadow-lg rounded-3 py-3 px-2'>
                                    <Button variant="outline-dark" className='w-100 rounded-3 p-2'>
                                        <FcGoogle className='me-3' size={28}/>Lanjutkan dengan Google</Button>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <hr className='border-3 me-3 w-100'/>ATAU<hr className='border-3 ms-3 w-100'/>
                                    </div>
                                    <Form onSubmit={register}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>Email address</Form.Label>
                                            <Form.Control required={true} type="email" onChange={(e)=>setData({...data,email:e.target.value})} placeholder="Enter email" />
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
                                            Submit
                                        </Button>
                                    </Form>
                                </aside>
                            </>
                    )}
                </section>
            </article>
        </main>
    )    
}

export default Register;