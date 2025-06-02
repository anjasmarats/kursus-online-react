import NavbarComponent from '../NavbarComponent';
import { Form,Button, InputGroup, Alert } from 'react-bootstrap';
import auth from '../../scripts/auth';
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { server_url } from '../../scripts/url';
import { set_duration, set_email, set_name, set_role } from '../../scripts/profiledataedit';
import { useDispatch } from 'react-redux';

function Authentication({register}) {
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

    const dispatch = useDispatch();

    const formData = new FormData()

    const Login = async(e) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${server_url}/api/login`, data)
            const data_response = res.data.data
            const expiration = new Date().getTime() + 1000* 60 * 10
            console.log("dataresponse",data_response)
            localStorage.setItem("session", data_response.logind)
            localStorage.setItem("expiration", expiration)
            if (data_response.role==="admin") {
                dispatch(set_role("admin"))
            } else {
                dispatch(set_role("user"))
            }
            if (data_response.activation_time!=null) {
                const { time,date } = JSON.parse(data_response.activation_time)
                dispatch(set_start_time(time))
                dispatch(set_duration(date))
            }
            dispatch(set_name(data_response.name))
            dispatch(set_email(data_response.email))
            setError(null)
            navigate('/')
        } catch (e) {
            if (e.response) {
                if (e.response.status === 500) {
                    setError("Internal Server Error")
                }

                if (e.response.status===404) {
                    setError("pengguna tidak ditemukan")
                }
    
                if (e.response.status===400) {
                    setError("password salah")
                }
            }
            console.error(e)
        }
    }

    const registerUser = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${server_url}/api/user`, data)
            const data_response = await res.data.data
            const expiration = new Date().getTime() + 1000* 60 * 10
            localStorage.setItem("session", data_response.logind)
            localStorage.setItem("expiration", expiration)
            if (data_response.activation_time!=null) {
                const { time,date } = JSON.parse(data_response.activation_time)
                dispatch(set_start_time(time))
                dispatch(set_duration(date))
            }
            setError(null)
            navigate('/')
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setError("Internal Server Error")
                }
                if (error.response.status===400) {
                    setError("email sudah ada, silahkan login")
                }
            }
            console.error(error)
        }
    }
    console.log("register",register)

    const authGoogle = async (e) => {
        try {
            e.preventDefault()
            const res = await axios.post(`${server_url}/api/auth/google`, formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            const data_response = await res.data
            const expiration = new Date().getTime() + 1000* 60 * 10
            localStorage.setItem("session", data_response.data)
            localStorage.setItem("expiration", expiration)
            setError(null)
            navigate('/')
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setError("Internal Server Error")
                }
            }
            console.error(error)
        }
    }

    const cekAuth = async () => {
        try {
            const data = await auth()
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

    return(
        <main className='register'>
            <NavbarComponent/>
            <article className='mt-5 my-5'>
                {error&&(<Alert variant='danger' key={"danger"} className='col-lg-4 col-sm-8 col-10 mx-auto mt-5 mb-3'>{error}</Alert>)}
                <section className='row'>
                <aside className={`col-lg-4 col-sm-8 col-10 mx-auto ${error&&'my-5'} shadow-lg rounded-3 py-3 px-2`}>
                    <Form onSubmit={register?registerUser:Login}>
                        {register&&(
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Nama</Form.Label>
                                <Form.Control required={true} type="search" onChange={(e)=>setData({...data,name:e.target.value})} placeholder="Nama" />
                            </Form.Group>
                        )}
                        
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
                            {register?"Daftar":"Login"}
                        </Button>
                    </Form>
                    <div className='text-center my-3'>{register?"Sudah punya akun?":"Belum punya akun?"} <Link to={register?"/login":"/register"} style={{ "cursor":"pointer" }} className='text-success text-decoration-none'>{register?"Login di sini":"Daftar di sini"}</Link></div>
                </aside>
                </section>
            </article>
        </main>
    )    
}

export default Authentication;