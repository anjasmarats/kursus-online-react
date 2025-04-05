import { useEffect, useState } from 'react'
import '../styles/App.css'
import NavbarComponent from './NavbarComponent.jsx'
import axios from 'axios'
import auth from '../scripts/auth.js'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState(null)
  const [admin, setAdmin] = useState(false)

  const fetchData = async () => {
    try {
      const {data,admin} = await auth()
      if (data) {
        if (admin) {
          setAdmin(true)
        }
        setAuthorized(true)
      }
      const response = await axios.get('/api/courses')
      const result = await response.data
      setData(result.courses)
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError("Internal Server Error")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
      <main className='app'>
        <NavbarComponent />
        {!authorized&&(<section className="my-5 brand p-3 d-lg-flex flex-row-reverse justify-content-between align-items-center">
          <aside className='text-center col-12 col-lg-6 my-4'>
            <img src="/dev-hiapps.jpg" className='rounded-circle' alt=""/>
          </aside>
          <aside className='col-12 col-lg-6 text-center font-brand my-4'>Hi AppS<br/>Belajar Membuat Program Software<br/>dengan Mudah dan Nyaman</aside>
        </section>)}
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
