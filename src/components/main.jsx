import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './Register.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="register" element={<Register />} />
    </Routes>
  </Router>,
)
