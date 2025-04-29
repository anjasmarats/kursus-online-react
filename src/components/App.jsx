import { useEffect, useState } from 'react'
import '../styles/App.css'
import NavbarComponent from './NavbarComponent.jsx'
import axios from 'axios'
import auth from '../scripts/auth.js'
import { server_url } from '../scripts/url.js'
import { CgProfile } from 'react-icons/cg'
import { Card,Button } from 'react-bootstrap'

function App() {
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

  const getPhoto = async()=>{
    try {
      const res = await fetch(`${server_url}/api/user/photo`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("session")}`
        }
      })
      
      if (res.status === 500) {
        setError("Internal Server Error")
        return
      }

      if (res.status===200) {
        const blob = await res.blob()
        setPhoto(URL.createObjectURL(blob))
      }
    } catch (error) {
      setError("Error")
      console.error(`error app ${error}`)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const getThumbnail = async(data)=>{
    try {
      const res = await fetch(`${server_url}/api/course/photo`, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${data}`
        }
      })
      
      if (res.status === 500) {
        setError("Internal Server Error")
        return
      }

      if (res.status===200) {
        const blob = await res.blob()
        return URL.createObjectURL(blob)
      }
    } catch (error) {
      setError("Error")
      console.error(`error app ${error}`)
      setLoading(false)
    } finally {
      setLoading(false)
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

        await getPhoto()
        if (adminuser) {
          setIsAdmin(true)
        }
        setAuthorized(true)
      }
      const response = await axios.get(`${server_url}/api/courses`)
      const res = await response.data
      for (let i = 0; i < res.courses.length; i++) {
        const thumbnailCourse = await getThumbnail(res.courses[i].image)
        res.courses[i].image = thumbnailCourse
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

  useEffect(() => {
    fetchData()
  }, [])

  console.log("data = ",data)
  return (
    <>
      <main className='app'>
        <NavbarComponent {...{editUser,loading,authorized,fetchData,setEditUser,isAdmin}}/>
        <section className={`${isAdmin?'':'my-5 p-3'} brand ${loading?'container mx-auto w-100 loading bg-secondary rounded-5':isAdmin?`d-none`:`d-lg-flex flex-row-reverse justify-content-between align-items-center`}`}>
          <aside className='text-center col-12 col-lg-6 my-4'>
            {authorized ?
            photo ? <img src={photo} className={`img rounded-circle ${loading?'d-none':''}`} alt=""/> : <CgProfile size={180}/>
            :
            <img src="/dev-hiapps.jpg" className={`img rounded-circle ${loading?'d-none':''}`} alt=""/>}
          </aside>
          <aside className={`col-12 col-lg-6 ${loading?'mx-auto w-25 loading bg-secondary rounded-5':''} text-center ${!authorized&&'font-brand'}`}>
            {loading?<>&nbsp;</>:authorized ?
            (
            <>
              {/* <div className="name">
              </div>
              <div className="email">
              <h5 className={`${authorized?'profiledata-email text-wrap':'fw-bolder display-5'} text-center`}>{profileData.email}</h5>
              </div> */}
              <div className={`${authorized?'profiledata-name':'display-4'} text-center fw-bolder`}>
                Halo, {profileData.name} <br />Selamat Belajar
              </div>
              <div className="periode">
                {profileData.duration&&profileData.start_time&&<h5 className={`${authorized?'':'text-center'} fw-bolder display-5`}>Masa berlaku {profileData.duration} (sejak {profileData.start_time})</h5>}
              </div>
            </>
          ):(
            <>
              Hi AppS<br/>Belajar Membuat Program Software<br/>dengan Mudah dan Nyaman
            </>
          )}
          </aside>
        </section>
        <section className="courses container-fluid">
          <div className={`container ${isAdmin?'':'my-5'}`}>
              {isAdmin ?
              (
                <div className={`d-flex justify-content-between align-items-center py-4 container`}>
                  <span className='fw-bolder fs-3'>Courses</span>
                  <a href="/post/course" className='btn btn-primary'>Kursus Baru</a>
                </div>
              )
              :
              (
                <h1 className={`text-center fw-bolder display-4 ${loading&&'loading bg-secondary rounded-5'}`}>{!loading&&'Courses'}</h1>
              )}
              {loading ? 
              <div className='row loading-main my-5'>
                <div className="col-lg-4 col-sm-6 col-11">
                  <div className="w-100 bg-secondary m-4 rounded-3">&nbsp;</div>
                </div>
                <div className="col-lg-4 col-sm-6 col-11">
                  <div className="w-100 bg-secondary m-4 rounded-3">&nbsp;</div>
                </div>
                <div className="col-lg-4 col-sm-6 col-11">
                  <div className="w-100 bg-secondary m-4 rounded-3">&nbsp;</div>
                </div>
              </div>
              :
              error ? 
              <div className='fw-bolder text-danger display-5 text-center mx-auto mt-5'>{error}</div>
              : (
                <>
                  <aside className='row overflow-auto'>
                    {data&&data.length>0&&data.map((v,k) => (
                      <div key={k} className='col-12 col-lg-4'>
                        <Card className='mb-3'>
                          <Card.Img variant="top" src={v.image} />
                          <Card.Body>
                            <Card.Title>{v.title}</Card.Title>
                            <Card.Text>
                              {v.description}
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </aside>
                </>
              )
              }
          </div>
        </section>
      </main>
    </>
  )
}

export default App
