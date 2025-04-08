import { useEffect, useState } from 'react'
import '../styles/App.css'
import NavbarComponent from './NavbarComponent.jsx'
import axios from 'axios'
import auth from '../scripts/auth.js'
import { server_url } from '../scripts/url.js'
import { CgProfile } from 'react-icons/cg'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    start_time: "",
    duration: "",
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

  const fetchData = async () => {
    try {
      const {data,admin} = await auth()
      if (data) {
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
          name: name,
          email: email,
          photo: photo
        })
        await getPhoto()
        if (admin) {
          setAdmin(true)
        }
        setAuthorized(true)
      }
      const response = await axios.get(`${server_url}/api/courses`)
      const result = await response.data
      setData(result.courses)
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

  console.log("admin = ",admin)
  return (
    <>
      <main className='app'>
        <NavbarComponent admin={admin}/>
        <section className="my-5 brand p-3 d-lg-flex flex-row-reverse justify-content-between align-items-center">
          <aside className='text-center col-12 col-lg-6 my-4'>
            {authorized ?
            photo ? <img src={photo} className='rounded-circle' alt=""/> : <CgProfile size={180}/>
            :
            <img src="/dev-hiapps.jpg" className='rounded-circle' alt=""/>}
          </aside>
          <aside className={`col-12 col-lg-6 text-center ${!authorized&&'font-brand'}`}>
            {authorized ?
            (
            <>
              <div className="name">
                <h3 className={`${authorized?'profiledata-name':'display-4'} text-center fw-bolder`}>{profileData.name}</h3>
              </div>
              <div className="email">
                <h5 className={`${authorized?'profiledata-email text-wrap':'fw-bolder display-5'} text-center`}>{profileData.email}</h5>
              </div>
              <div className="periode">
                {profileData.duration&&profileData.start_time&&<h5 className={`${!authorized&&'text-center'} fw-bolder display-5`}>Masa berlaku {profileData.duration} (sejak {profileData.start_time})</h5>}
              </div>
            </>
          ):(
            <>
              Hi AppS<br/>Belajar Membuat Program Software<br/>dengan Mudah dan Nyaman
            </>
          )}</aside>
        </section>
        <section className="courses container-fluid">
          <div className='container my-5'>
              <h1 className='text-center fw-bolder display-4'>Courses</h1>
              {loading ? 
              <div className='row loading-main'>
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
              : data.map((v,k) => (
                <div key={k} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div class="card" style="width: 18rem;">
                    <img src="..." class="card-img-top" alt="..." />
                    <div class="card-body">
                      <h5 class="card-title">{v.title}</h5>
                      <p class="card-text">{v.description}</p>
                      <a href="#" class="btn btn-primary">Daftar</a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default App
