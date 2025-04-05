import { useState } from 'react'
import '../styles/App.css'
import NavbarComponent from './NavbarComponent.jsx'
import axios from 'axios'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/courses')
      const result = await response.data
      setData(result.courses)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <main className='app'>
        <NavbarComponent />
        <section className="my-5 brand p-3 d-lg-flex flex-row-reverse justify-content-between align-items-center">
          <aside className='text-center col-12 col-lg-6 my-4'>
            <img src="/dev-hiapps.jpg" className='rounded-circle' alt=""/>
          </aside>
          <aside className='col-12 col-lg-6 text-center font-brand my-4'>Hi AppS<br/>Belajar Membuat Program Software<br/>dengan Mudah dan Nyaman</aside>
        </section>
        <section className='container'>
            {loading ? 
            (
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
            )
            : 
            error ? 
            <p>Error: {error.message}</p>
            : data.map((course) => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <img src={course.image} className="card-img-top" alt={course.name} />
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </section>
      </main>
    </>
  )
}

export default App
