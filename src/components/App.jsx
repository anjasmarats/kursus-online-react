import { useState } from 'react'
import '../styles/App.css'
import NavbarComponent from './NavbarComponent.jsx'

function App() {
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
      </main>
    </>
  )
}

export default App
